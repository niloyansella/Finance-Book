// Middleware function that checks whether user is authenticated
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) return res.sendStatus(401);
  next();
};

module.exports = isAuthenticated;
