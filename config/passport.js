// config/passport.js

//monk and db are neeeded because pass.deserialize doesnt pass a req parameter,
//so in order to find the correct id in mongo, we need to make a connection to database and findbyid

var LocalStrategy = require('passport-local').Strategy;
var auth = require('../lib/auth');
var ObjectId = require('mongodb').ObjectID;

function checkEqual(field1, field2) {
    return field1 === field2;
}

//need this since we are passing in a passport dependency in app.js line 22
module.exports = function (passport) {


// =========================================================================
// LOCAL SIGNUP ============================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'


    passport.use('local-signup', new LocalStrategy({

            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            var db = req.db;
            var companyName = req.body.companyName;
            var fname = req.body.fname; //null for now
            var lname = req.body.lname; //null for now
            var phone = req.body.phone;
            // Check if any field has been left blank
            if (companyName === '' || fname === '' || lname === '' || email === ''
                || phone === '' || password === ''
                || !checkEqual(req.body.email, req.body.email2)
                || !checkEqual(req.body.password, req.body.password2)) {
                /*
                IMPORTANT: Currently, I don't know how to get "res" in here, and we need it
                to inform the user they didn't fill the form in correctly. Need to come back
                to this.

                res.render('business/register', {
                    error: 'You must fill in all fields.',
                    companyName: companyName,
                    phone: phone,
                    fname: fname,
                    lname: lname,
                    email: email
                });
                */
                return done(null, false, {message: "Fields left blank, or email/passwords don't match"});
            } else {

                var businesses = db.get('businesses');
                var employees = db.get('employees');
                var forms = db.get('forms');

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                businesses.findOne({'email': email}, function (err, user) {
                    // if there are any errors, return the error

                    if (err) {
                        return done(err);
                    }

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false);
                    } else {

                        // if there is no user with that email
                        // create the user

                        // set the user's local credentials
                        password = auth.hashPassword(password);

                        // save the user
                        businesses.insert({
                            email: email,
                            password: password,
                            companyName: companyName,
                            phone: phone,
                            fname: fname,
                            lname: lname,
                            logo: '',
                            walkins: false,
                            slack: 'none'
                        }, function (err, result) {
                            if (err) {
                                throw err;
                            }

                            var businessID = result._id.toString();

                            forms.insert({
                                 business: ObjectId(businessID),
                                form: {Name: "", Phone:""}
                            });

                            var company = result.companyName;

                            //console.log('Company is ' + company);

                            employees.insert({
                                business: ObjectId(businessID),
                                password: result.password,
                                phone: result.phone,
                                fname: result.fname,
                                lname: result.lname,
                                email: result.email,
                                smsNotify: true,
                                emailNotify: true,
                                permissionLevel: 2,
                                company: company
                            }, function (err, user) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, user);
                            });
                        });
                    }
                });
            }

        }
    ));


    passport.use('local-signup-employee', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {


            var db = req.db;
            var employee = db.get('employees');

            password = auth.hashPassword(password);

            employee.findAndModify({
                    query: {registrationToken: req.query.token},
                    update: {
                        $unset: {registrationToken: 1},
                        $set: {
                            password: password,
                            registered: true
                        }
                    },
                    new: true
                },
                function (err, user) {
                    if (err) {
                        throw err;
                    }
                    return done(null, user);

                }
            );
        }
    ));


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form

            auth.validateLogin(req.db, email, password, function (user) {
                if (!user) {
                    return done(null, false, req.flash("login", "Invalid Email and/or Password"));
                }
                else {
                    return done(null, user);
                }
            });
        }
    ));


};
