var ObjectId = require('mongodb').ObjectID;

exports.get = function (req, res){

  res.render('business/signin');
};
/*
exports.get = function (req, res) {
	var bid = req.user[0].business;
    var formDB = req.db.get('forms');

    var query = {business: bid};
    var findFormCallback = function (err, result) {
        if (err) {
        	throw err;
        }

        if (result.length === 0) {
            res.render('business/formBuilder', {error: "Please create a form."});
            return;
        }
        console.log(result);
        console.log(result[0].data);
        res.render('business/checkin', {form: result[0].data});
    }

    formDB.find(query, findFormCallback);
};
*/

exports.post = function (req, res) {

	console.log(req.body);
    // use req.body.name, req.body.email, req.body.phone to add visitor to queue


    var bid = req.user[0].business;
    var formDB = req.db.get('forms');

    var query = {business: bid};
    var findFormCallback = function (err, result) {
        if (err) {
            throw err;
        }

        if (result.length === 0) {
            res.render('business/formBuilder', {error: "Please create a form."});
            return;
        }

        var spaceIndex = req.body.name.indexOf(' ');
        var fname = req.body.name.substring(0, spaceIndex);
        var lname = req.body.name.substring(spaceIndex + 1);
        var name = fname + ' ' + lname;
        var appointmentsDB = req.db.get('appointments');
        appointmentsDB.findOne({fname: fname, lname: lname, phone: req.body.phone}, function(err, apptResult) {
            if (apptResult) {
                var employeesDB = req.db.get('employees');
                employeesDB.findOne({_id: ObjectId(apptResult.employee), business: ObjectId(bid)}, function(err, result) {
                    if (result) {
                        console.log("This is a successful checkin for " + name + " under employee " + result.fname);
                        var app = require('../../../app');
                        app.io.emit('appointment_changed', {apptId: apptResult._id, eid: apptResult.employee, state: 'checkedIn'});
                        //TODO finish this
                        appointmentsDB.findAndModify({query: apptResult, update: {$set: {state:'checkedIn'}}});
                    }
                });
            }
        });

        console.log(result);
        console.log(result[0].data);
        res.render('business/checkin', {form: result[0].data});
    };

    formDB.find(query, findFormCallback);
};

