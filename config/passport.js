// Importing Passport, strategies, and config
const passport = require('passport'),
  User = require('../models/userModel'),
  config = require('./main'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local');

// Setting up local login strategy
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, function(
  email,
  password,
  done
) {
  User.findOne({email: email}, function(err, user) {
    //   if(err) { return done( err); }
    if (!user) {
      return done(null, false, {
        error: 'Your login details could not be verified. Please try again.',
      });
    }

    user.comparePassword(password, function(err, isMatch) {
      // if (err) { return done( err); }
      if (!isMatch) {
        return done(null, false, {
          error: 'Your login details could not be verified. Please try again.',
        });
      }

      return done(null, user);
    });
  });
});

// JWT authentication options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
  // Telling Passport where to find the secret
  secretOrKey: config.secret,
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  console.log(jwtOptions);
  User.findById(payload._id, function(err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
