



exports.post = function(req, res) {
    var employeeDB = req.db.get('employees');
    var businessDB = req.db.get('businesses');
    var bid = req.user[0].business;
    var reqEmail = req.user[0].email;
    var params = req.query;
    var email = params.email;
    var lvl = params.lvl;

    var owner; // is this an owner of the business
    businessDB.findOne({_id: bid}, function (err, result) {
        if (result.email == reqEmail) // if it's an owners account
            owner = 1;
    });

    employeeDB.findOne({business: bid, email: email}, function (err, result) {

        var emp_level = result.permissionLevel;
        // only owners can modify everyone
        if (emp_level !== 2 || owner === 1) {
            if (lvl == 'up' && emp_level > 2) {
                if (owner === 1 || emp_level == 3) // only owner can make other level 2 accounts
                    mod(employeeDB, result, --emp_level);
            }
            else if (lvl == 'down' && emp_level < 4)
                mod(employeeDB, result, ++emp_level);

            // else err
        }
    });

    res.redirect('/addemployees');
};

function mod(employeeDB, emp, level) {
    employeeDB.findAndModify({
            query: { _id: emp._id,
                     business: emp.business},
            update: { $set: {permissionLevel: level} }
        },
        function (err, result) {
            if (err) {
                throw(err);
            }
        }
    );
}
