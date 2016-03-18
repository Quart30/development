var auth = require('../../../lib/auth');

/**
 * Find out which account settings page to load based on user level
 *
 * @param employee
 *          1: load everything
 *          2: load everything
 *          3: load everything
 *          4: load everything (with correct nav bar)
 * @returns hjs file to render
 */
function getPage(employee) {
    switch (employee.permissionLevel) {
        case 1:
            return 'business/level_1/accountsettings';
        case 2: // place holder
        case 3:
            return 'business/level_2/accountsettings';
        case 4:
            return 'business/level_4/accountsettings';
        default:
            return 'error';
    }
}

function phoneString(phoneNumber) {
    var length = phoneNumber.length;
    var phone_str = phoneNumber;

    switch (length) {
        case 11:
            phone_str = phone_str.slice(1, 12);
        case 10:
            return '(' + phone_str.slice(0, 3) + ') ' + phone_str.slice(3, 6) + '-' + phone_str.slice(6);
        default: // no default
            break;
    }
}

function reload(employees, eid, message) {
    employees.find({_id: eid}, {limit: 1}, function (err, result) {
        var emp = result[0];
        var phone = phoneString("" + emp.phone);

        res.render(getPage(emp), {
            title: 'Express',
            fname: emp.fname,
            lname: emp.lname,
            password: emp.password,
            phone: phone,
            email: emp.email,
            smsNotify: emp.smsNotify,
            emailNotify: emp.emailNotify,
            edited: message
        });
    });
}

/**
 * Takes an req parameter and res parameter and returns the details of a particular employee.
 *
 * @param req The req parameter used to access the database,
 * @returns title, fname, lname, password, phone, email, smsNotify, emailNotify
 */
exports.get = function (req, res) {
    var eid = req.user[0]._id;
    var db = req.db;
    var employees = db.get('employees');

    var fname;
    var lname;
    var phone;
    var sms;
    var email;

    //calls find method to find the correct employee to pull results
    employees.find({_id: eid}, function (err, result) {
        var emp = result[0];
        var phone = phoneString("" + emp.phone);

        res.render(getPage(emp), {
            title: 'Express',
            fname: emp.fname,
            lname: emp.lname,
            password: emp.password,
            phone: phone,
            email: emp.email,
            smsNotify: emp.smsNotify,
            emailNotify: emp.emailNotify,
            message: req.flash("permission")
        });
    });
};

/**
 * Takes an req parameter and res parameter and returns the details of a particular employee. The user
 * is then prompted to change any of the information presented.
 *
 * @param req The req parameter used to access the database,
 * @returns title, fname, lname, password, phone, email, smsNotify, emailNotify
 */
exports.post = function (req, res) {
    var db = req.db;
    var employees = db.get('employees');
    var eid = req.user[0]._id;

    var inputName = req.body.editName;
    var inputPass = req.body.editPassword;
    var inputEmail = req.body.editEmail;
    var inputPhone = req.body.editPhone;
    var textNotify = req.body.sendText;
    var emailNotify = req.body.sendEmail;

    if (inputName != null) {
        var name = inputName.split(' ');

        employees.findAndModify({_id: eid}, {$set: {fname: name[0], lname: name[1]}}, function (err, result) {
            if (err) {
                return handleError(res, err);
            }

            employees.find({_id: eid}, {limit: 1}, function (err, result) {
                var emp = result[0];
                var phone = emp.phone;
            });
        });
    }

    if (inputPass != null) {
        if (inputPass === req.user.Employee[0].password) {
            reload(employees, eid, 'Password successfully changed!');
        }
        else {
            inputPass = auth.hashPassword(inputPass);
            employees.findAndModify({_id: eid}, {$set: {password: inputPass}}, function (err, data) {
                if (err) {
                    return handleError(res, err);
                }

                reload(employees, eid, 'Password successfully changed!');
            });
        }
    }

    if (inputEmail != null) {
        employees.findAndModify({_id: eid}, {$set: {email: inputEmail}}, function (err, data) {
            if (err) {
                return handleError(res, err);
            }

            reload(employees, eid, 'Email successfully changed!');
        });

        // if owner, change business email
        if (req.user[0].permissionLevel === 2) {
            var businessDB = req.db.get('businesses');
            businessDB.findAndModify({_id: req.user[0].business}, {$set: {email: inputEmail}}, function (err, result) {
                if (err) {
                    return handleError(res, err);
                }
            });
        }
    }

    if (inputPhone != null) {
        inputPhone = inputPhone.replace(/\D/g, ''); // numbers only

        if (inputPhone.length === 10) {
            employees.findAndModify({_id: eid}, {$set: {phone: inputPhone}}, function (err, data) {
                if (err) {
                    return handleError(res, err);
                }

                reload(employees, eid, 'Phone number successfully changed!');
            });
        }
        else {
            reload(employees, eid, 'Incorrect phone length');
        }
    }

    if (textNotify != null) {
        if (textNotify === '0') {
            var smsSet = false;
        }
        else {
            var smsSet = true;
        }

        employees.findAndModify({_id: eid}, {$set: {smsNotify: smsSet}}, function (err, data) {
            if (err) {
                return handleError(res, err);
            }

            reload(employees, eid, 'SMS notification settings successfully changed!');
        });
    }

    if (emailNotify != null) {
        if (emailNotify === '0') {
            var emailSet = false;
        }
        else {
            var emailSet = true;
        }
        //find the appropriate employee to set the email and notification settings
        employees.findAndModify({_id: eid}, {$set: {emailNotify: emailSet}}, function (err, data) {
            if (err) {
                return handleError(res, err);
            }

            reload(employees, eid, 'Email notification settings successfully changed!');
        });
    }

};
