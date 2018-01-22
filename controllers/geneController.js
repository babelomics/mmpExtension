config = require('../config/main');
const Gene = require('../models/geneModel');
const ResponseMMP = require('../models/responseMMP');

// = =======================================
// Login Route
// = =======================================

exports.count = function(req, res, next) {
  let filter = req.filter !== null ? req.filter : {};

  Gene.count(filter, function(err, count) {
    if (err) {
      console.log('there are %d jungle adventures', count);
    }

    res.status(200).json({
      ok: true,
      error: {
        code: 0,
        message: '',
      },
      response: {
        data: count,
      },
    });
  });
};
exports.readFromXls = function(req, res, next) {
  //   const userInfo = setUserInfo(req.user);
  Gene.count({}, function(err, count) {
    if (err) {
      console.log('there are %d jungle adventures', count);
      res
        .status(500)
        .json(
          new ResponseMMP().responseError(
            {code: 500, message: 'Failed counting genes.'},
            count
          )
        );
    }
    res.status(200).json(new ResponseMMP().response(count));
  });
};
