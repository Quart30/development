function debug(message) {
    var app = require('../../../app');
    if (app.get('env') === 'development')
        console.log(message);
}

function getPermissionName(permissionLevel) {
    switch (permissionLevel) {
        case 1:
            return 'SaaS';
        case 2:
            return 'Owner';
        case 3:
            return 'Staff';
        case 4:
            return 'Provider';
        default:
            return 'Error';
    }
}


exports.post = function (req, res) {
    var employeeDB = req.db.get('employees');
    var bid = req.user[0].business;
    var params = req.query;
    var email = params.email;
    var lvl = params.lvl;

    employeeDB.find({business: bid, email: email}, {limit: 1}, function (err, result) {

        var own_level = req.user[0].permissionLevel;
        var emp_level = result[0].permissionLevel;

        if (emp_level !== 5) {
            // can only upgrade an account to your level-1
            if (lvl === 'up' && own_level < emp_level - 1)
                mod(employeeDB, result[0], --emp_level);

            // can only downgrade an account to 4 (must be less than your level)
            else if (lvl === 'down' && own_level < emp_level && emp_level !== 4)
                mod(employeeDB, result[0], ++emp_level);
        }
    });

    res.redirect('/addemployees');
};

function mod(employeeDB, emp, level) {
    employeeDB.findAndModify({
            query: {
                _id: emp._id,
                business: emp.business
            },
            update: {$set: {permissionLevel: level, permissionName: getPermissionName(level)}}
        },
        function (err, result) {
            if (err) {
                throw(err);
            }
        }
    );
}
