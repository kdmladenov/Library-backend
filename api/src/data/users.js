export const users = [];
export const getUserById = () => {

};
export const getAllUsers = () => {

};

export const createUser = (req, res) => {
  const user = {
    id: 1,
    ...req.body,
    readingPoints: 0,
    isBanned: false,
    isAdmin: false,
    isDeleted: false,
  };
  // check if username exists in the DB => if true return null
  // check if email exists in the DB => if true return
  // check if phone exists in the DB => if true return

  // write user to the DB

  users.push(user);

  return user;
};
