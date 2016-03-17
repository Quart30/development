var auth = require('../../../lib/auth');
var ObjectId = require('mongodb').ObjectID;

function debug(message) {

    var app = require('../../../app');

    if (app.get('env') === 'development')
        console.log(message);
}

var validateFields = function (body) {
	if (body.fname === '') {
		return 'Invalid first name';
	}

	if (body.lname === '') {
		return 'Invalid last name';
	}

    var phone = body.phone.replace(/\D/g,''); // only numbers
	if (phone === '' || phone.length !== 10) {
		return 'Invalid phone number';
	}

	if (body.companyName === '') {
		return 'Invalid company name';
	}

	if (body.email === '' || body.email.indexOf('@')  === -1) {
		return 'Invalid email';
	}

	if (body.password === '') {
		return 'Invalid password';
	}

	if (body.password !== body.password2) {
		return 'Passwords do not match';
	}

	return 'OK';
};

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

exports.get = function (req, res) {
	if (!req.session.companyName) {
        res.render('business/register');
    } else {
        res.render('business/register', {title: 'Employee Sign-up', companyName: req.session.companyName});
    }
};

exports.post = function (req, res) {

	debug('Incoming request fields: ' + Object.getOwnPropertyNames(req.body));

	var businessDB = req.db.get('businesses');
	var employeeDB = req.db.get('employees');
	var formDB = req.db.get('forms');

    var fieldsCheck = '' + validateFields(req.body);

	if (fieldsCheck !== 'OK') {
		res.render('business/register', {message: fieldsCheck});
		return;
	}

    var phone = req.body.phone.replace(/\D/g,''); // only numbers
	var businessData = {
		email: req.body.email,
		password: auth.hashPassword(req.body.password),
		companyName: req.body.companyName,
		phone: phone,
		fname: req.body.fname,
		lname: req.body.lname,
		logo: 'images/dentalLogo.jpg',
		bg: 'images/dark-blur.jpg',
		walkins: false,
		slack: 'none'
	};

	var findExistingBusinessCallback = function (err, business) {
		if (err) {
			throw err;
		}

		debug('Preexisting business: ');
		debug(business);

		if (!business) {
			debug('No business found, inserting.');
			businessDB.insert(businessData, insertBusinessCallback);
		}
		else {
		  res.json({message: 'This company is already registered!'});
	  }
	};

	var insertBusinessCallback = function (err, result) {
		if (err) {
			throw err;
		}
		var businessID = result._id.toString();
        var phone = result.phone.replace(/\D/g,''); // only numbers
		var userData = {
			business: ObjectId(businessID),
			password: result.password,
			phone: phone,
			fname: result.fname,
			lname: result.lname,
			email: result.email,
			smsNotify: true,
			emailNotify: true,
			permissionLevel: 2,
            permissionName: 'Owner',
			company: result.companyName
		};

        // insert form/check in account (level_5)

        // get valid username (don't try to email it)
        var adr = result.companyName.toLowerCase().replace(' ', ''); // replace whitespace
        // characters
        switch (adr.length) {
            case 0: adr = 'thd';
                    break;
            case 1: adr = adr.concat('hc');
                    break;
            case 2: adr = adr.concat('z');
                    break;
            default: adr = adr.slice(0,3);
                    break;
        }

        // numbers and check for uniqueness
        //var i = 0;
        //var good = false;
        //while (!good) {
        //
        //    var temp_adr;
        //    if (i < 10)
        //        temp_adr = adr.concat('00' + i + '@herald.app');
        //    else if (i < 100)
        //        temp_adr = adr.concat('0' + i + '@herald.app');
        //    else
        //        temp_adr = adr.concat('' + i + '@herald.app');
        //
        //    employeeDB.find({email: temp_adr}, {limit: 1}, function(err, result) {
        //        if (result == '') {
        //            good = true;
        //            adr = temp_adr;
        //        }
        //    });
        //
        //    i++; // try the next number
        //}

        // stolen from stackoverflow http://stackoverflow.com/questions/10726909/random-alpha-numeric-string-in-javascript
        var ran_password = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        debug(adr + '\'s password: ' + ran_password);

        // check in credentials
        var check_in = {
            business: ObjectId(businessID),
            email: adr,
            password: auth.hashPassword(ran_password),
            permissionLevel: 5,
            permissionName: 'Check In Account'
        };

        debug(check_in);

        debug('Successfully inserted new business.');
        debug('Inserting new employee for the business');
		employeeDB.insert(userData, insertEmployeeCallback);
        //employeeDB.insert(check_in); // insert it
	};

	var insertEmployeeCallback = function (err, result) {
		if (err) {
            debug('Error inserting new employee.');
			throw err;
		}
        debug('Successfully inserted new employee.');
		formDB.insert({business: result.business, data: ''}); // insert form
		res.json({message: 'Signup successful! Please log in.'});
	};

	businessDB.findOne({email: req.body.email}, findExistingBusinessCallback);
};
