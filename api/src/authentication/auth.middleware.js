import passport from 'passport';

const authMiddleware = passport.authenticate('jwt', { session: false });

const roleMiddleware = roleName => (req, res, next) => {
  if (req.user && req.user.role === roleName) {
    next();
  } else {
    res.status(403).send({
      message: 'Resource is forbidden.',
    });
  }
};

export {
  authMiddleware,
  roleMiddleware,
};
