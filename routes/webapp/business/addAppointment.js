exports.get = function(req, res){

    res.render('business/level_2/addAppointment');
};

// saving appointees to db
exports.post = function(req, res){

    var bid    = req.user[0].business;
    var name   = (req.body.name);
    var number = (req.body.number);
    var date   = (req.body.date);
    var db = req.db;
    console.log(db);

    res.render('business/level_2/addAppointment', {message: "Appointment for " + name + " Added!"});
}
