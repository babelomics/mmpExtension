config = require('../config/main');
const Panel = require('../models/panelModel');

// = =======================================
// Login Route
// = =======================================
exports.readFromXls = function(req, res, next) {
  //   const userInfo = setUserInfo(req.user);

  res.status(200).json({
    ok: true,
    error: {
      code: 0,
      message: '',
    },
    response: {
      data: Panel.count(),
    },
  });
};
