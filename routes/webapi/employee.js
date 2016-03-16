/**
 * Loads ObjectID from MongoDB module, mongodb.
 */
var ObjectId = require('mongodb').ObjectID;

var auth = require('../../lib/auth');

/**
 * A convenience API call to create an employee.
 * Usage: Postman POST localhost:4000/createemployee
 * If any of the parameters are excluded, they are filled
 * with placeholder values, except bid, which is required for
 * permission level = 4.
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
exports.post = function (req, res) {
    var employeeDB = req.db.get("employees");
    var params = req.query;
    var bid = params.bid ? ObjectId(params.bid) : 123;
    var fname = params.fname ? params.fname : "First";
    var lname = params.lname ? params.lname : "Last";
    var email = params.email ? params.email : "placeholder@mailinator.com";
    var permission = params.permission ? Number(params.permission) : 4;
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
};

/**
 * Convenience API call for deleting an employee.
 * You need to supply the business id the employee
 * belongs to, as well as the employee's email.
 * @param bid business id
 * @param email employee's email
 */
exports.delete = function (req, res) {
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
};
