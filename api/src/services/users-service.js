import bcrypt from 'bcrypt';
import errors from './service-errors.js';
import rolesEnum from '../common/roles.enum.js';

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

const getAllUsers = usersData => async (search, searchBy, sort, order, page, pageSize, role) => {
  const result = await usersData.getAll(search, searchBy, sort, order, page, pageSize, role);

  return result;
};

// register
const createUser = usersData => async user => {
  const { username, email } = user;
  const existingUser = await usersData.getBy('username', username)
                    || await usersData.getBy('email', email, true);

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

  const { password } = await usersData.getPasswordBy('user_id', userId);
  const { newPassword, reenteredNewPassword, oldPassword } = passwordData;

  if (newPassword !== reenteredNewPassword || (!await bcrypt.compare(oldPassword, password) && role !== rolesEnum.admin)) {
    return {
      error: errors.BAD_REQUEST,
      result: null,
    };
  }

  const update = await bcrypt.hash(newPassword, 10);
  const _ = await usersData.updatePassword(userId, update);
  return {
    error: null,
    result: { message: 'The password was successfully changed' },
  };
};

// update profile
const update = usersData => async (userUpdate, userId) => {
  const { newEmail, reenteredNewEmail } = userUpdate;
  if (newEmail && newEmail !== reenteredNewEmail) {
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

  if (newEmail && !!(await usersData.getBy('email', newEmail, true))) {
    return {
      error: errors.DUPLICATE_RECORD,
      result: null,
    };
  }

  if (newEmail) {
    existingUser.email = newEmail;
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

export default {
  getUser,
  getAllUsers,
  createUser,
  login,
  changePassword,
  update,
  deleteUser,
  banUser,
  logout,
  changeAvatar,
};
