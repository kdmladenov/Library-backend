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

const updateUser = usersData => async (userUpdate, userId) => {
  console.log(userUpdate);
  const existingUser = await usersData.getBy('user_id', userId);

  if (!existingUser) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  if (userUpdate.email && !!(await usersData.getBy('email', userUpdate.email))) {
    return {
      error: errors.DUPLICATE_RECORD,
      user: null,
    };
  }

  const update = { ...existingUser, ...userUpdate };
  const _ = await usersData.update(update);

  return {
    error: null,
    result: update,
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
  updateUser,
  deleteUser,
};
