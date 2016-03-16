/**
 * Find out which account settings page to load based on user level
 *
 * @param employee
 * @returns hjs file to render
 */
function getPage(employee) {
    switch (employee.permissionLevel) {
        case 1: // place holder
        case 2:
            return 'business/level_2/addAppointment';
            break
        case 3:
            return 'business/level_3/addAppointment';
            break;
        default: // default level 4
            return 'business/level2/addAppointment';
            break;
    }
}

exports.get = function(req, res){

    var eid = req.user[0]._id;
    var db = req.db;
    var employees = db.get('employees');

    employees.find({_id: eid}, function (err, result) {
        var emp = result[0];
        res.render(getPage(emp));
    });
};


