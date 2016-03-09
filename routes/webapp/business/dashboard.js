var auth = require('../../../lib/auth');

exports.get = function (req, res) {
	var employeeId = req.user[0]._id;
	var employeename = req.user[0].fname;

    //delete me
    var employeeLastName = req.user[0].lname;
    var employeePhone = req.user[0].phone;
    var employeePermission = req.user[0].permissionLevel;
    var walkinsAllowed = req.user[0].walkins;
    var companyName = "";

    var companyName = req.user[0].company;

    var page; // page to load
    switch (req.user[0].permissionLevel) {
        case 1:
        case 2: // level2/3 have the same views
        case 3:
            page = 'business/level_2/dashboard';
            break;
        default: // default level 4
            page = 'business/level_4/dashboard';
            break;
    }
    res.render(page, {title: 'Dashboard',
		eid: employeeId,
		employeeName: employeename,
        employeeLast: employeeLastName,
        employeePhone: employeePhone,
        employeePermission: employeePermission,
        walkinsAllowed: walkinsAllowed,
        companyName: companyName,
		message: req.flash("permission")
	});
};
