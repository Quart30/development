

exports.post = function (req, res) {
    var formData = (req.body.saveData);
    var formName = (req.body.formName);
    var db = req.db;
    console.log("formName: " + formName + "\n formData: " + formData);
    /*
     if formName is unique and formData isn't empty
     then insert formName and formData into db
    else
    propogate error to user
    */
    //console.log(req);
    res.render('business/formBuilder', {title: 'Express'});
};
