var auth = require('../../../lib/auth');
var ObjectId = require('mongodb').ObjectID;

var validateFields = function (body) {
	if (body.fname === '') {
		return 'Invalid first name';
	}

	if (body.lname === '') {
		return 'Invalid last name';
	}

	if (body.phone === '') {
		return 'Invalid phone number';
	}

	if (body.companyName === '') {
		return 'Invalid company name';
	}

	if (body.email === '' || body.password === '') {
		return 'Invalid email and/or password';
	}

	if (body.email !== body.email2) {
		return 'Emails do not match';
	}

	if (body.password !== body.password2) {
		return 'Passwords do not match';
	}

	return 'OK';
};

exports.get = function (req, res) {
	if (!req.session.companyName) {
        res.render('business/register');
    } else {
        res.render('business/register', {title: 'Employee Sign-up', companyName: req.session.companyName});
    }
};

exports.post = function (req, res) {
	console.log('Incoming request fields: ' + Object.getOwnPropertyNames(req.body));

	var businessDB = req.db.get('businesses');
	var employeeDB = req.db.get('employees');
	var formDB = req.db.get('forms');

	var fieldsCheck = validateFields(req.body);
	if (fieldsCheck !== 'OK') {
		res.render('/business/register', {message: fieldsCheck});
		return;
	}

	var businessData = {
		email: req.body.email,
		password: auth.hashPassword(req.body.password),
		companyName: req.body.companyName,
		phone: req.body.phone,
		fname: req.body.fname,
		lname: req.body.lname,
		logo: '',
		walkins: false,
		slack: 'none'
	};

	var findExistingBusinessCallback = function (err, business) {
		if (err) {
			throw err;
		}

		console.log('Preexisting business: ');
		console.log(business);

		if (!business) {
			console.log('No business found, inserting.');
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
		var userData = {
			business: ObjectId(businessID),
			password: result.password,
			phone: result.phone,
			fname: result.fname,
			lname: result.lname,
			email: result.email,
			smsNotify: true,
			emailNotify: true,
			permissionLevel: 2,
			company: result.companyName
		};
		console.log('Successfully inserted new business.');
		console.log('Inserting new employee for the business');
		employeeDB.insert(userData, insertEmployeeCallback);
	};

	var insertEmployeeCallback = function (err, result) {
		if (err) {
			console.log('Error inserting new employee.');
			throw err;
		}
		console.log('Successfully inserted new employee.');
		formDB.insert({business: result.business, data: ''});
		res.json({message: 'Signup successful! Please log in.'});
	};

	businessDB.findOne({email: req.body.email}, findExistingBusinessCallback);
};
