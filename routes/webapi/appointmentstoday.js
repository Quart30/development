/**
 * Loads ObjectID from MongoDB module, mongodb.
 */
var ObjectID = require('mongodb').ObjectID;

/**
 * Obtains all appointments for today for the given employee.
 */
exports.get = function (req, res) {
    var db = req.db;
    var appointments = db.get('appointments');

    //Get the start and end of today
    var begin = new Date();
    begin.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23, 59, 59, 999);

    appointments.find({
        employee: ObjectID(req.user[0]._id)
    },{sort : {date: 1}}, function (err, results) {
        if (err) {
            console.error('MongoDB Error in /api/employee/:eid/appointments/today: ' + err);
            return res.send(500);
        }

        //Heroku likes to live in the past...or the future. I'm not too sure.
        var app = require('../../app');
        if (app.get('env') === 'production') {
            for (var i = 0; i < results.length; i++) {
                results[i].date.setHours(results[i].date.getHours() + 8);
            }
        }

        res.json(results);
    });
};
