import tokenExists from '../data/tokens-data.js';

export default async (req, res, next) => {
  const token = req.headers.authorization.replace('Bearer ', '');

  if (await tokenExists(token)) {
    return res.status(401).send({
      message: ' You are not logged in!',
    });
  }

  await next();
};
