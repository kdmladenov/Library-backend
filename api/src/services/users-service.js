import bcrypt from 'bcrypt';
import genderEnum from '../common/gender.enum.js';
import errors from './service-errors.js';
import { DEFAULT_USER_ROLE as role } from '../../../config.js';

const getUser = usersData => async userId => {
  const user = await usersData.getBy('user_id', userId);
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

const createUser = usersData => async user => {
  const { username, email } = user;
  const existingUser = await usersData.getBy('username', username)
                    || await usersData.getBy('email', email);

  if (existingUser) {
    return {
      error: errors.DUPLICATE_RECORD,
      result: null,
    };
  }

  const password = await bcrypt.hash(user.password, 10);
  const birthDate = new Date(user.birthDate).toLocaleDateString('af-ZA'); // yyyy/mm/dd
  const gender = +genderEnum[user.gender];

  return {
    error: null,
    result: await usersData.create({ ...user, password, birthDate, gender, role }),
  };
};

const changePassword = usersData => async (userId, passwordData) => {
  const { newPassword, reenteredNewPassword, oldPassword } = passwordData;
  
  if (newPassword !== reenteredNewPassword) {
    return {
      error: errors.BAD_REQUEST,
      result: null,
    };
  }

  const existingUser = await usersData.getBy('user_id', userId);
  if (!existingUser) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  const { password } = await usersData.getPasswordById(userId);
  if (!await bcrypt.compare(oldPassword, password)) {
    return {
      error: errors.OPERATION_NOT_PERMITTED,
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
const update = usersData => async (userUpdate, userId) => {
  const { newEmail, reenteredNewEmail } = userUpdate;

  if (newEmail && newEmail !== reenteredNewEmail) {
    return {
      error: errors.BAD_REQUEST,
      result: null,
    };
  }

  const existingUser = await usersData.getBy('user_id', userId);
  if (!existingUser) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  if (newEmail && !!(await usersData.getBy('email', newEmail))) {
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

const deleteUser = usersData => async (userId, userToDeleteId) => {
  const existingUser = await usersData.getBy('user_id', userToDeleteId);

  if (!existingUser) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  if (userId !== userToDeleteId) {
    return {
      error: errors.OPERATION_NOT_PERMITTED,
      result: null,
    };
  }

  const _ = await usersData.remove(userToDeleteId);

  return {
    error: null,
    result: existingUser,
  };
};
export default {
  getUser,
  createUser,
  changePassword,
  update,
  deleteUser,
};
