const express = require('express');
const GeneController = require('../controllers/geneController');

module.exports.init = function(apiRoutes) {
  const geneRoutes = express.Router();
  apiRoutes.use('/gene', geneRoutes);
  geneRoutes.get('/count', GeneController.count);
  geneRoutes.get('/readFromXls', GeneController.readFromXls);
  geneRoutes.get('/addReferenceFromXls', GeneController.addReferenceFromXls);
};
