/**
 * Loads ObjectID from MongoDB module, mongodb.
 */
var ObjectId = require('mongodb').ObjectID;

/**
 * Convenience API method to create an appointment for a given
 * employee id (eid). The eid, visitor first name, and last name
 * are required. All other parameters are optional. If no date parameters
 * are specified, the current date and time will be used.
 * @param eid the id of the employee the visitor is seeing
 * @param fname the visitor's first name
 * @param lname the visitor's last name
 * @param state the visitor's state. See appointment.controller.js for states
 * @param month the month of the appointment (1-12)
 * @param day day of the month of the appointment (1-31)
 * @param hour hour of the day (0-23)
 * @param minute minute of the hour (0-59)
 */
exports.post = function(req, res) {

    var app = require('../../app');
    var appointmentsDB = req.db.get("appointments");
    var params = req.body;
    var eid = req.user[0]._id;
    var fname = params.fname;
    var lname = params.lname;
    var state = params.state ? params.state : "scheduled";
    var image = params.image ? params.image : "http://placehold.it/50x50";
    var phone = params.phone ? params.phone : "12321";
    //for a list of the possible states and their order, look at appointment.controller.js
    // var date = new Date();
    // date.setSeconds(0);
    // if (params.month)
    //     date.setMonth(params.month - 1);
    // if (params.day)
    //     date.setDate(params.day);
    // if (params.hour)
    //     date.setHours(params.hour);
    // if (params.minute)
    //     date.setMinutes(params.minute);
    var date = new Date(req.body.date + ' ' + req.body.time);

    appointmentsDB.insert({
        employee: ObjectId(eid),
        fname: fname,
        lname: lname,
        state: state,
        date: date,
        image: image,
        phone: phone
    }, function(err, result) {
        if (result) {
            /*this will let the client know the appointments table changed so they can
             refresh it*/
            if (app.get('env') === 'production') {
                date.setHours(date.getHours() + 8);
            }
            app.io.emit('create_appointment',
                {eid: eid, _id: result._id, fname: fname, lname: lname, state: state, date: date, image: image,
                phone: phone});
            res.writeHead(200);
            res.write("Successfully inserted " + fname + " " +
                lname + " into the appointments table. Appt id = " + result._id.toString());
            res.end();


            // ---- slack message ---- //

            var employees = req.db.get('employees');
            var bid;
            employees.findOne({_id: ObjectId(eid)}, function(err, result) {
                //TODO: @Randy, take a look at this
                if (!result) {
                    return;
                }

                bid = result.business; // get the business ID

                // do another search for the slack url of a business
                var businesses = req.db.get('businesses');
                businesses.findOne({_id: ObjectId(bid)}, function(err, result) {
                    if (err)
                        throw(err);
                    //TODO: @Randy, also take a look at this
                    if (result) {
                        // find a slack channel
                        var slack_url = result.slack ? result.slack.toString() : 'none';

                        // make sure we can send the message somewhere
                        if (slack_url != 'none') {
                            var hr = date.getHours();
                            var min = date.getMinutes();
                            var ampm = (hr >= 12) ? 'PM' : 'AM';
                            if (hr == 0)
                                hr = 12;
                            else if (hr > 12)
                                hr -= 12;

                            // add a 0 to mins
                            if (min <= 9)
                                min = '0' + min;

                            // text
                            var text = { 'text': fname + ' ' + lname +
                            ' has checked in for their appointment at ' +
                            hr + ':' + min + ' ' + ampm + '\nCheck it out: <https://heraldcheckin.herokuapp.com/dashboard>'
                            };

                            var options = {
                                url: slack_url,
                                method: 'POST',
                                json: text
                            };

                            request.post(options, function (error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    console.log(body.id); // Print the shortened url.
                                }
                            });
                        }
                    }
                });
            });
        }
    });
};

/**
 * Convenience API call to delete an appointment or appointments.
 * You can just write "all" for apptId and fill in eid to delete all
 * appointments for that employee. Otherwise, simply fill in apptId and
 * don't fill in eid.
 * @param eid employee id. Required for deleting all appointments from this
 * employee, otherwise omit this parameter
 * @param apptId appointment id. If deleting all appointments for an employee,
 * fill in "all". Always required.
 */
exports.delete = function(req, res) {
    var app = require('../../app');
    var appointmentsDB = req.db.get("appointments");
    var params = req.query;
    var eid = params.eid;
    var apptId = params.apptId ? params.apptId : "all";

    if (apptId === "all") {
        appointmentsDB.remove({employee: ObjectId(eid)});
        app.io.emit('delete_all_appointments', {eid: eid});
        res.writeHead(200);
        res.write("Removed all appointments for " + eid + ".");
        res.end();
    }
    else {
        appointmentsDB.findOne({_id: ObjectId(apptId)}, function(err, result) {
            if (result) {
                appointmentsDB.remove({_id: ObjectId(apptId)});
                app.io.emit('delete_one_appointment', {eid: result.employee, _id: apptId});
                res.writeHead(200);
                res.write("Removed appointment " + apptId);
            }
            else {
                res.writeHead(400);
                res.write("Appointment id " + apptId + " does not exist.");
            }
            res.end();
        });
    }
};
