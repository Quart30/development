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

        var fname = (req.body.firstName).trim();
        var lname = (req.body.lastName).trim();
        fname = fname.toLowerCase();
        lname = lname.toLocaleLowerCase();
        fname = fname.charAt(0).toUpperCase() + fname.slice(1);
        lname = lname.charAt(0).toUpperCase() + lname.slice(1);
        var name = fname + ' ' + lname;
        var appointmentsDB = req.db.get('appointments');
        appointmentsDB.findOne({fname: fname, lname: lname, phone: req.body.phone}, function(err, apptResult) {
            if (apptResult) {
                var employeesDB = req.db.get('employees');
                employeesDB.findOne({_id: ObjectId(apptResult.employee), business: ObjectId(bid)}, function(err, result) {
                    if (result) {
                        console.log("This is a successful checkin for " + name + " under employee " + result.fname);
                        var app = require('../../../app');
                        app.io.emit('appointment_changed', {apptId: apptResult._id, eid: apptResult.employee, state: 'Checked In'});
                        //TODO finish this
                        appointmentsDB.findAndModify({query: apptResult, update: {$set: {state:'Checked In'}}});
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
