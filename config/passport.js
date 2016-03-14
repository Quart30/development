var LocalStrategy = require('passport-local').Strategy;
var auth = require('../lib/auth');
var ObjectId = require('mongodb').ObjectID;

var loginFields = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
};

module.exports = function (passport) {

  var localAuth = function (req, email, password, next) {
    var localAuthCallback = function (user) {
      if (!user) {
        return next(null, false, req.flash('login', 'Invalid Email and/or Password'));
      }
      else {
        return next(null, user);
      }
    };

    auth.validateLogin(req.db, email, password, localAuthCallback);
  };

  var activateEmployee = function (req, email, password, next) {
    var employeeDB = req.db.get('employees');
    var query = {
      query: {registrationToken: req.query.token},
      update: {
        $unset: {registrationToken: 1},
        $set: {password: auth.hashPassword(password), registered: true}
      },
      new: true
    };

    employeeDB.findAndModify(query, function (err, employee) {
      if (err){
        throw err;
      }
      return next(null, employee);
    });
  };

  passport.use('local-login', new LocalStrategy(loginFields, localAuth));
  passport.use('local-signup-employee', new LocalStrategy(loginFields, activateEmployee));
};
