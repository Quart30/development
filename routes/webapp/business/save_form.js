 var isUnique = function(formName,  formsDB){

     // I think we need to get multi-tenancy working; forms should be special to each business
     //formsDB.find(formName, function(err, result){
     //    if (err) {
     //        throw(err); // some err
     //    }
     //
     //});
     return true; // return true for now
 };

 /**
  * Saves a form into the database
  * @param req needs buisness id, form name and form data
  * @param res
  */
 exports.post = function (req, res) {
    var bid = req.body.business;
    var formData = (req.body.saveData);
    var formName = (req.body.formName);
    formName = formName.trim();
    var formsDB = req.db.forms;
    var formNameList;
    console.log("formName: " + formName + "\n formData: " + formData);

    if( formName == null || formData == null){
        //send error message, stay on same page
    }
    else if( !isUnique(formName, formsDB)) { // elif formName isn't unique
        // send error message
    }
    else{
        // function to prevent sql injection needed?
        // add {formData : formName} to data base
        //temp redirect to success page or just post success message
        formsDB.insert({
            business: bid,
            form_name: formName,
            form: formData
        }, function (err, result) {
            if (err) {
                throw(err); // some error occured
            }
        });
    }
    res.render('business/formBuilder', {title: 'Express'});
};
