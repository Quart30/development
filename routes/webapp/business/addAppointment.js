/**
 * Find out which account settings page to load based on user level
 *
 * @param employee
 *          1: error
 *          2: load everything
 *          3: load everything
 *          4: error
 * @returns hjs file to render
 */
function getPage(employee) {
    switch (employee.permissionLevel) {
        case 2: // place holder
        case 3: return 'business/level_2/addAppointment';
        default: return 'err';
    }
}

exports.get = function(req, res){

    var db = req.db;
    var employees = db.get('employees');

    res.render(getPage(req.user[0]));
};
