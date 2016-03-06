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

    res.render('business/queue', 
        {
            title: 'Golden Nugget',
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


