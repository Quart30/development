

exports.get = function(req,res){
    console.log('EMPLOYEE REGISTERED!');
    console.log(req.body);
    res.render('business/registeremployees');
};



