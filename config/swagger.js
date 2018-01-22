module.exports.swagger_init = function(app, express) {
  const YAML = require('yamljs');
  const swaggerUi = require('swagger-ui-express');
  const swaggerModelValidator = require('swagger-model-validator');

  const routerSwagger = express.Router();
  const options = YAML.load('./data/swagger/doc.yaml');
  routerSwagger.use('/', swaggerUi.serve, swaggerUi.setup(options));

  // Set auth routes as subgroup/middleware to /api/docs
  app.use('/api/docs', routerSwagger);
};
