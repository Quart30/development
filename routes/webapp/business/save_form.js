exports.post = function (req, res) {
    var formData = (req.body.saveData);
    var formName = (req.body.formName);
    var bid = req.user[0].business;
    var formDB = req.db.get('forms');
    var message;

    // make sure valid data provided
    if (!formName || !formData || !bid) {
        //send error message, stay on same page
        res.render('business/formBuilder', {title: 'Express', error: 'Please fill in all fields.'});
        return;
    }

    // check if a form with this name already exists
    formDB.find({business: bid, name: formName}, function (err, result) {
        if (err) {
            res.render('business/formBuilder', {title: 'Express', error: 'Error occurred, please try again.'});
            return;
        }

        if (result.length > 0) {
            console.log(result)
            res.render('business/formBuilder', {title: 'Express', error: 'Form with this name already exists.'});
            return;
        }

        // insert form into database
        formDB.insert({business: bid, name: formName, data: formData}, function (err, result) {

            if (err) {
                res.render('business/formBuilder', {title: 'Express', error: 'Error occurred, please try again.'});
                return;
            }
            console.log("Inserted formName: " + formName + "\n formData: " + formData + "business: " + bid);
            res.render('business/formBuilder', {title: 'Express', error: 'Form successfully saved.'});
        });
    });
};
