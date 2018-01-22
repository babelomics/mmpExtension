const express = require('express');
const PanelController = require('../controllers/panelController');

module.exports.init = function(apiRoutes) {
  const panelRoutes = express.Router();
  apiRoutes.use('/panel', panelRoutes);
  panelRoutes.get('/readFromXls', PanelController.readFromXls);
};
