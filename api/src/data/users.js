export const getUserById = () => {

};
export const getAllUsers = () => {

};

export const createUser = (data) => {
  const user = {
    ...data,
    readingPoints: 0,
    isBanned: false,
    isAdmin: false,
    isDeleted: false,
  };
  // check if username exists in the DB => if true return null
  // check if email exists in the DB => if true return
  // write user to the DB

  return user;
};
