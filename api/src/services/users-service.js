import bcrypt from 'bcrypt';
import errors from './service-errors.js';
import rolesEnum from '../common/roles.enum.js';
import { readingPoints, user as userConstants } from '../common/constants.js';

const getUser = usersData => async (userId, isProfileOwner, role) => {
  const user = await usersData.getBy('user_id', userId, isProfileOwner, role);
  if (!user) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  return {
    error: null,
    result: user,
  };
};

const getUserTimeline = usersData => async (userId) => {
  const userTimeline = await usersData.getTimeline(userId);

  if (userTimeline.length === 0) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  return {
    error: null,
    result: userTimeline,
  };
};

const getAllUsers = usersData => async (search, searchBy, sort, order, page, pageSize, role) => {
  const result = await usersData.getAll(search, searchBy, sort, order, page, pageSize, role);

  return result;
};

// register
const createUser = usersData => async user => {
  if (user.password !== user.reenteredPassword) {
    return {
      error: errors.BAD_REQUEST,
      result: null,
    };
  }

  const existingUser = await usersData.getBy('username', user.username)
                    || await usersData.getBy('email', user.email, true);

  if (existingUser) {
    return {
      error: errors.DUPLICATE_RECORD,
      result: null,
    };
  }

  const password = await bcrypt.hash(user.password, 10);

  return {
    error: null,
    result: await usersData.create({ ...user, password }),
  };
};

// login
const login = usersData => async (username, password) => {
  const user = await usersData.loginUser(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return {
      error: errors.INVALID_LOGIN,
      result: null,
    };
  }

  return {
    error: null,
    result: user,
  };
};

// change password
const changePassword = usersData => async (passwordData, userId, role) => {
  const existingUser = await usersData.getBy('user_id', userId);
  if (!existingUser) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  const { password: savedPassword } = await usersData.getPasswordBy('user_id', userId);
  const { password, reenteredPassword, currentPassword } = passwordData;

  if (password !== reenteredPassword || (!await bcrypt.compare(currentPassword, savedPassword) && role !== rolesEnum.admin)) {
    return {
      error: errors.BAD_REQUEST,
      result: null,
    };
  }

  const update = await bcrypt.hash(password, 10);
  const _ = await usersData.updatePassword(userId, update);
  return {
    error: null,
    result: { message: 'The password was successfully changed' },
  };
};

// update profile
const update = usersData => async (userUpdate, userId) => {
  const { email, reenteredEmail } = userUpdate;
  if (email && email !== reenteredEmail) {
    return {
      error: errors.BAD_REQUEST,
      result: null,
    };
  }

  const existingUser = await usersData.getBy('user_id', userId, true);
  if (!existingUser) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  if (email) {
    const user = await usersData.getBy('email', email, true);
    if (user && user.userId !== userId) {
      return {
        error: errors.DUPLICATE_RECORD,
        result: null,
      };
    }
  }

  const updatedUser = { ...existingUser, ...userUpdate, userId };
  updatedUser.birthDate = new Date(updatedUser.birthDate).toLocaleDateString('af-ZA');
  const _ = await usersData.updateData(updatedUser);

  return {
    error: null,
    result: updatedUser,
  };
};

// delete profile
const deleteUser = usersData => async (userId) => {
  const existingUser = await usersData.getBy('user_id', userId);
  if (!existingUser) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  const _ = await usersData.remove(userId);

  return {
    error: null,
    result: existingUser,
  };
};

// ban an user
const banUser = usersData => async (userId, duration, description) => {
  const user = await usersData.getBy('user_id', userId);

  if (!user) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  const points = Math.floor(duration * readingPoints.GET_BANNED_MULTIPLIER);
  const p = await usersData.updatePoints(userId, points);
  const _ = await usersData.ban(userId, duration, description);

  return {
    error: null,
    result: { message: `Successfully banned user ${userId}.` },
  };
};

const logout = usersData => async (token) => {
  const _ = await usersData.logoutUser(token);
};

const changeAvatar = usersData => async (userId, path) => {
  const _ = await usersData.avatarChange(+userId, path);
};

const getUserAvatar = usersData => async (userId) => {
  const userAvatar = await usersData.getAvatar(userId);

  if (!userAvatar) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  return {
    error: null,
    result: userAvatar,
  };
};

const deleteUserAvatar = usersData => async (userId) => {
  const userAvatar = await usersData.getAvatar(userId);

  if (!userAvatar) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  const _ = await usersData.avatarChange(+userId, userConstants.DEFAULT_AVATAR);
  return {
    error: null,
    result: { message: `Avatar successfully deleted.` },
  };
};

export default {
  getUser,
  getUserTimeline,
  getAllUsers,
  createUser,
  login,
  changePassword,
  update,
  deleteUser,
  banUser,
  logout,
  changeAvatar,
  getUserAvatar,
  deleteUserAvatar,
};
