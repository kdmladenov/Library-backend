import errors from './service-errors.js';

const createUser = usersData => async (data) => {
  const { username, email } = data;
  const existingUser = await usersData.getBy('username', username)
                    || await usersData.getBy('email', email);

  if (existingUser) {
    return {
      error: errors.DUPLICATE_RECORD,
      person: null,
    };
  }

  return {
    error: null,
    user: await usersData.create(data),
  };
};

export default {
  createUser,
};
