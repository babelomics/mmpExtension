const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('crypto');
config = require('../config/main');

/**
 * Function to generate JWT token
 * @param {*} user
 * @return {JWT} jwt valid
 */
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080, // in seconds
  });
}

/**
 * Set user info from request
 * @param {*} request
 * @return {JSON} Return user info
 */
function setUserInfo(request) {
  return {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role,
  };
}

// = =======================================
// Login Route
// = =======================================
exports.login = function(req, res, next) {
  const userInfo = setUserInfo(req.user);

  res.status(200).json({
    ok: true,
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo,
  });
};

// = =======================================
// Registration Route
// = =======================================
exports.register = function(req, res, next) {
  // Check for registration errors
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  // Return error if no email provided
  if (!email) {
    return res.status(422).send({
      error: 'You must enter an email address.',
    });
  }

  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({
      error: 'You must enter your full name.',
    });
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({
      error: 'You must enter a password.',
    });
  }

  User.findOne(
    {
      email,
    },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }

      // If user is not unique, return error
      if (existingUser) {
        return res.status(422).send({
          error: 'That email address is already in use.',
        });
      }

      // If email is unique and password was provided, create account
      const user = new User({
        email,
        password,
        profile: {
          firstName,
          lastName,
        },
      });

      user.save((err, user) => {
        if (err) {
          return next(err);
        }

        // Subscribe member to Mailchimp list
        // mailchimp.subscribeToNewsletter(user.email);

        // Respond with JWT if user was created

        const userInfo = setUserInfo(user);

        res.status(201).json({
          token: `JWT ${generateToken(userInfo)}`,
          user: userInfo,
        });
      });
    }
  );
};
// = =======================================
// Authorization Middleware
// = =======================================

// Role authorization check
// exports.roleAuthorization = function(role) {
//     return function(req, res, next) {
//       const user = req.user;

//       User.findById(user._id, function(err, foundUser) {
//         if (err) {
//           res.status(422).json({ error: 'No user was found.' });
//           return next(err);
//         }

//         // If user is found, check role.
//         if (foundUser.role == role) {
//           return next();
//         }

//         res.status(401).json({ error:
// 'You are not authorized to view this content.' });
//         return next('Unauthorizdded');
//       })
//     }
// }
