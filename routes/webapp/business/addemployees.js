var crypto = require('crypto');
var baby = require('babyparse');
var async = require('async');
var ObjectId = require('mongodb').ObjectID;
var transporter = require('nodemailer').createTransport('smtps://quart30dev%40gmail.com:cse112quart@smtp.gmail.com');

/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */
exports.get = function(req,res){
    var database =  req.db;
    var employeeDB = database.get('employees');
    var employee;
    var notemployee;
    var businessID = req.user[0].business.toString();

    async.parallel({
            employee: function(cb){
                employeeDB.find({registrationToken: {$exists: false}, business: ObjectId(businessID)},function (err,results){

                    if (err) { return next(err);  }
                    if(!results) { return next(new Error('Error finding employee'));}

                    employeee = results;
                    console.log(employeee);
                    cb();

                });
            },
            nonemployee: function(cb){
                employeeDB.find({registrationToken: {$exists: true}, business: ObjectId(businessID)}, function (err,results){


                    if (err) { return next(err); }
                    if(!results) { return next(new Error('Error finding employee'));}

                    notemployee = results;
                    cb();
                });
            }
        },

        function(err,results){

            if(err){
                throw err;
            }

            // load the page
            employeeDB.find({_id: req.user[0]._id}, function (err, results) {
                var emp = results[0];
                var page; // page to load
                switch (emp.permissionLevel) {
                    case 1:
                    case 2:
                        page = 'business/level_2/addemployees';
                        break;
                    // default 3
                    default:
                        page = 'business/level_3/addemployees';
                        break;
                }

                res.render(page,{title: 'Express',notsigned: notemployee, signed: employeee});
            });

        });
};

/**
 * Takes a req and res parameters and is inputted into function to get employee, notemployee, and business data.
 *  Allows the User to input specified data and make changes
 * @param req and res The two parameters passed in to get the apprporiate employee,
 * @returns The appropriate data about the employee
 */



exports.post = function(req,res){
    var parsed = baby.parse(req.body.csvEmployees);
    var rows = parsed.data;
    var database =  req.db;
    var employeeDB = database.get('employees');
    var businessID = req.user[0].business;
    var companyName = req.user[0].company;


    for(var i = 0; i < rows.length; i++){
        var username = rows[i][0];
        var email = rows[i][1].trim();
        var nameArr = username.split(' ');
        var fname = nameArr[0];
        var lname = nameArr[1];
        var token = randomToken();
        employeeDB.insert({
            business: ObjectId(businessID),
            company: companyName,
            fname: fname,
            lname: lname,
            email: email,
            registrationToken : token, //will be removed programmatically once the employee confirms
            admin: false,
            permissionLevel: 4,
            registered: false,
            smsNotify: true, //added to match passport
            emailNotify: true, //added to match passport
            phone: 1234567890 //TODO: maybe add phone number to employee confirmation page?
            /*password: pass*/ //will be added programmatically once the employee confirms
        });

        var message = {
            to: email,
            from: 'quart30dev@gmail.com',
            subject: 'Employee Signup',
            text: 'Hello, ' + fname + ' ' + lname + ',\n\n' + 'Please click on the following link, or paste this into your browser to complete sign-up the process: \n\n' +
            //'http://quart30.herokuapp.com/employeeregister?token=' + token
            'http://localhost:4000/employeeregister?token=' + token
        };

        // send mail with defined transport object
        transporter.sendMail(message, function(error, info){
            if(error){
                return console.log('Email error: ' + error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
    res.redirect('/addemployees');
};


function randomToken() {
    return crypto.randomBytes(24).toString('hex');
}
