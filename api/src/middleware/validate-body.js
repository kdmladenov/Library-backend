import errorStrings from '../common/error-strings.js';

export default (resource, scheme) => async (req, res, next) => {
  const errors = {};
  Object.keys(scheme).forEach(key => {
    console.log(key, req.body[key]);
    if (!scheme[key](req.body[key])) {
      errors[key] = errorStrings[resource][key];
    }
  });

  if (Object.keys(errors).length > 0) {
    console.log(errors);
    return res.status(400).json({ errors });
  }

  await next();
};
