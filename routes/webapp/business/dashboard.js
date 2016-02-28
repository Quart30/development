var auth = require('../../../lib/auth');

exports.get = function (req, res) {
	var employeeId = req.user[0]._id;
	var employeename = req.user[0].fname;

    //delete me
    var employeeLastName = req.user[0].lname;
    var employeePhone = req.user[0].phone;
    var employeePermission = req.user[0].permissionLevel;
    var walkinsAllowed = req.user[0].walkins;

    console.log("First name: " + employeename);

    var companyName = req.user[0].company;


    res.render('business/level_2/dashboard', {title: 'Express',
		eid: employeeId,
		employeeName: employeename,
        employeeLast: employeeLastName,
        employeePhone: employeePhone,
        employeePermission: employeePermission,
        walkinsAllowed: walkinsAllowed,
        companyName: companyName,
		message: req.flash("permission"),
	});
};
