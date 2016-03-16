var auth = require('../../../lib/auth');

var accountType = function( level){
    var name;
    // note: level 4 has no dashboard so doesn't need to display this
    switch(level){
        case 1:
            name = "Admin Account";
            break;
        case 2:
            name = "General Account";
            break;
        case 3:
            name = "Provider Account";
            break;
        default:
            name = "";
            break
    }
    return name;
}
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
    switch (employeePermission) {
        case 1:
        case 2: // level2/3 have the same views
            page = 'business/level_2/dashboard';
            break;
        case 3:
            page = 'business/level_3/dashboard';
            break;
        default: // default level 4
            //TODO: go striaght to signin page
            page = 'business/level_4/dashboard';
            break;
    }
    res.render(page, {title: 'Dashboard',
		eid: employeeId,
		employeeName: employeename,
        employeeLast: employeeLastName,
        employeePhone: employeePhone,
        employeePermission: accountType(employeePermission),
        walkinsAllowed: walkinsAllowed,
        companyName: companyName,
		message: req.flash("permission")
	});
};
