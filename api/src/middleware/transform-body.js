export default (scheme) => async (req, res, next) => {
  Object.keys(scheme).forEach(key => {
    if (!scheme[key]) {
      delete req.body[key];
    }
  });

  await next();
};
