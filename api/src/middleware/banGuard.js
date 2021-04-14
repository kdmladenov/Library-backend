import usersData from '../data/users-data.js';

export default async (req, res, next) => {
  const banRecords = await usersData.getBanRecordsByUserId(req.user.userId);

  if (banRecords.length > 0 && new Date(banRecords[0].exp_date).valueOf() > new Date().valueOf()) {
    return res.status(403).send({
      message: `You are banned!`,
    });
  }

  await next();
};
