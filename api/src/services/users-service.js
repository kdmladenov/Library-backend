import bcrypt from 'bcrypt';
import genderEnum from '../common/gender.enum.js';
import errors from './service-errors.js';
import { DEFAULT_USER_ROLE as role } from '../../../config.js';

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

const deleteUser = usersData => async (userId, deletedUserId) => {
  const existingUser = await usersData.getBy('user_id', deletedUserId);
  if (!existingUser) {
    return {
      error: errors.RECORD_NOT_FOUND,
      result: null,
    };
  }

  if (userId !== deletedUserId) {
    return {
      error: errors.OPERATION_NOT_PERMITTED,
      result: null,
    };
  }

  const _ = await usersData.remove(deletedUserId);

  return {
    error: null,
    result: existingUser,
  };
};
export default {
  createUser,
  deleteUser,
};
