import errorStrings from '../common/error-strings';

export default (resource, scheme) => (req, res, next) => {
  const errors = {};

  Object.keys(scheme).forEach(key => {
    if (!scheme[key](req.body[key])) {
      errors[key] = errorStrings[resource][key];
    }
  });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
