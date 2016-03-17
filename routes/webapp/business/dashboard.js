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
};

function getPage(employee) {
    switch(employee.permissionLevel) {
        case 1: //return 'business/level_1/dashboard';
        case 2: return 'business/level_2/dashboard';
        case 3: return 'business/level_3/dashboard';
        case 4: return 'business/level_4/dashboard';
        case 5: return 'business/checkin';
        default: return 'error';
    }
}

exports.get = function (req, res) {
	var employeeId = req.user[0]._id;
	var employeename = req.user[0].fname;

    //delete me
    var employeeLastName = req.user[0].lname;
    var employeePhone = req.user[0].phone;
    var employeePermission = req.user[0].permissionLevel;
    var walkinsAllowed = req.user[0].walkins;

    var companyName = req.user[0].company;

    var page = getPage(req.user[0]); // get the page
    if (page == 'error')
        res.render('error', {
           message: 'page not found',
           error: '404'
        });
    else
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
