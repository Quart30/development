var newrelic = false;

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    newrelic = require('newrelic');
}

var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var async = require('async');
var ObjectId = require('mongodb').ObjectID;
var app = express();

global.__base = __dirname + '/';

//Database
var monk = require('monk');
var mongoURI = process.env.MONGOLAB_URI || 'localhost:27017/robobetty';
console.log('Connecting to DB: ' + mongoURI);
var db = monk(mongoURI);

//login config
var businesses = db.get('businesses');
var employee = db.get('employees');

if (newrelic) {
    app.locals.newrelic = newrelic;
}

//passport functions to Serialize and Deserialize users

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {

    employee.find({_id: id}, function (err, user) {
        if (err) {
            done(err);
        }

        if (user) {
            done(null, user);
        }
    });
});

require('./config/passport')(passport); // pass passport for configuration


var businessRoutes = require('./routes/webapp/business')(passport);

// Load Routes for Mobile
var mobileAuth = require('./routes/api/auth');
var mobileForm = require('./routes/api/form');
var mobileAppointment = require('./routes/api/appointment');
var mobileToken = require('./routes/api/mobiletoken');
var business = require('./routes/api/business');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(multer({
    dest: __dirname + '/public/images/uploads/',
    onFileUploadStart: function (file) {
        console.log(file.mimetype);
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            return false;
        } else {
            console.log(file.fieldname + ' is starting ...');
        }
    },
    onFileUploadData: function (file, data) {
        console.log(data.length + ' of ' + file.fieldname + ' arrived');
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path);
    }
}));


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));


//so... when only using router, for some reason deserialize wont work
//but when using both or just app.use(session), the route works
//note to j

// required for passport
app.use(session({secret: '1234567890QWERTY'}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    req.passport = passport;
    req.app = app;
    next();
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'fonts.googleapis.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
});


// Set Webapp Routes
app.use('/office', require('./routes/webapp/checkin'));
app.use('/', businessRoutes);

app.use("/formBuilder", express.static(__dirname + '/formBuilder'));
// Set Mobile Routes
app.use('/', mobileAuth);
app.use('/api/m/form', mobileForm);
app.use('/api/m/appointment', mobileAppointment);
app.use('/api/m/mobiletoken', mobileToken);
app.use('/api/m/business', business);
app.use('/api/m/example', require('./routes/api/example'));
app.use('/api', require('./routes/webapi'));

var auth = require('./lib/auth');
/**
 * A convenience API call to create an employee.
 * Usage: Postman POST localhost:4000/createemployee
 * If any of the parameters are excluded, they are filled
 * with placeholder values, except bid, which is required for
 * permission level = 3.
 * URL parameters:
 * @param bid business ID
 * @param fname first name
 * @param lname last name
 * @param email email
 * @param permission permission level
 * @param admin does this user have admin priveleges?
 * @param company the employee's company
 * @param phone phone number
 */
app.post('/createemployee', function (req, res) {
    var employeeDB = req.db.get("employees");
    var params = req.query;
    var bid = params.bid ? ObjectId(params.bid) : 123;
    var fname = params.fname ? params.fname : "First";
    var lname = params.lname ? params.lname : "Last";
    var email = params.email ? params.email : "placeholder@mailinator.com";
    var permission = params.permission ? Number(params.permission) : 3;
    var admin = params.admin ? Boolean(params.admin) : false;
    var company = params.company ? params.company : "Placeholder Company";
    var password = params.password ? params.password : "placeholder";
    var phone = params.phone ? params.phone : "1234567890";
    //var newEmployee = {bid: bid, fname: fname, lname: lname, email: email, permissionLevel: permission,
    //admin: admin, company: company, password: password, phone: phone};

    employeeDB.findOne({email: email}, function (err, result) {
        if (err) {
            console.log("/createemployee error: " + err);
        }
        else {
            if (!result) {
                res.writeHead(200);
                employeeDB.insert({
                    business: bid,
                    password: auth.hashPassword(password),
                    phone: phone,
                    fname: fname,
                    lname: lname,
                    email: email,
                    smsNotify: true, //needed?
                    emailNotify: true, //not in use currently
                    admin: admin,
                    permissionLevel: permission,
                    company: company //Permission 1 users don't require company
                }, function(err, result) {
                    if (result) {
                        res.write("Successfully inserted " + fname + " " +
                            lname + ". eid = " + result._id.toString());
                        res.end();
                    }
                });
            }
            else {
                res.writeHead(400);
                res.write("Error: " + fname + " " + lname + " is " +
                    "already in the database.");
                res.end();
                //employeeDB.remove({email: email}, {justOne: true});
            }

        }
    });
});

/**
 * Convenience API call for deleting an employee.
 * You need to supply the business id the employee
 * belongs to, as well as the employee's email.
 * @param bid business id
 * @param email employee's email
 */
app.delete('/deleteemployee', function (req, res) {
    var employeeDB = req.db.get("employees");
    var params = req.query;
    var bid = params.bid ? ObjectId(params.bid) : 123;
    var email = params.email ? params.email : "placeholder@mailinator.com";
    employeeDB.findOne({business: bid, email: email}, function (err, result) {
        if (result) {
            employeeDB.remove(result, {justOne: true});
            res.writeHead(200);
            res.write("Employee with email " + email + " deleted.");
        }
        else {
            res.writeHead(400);
            res.write("Error: Employee " + email + " was not in the database.");
        }
        res.end();
    });
});

/**
 * Convenience API method to create an appointment for a given
 * employee id (eid). The eid, visitor first name, and last name
 * are required. All other parameters are optional. If no date parameters
 * are specified, the current date and time will be used.
 * @param eid the id of the employee the visitor is seeing
 * @param fname the visitor's first name
 * @param lname the visitor's last name
 * @param state the visitor's state. See appointment.controller.js for states
 * @param month the month of the appointment (1-12)
 * @param day day of the month of the appointment (1-31)
 * @param hour hour of the day (0-23)
 * @param minute minute of the hour (0-59)
 */
app.post('/createappointment', function(req, res) {
    var appointmentsDB = req.db.get("appointments");
    var params = req.query;
    var eid = params.eid;
    var fname = params.fname;
    var lname = params.lname;
    var state = params.state ? params.state : "scheduled";
    //for a list of the possible states and their order, look at appointment.controller.js
    var date = new Date();
    date.setSeconds(0);
    if (params.month)
        date.setMonth(params.month - 1);
    if (params.day)
        date.setDate(params.day);
    if (params.hour)
        date.setHours(params.hour);
    if (params.minute)
        date.setMinutes(params.minute);

    appointmentsDB.insert({
        employee: ObjectId(eid),
        fname: fname,
        lname: lname,
        state: state,
        date: date
    }, function(err, result) {
       if (result) {
           res.writeHead(200);
           res.write("Successfully inserted " + fname + " " +
               lname + " into the appointments table. Appt id = " + result._id.toString());
           res.end();
       }
    });
});

/**
 * Convenience API call to delete an appointment or appointments.
 * You can just write "all" for apptId and fill in eid to delete all
 * appointments for that employee. Otherwise, simply fill in apptId and
 * don't fill in eid.
 * @param eid employee id. Required for deleting all appointments from this
 * employee, otherwise omit this parameter
 * @param apptId appointment id. If deleting all appointments for an employee,
 * fill in "all". Always required.
 */
app.delete('/deleteappointment', function(req, res) {
    var appointmentsDB = req.db.get("appointments");
    var params = req.query;
    var eid = params.eid;
    var apptId = params.apptId ? params.apptId : "all";

    if (apptId === "all") {
        appointmentsDB.remove({employee: ObjectId(eid)});
        res.writeHead(200);
        res.write("Removed all appointments for " + eid + ".");
        res.end();
    }
    else {
        appointmentsDB.findOne({_id: ObjectId(apptId)}, function(err, result) {
            if (result) {
                appointmentsDB.remove({_id: ObjectId(apptId)});
                res.writeHead(200);
                res.write("Removed appoimtent " + apptId);
            }
            else {
                res.writeHead(400);
                res.write("Appointment id " + apptId + " does not exist.");
            }
            res.end();
        });
    }
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        console.error(err);
        console.error(err.stack);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    console.error(err);
    console.error(err.stack);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


exports = module.exports = app;

//---delete below this line please
