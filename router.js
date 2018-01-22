const AuthenticationController = require('./controllers/authenticationController');
const express = require('express');
const passport = require('passport');
const panelRoutes = require('./router/panelRouter');
const geneRoutes = require('./router/geneRouter');
require('./config/passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router();
  const authRoutes = express.Router();
  panelRoutes.init(apiRoutes);
  geneRoutes.init(apiRoutes);

  // =========================
  // General Routes
  // =========================
  //   apiRoutes.get('/users', function(req, res) {
  //     res.status(200).json({
  //       ok: true,
  //       users: [{id: '1', firstName: 'nombre', lastName: 'lastName'}],
  //     });
  //   });

  // Ping routes
  apiRoutes.get('/ping', function(req, res) {
    res.status(200).json({
      ok: true,
    });
  });

  // Private routes
  //   apiRoutes.get('/protected', requireAuth, function(req, res, next) {
  //     res.status(200).json({
  //       content: 'Respuesta desde api protected',
  //     });
  //   });

  // =========================
  // Auth Routes
  // =========================

  // Set auth routes as subgroup/middleware to apiRoutes
  //   apiRoutes.use('/auth', authRoutes);

  // Registration route
  //   authRoutes.post('/register', AuthenticationController.register);

  // Login route
  //   authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
