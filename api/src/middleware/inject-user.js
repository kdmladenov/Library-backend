export default (req, res, next) => {
  req.user = {
    userId: 10,
    username: 'hobbitcalculable',
    email: 'firepowersaerators@ShebelisDohas.edu',
  };

  next();
};
