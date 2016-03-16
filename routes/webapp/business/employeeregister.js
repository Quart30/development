var transporter = require('nodemailer').createTransport('smtps://quart30dev%40gmail.com:cse112quart@smtp.gmail.com');

exports.get = function(req,res){
    res.render('business/level_2/registeremployees');
};

exports.post = function(req, res) {
    var app = require('../../../app');
    var employeeDB = req.db.get('employees');
    var bid = req.user[0].business;
    var params = req.query;
    var email = params.email;

    employeeDB.find({business: bid, email: email}, {limit: 1}, function (err, result) {

        var registrationLink;
        var fname = result[0].fname;
        var lname = result[0].lname;
        var token = result[0].registrationToken;

        if (app.get('env') == 'production') {
            registrationLink = 'http://heraldcheckin.herokuapp.com/employeeregister?token=' + token;
        }
        else {
            registrationLink = 'http://localhost:4000/employeeregister?token=' + token;
        }

        var message = {
            to: email,
            from: 'quart30dev@gmail.com',
            subject: 'Employee Signup',
            text: 'Hello, ' + fname + ' ' + lname + ',\n\n' + 'Please click on the following link, or paste this into your browser to complete sign-up the process: \n\n' +
            registrationLink
        };

        // send mail with defined transport object
        transporter.sendMail(message, function(error, info){
            if(error){
                return console.log('Email error: ' + error);
            }
            console.log('Confirmation email sent: ' + info.response);
        });
    });

    res.redirect('/addemployees');
};
