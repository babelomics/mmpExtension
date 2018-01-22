const jwt = require('jsonwebtoken'),
  User = require('../models/userModel'),
  config = require('../config/main');

// = =======================================
// Dashboard Route
// = =======================================
exports.dashboard = function(req, res, next) {
  const userInfo = setUserInfo(req.user);

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo,
  });
};
