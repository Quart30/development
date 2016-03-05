 var isUnique = function(formName,  nameList){

     for(var i = 0; i < nameList.length; i++){
         if( formName == nameList[i])
            return false;
     }
     return true;
 }

exports.post = function (req, res) {
    var formData = (req.body.saveData);
    var formName = (req.body.formName);
    formName = formName.trim();
    var db = req.db;
    var formNameList;
    console.log("formName: " + formName + "\n formData: " + formData);

    if( formName == null || formData == null){
        //send error message, stay on same page
    }
    else if( !isUnique(formName, formNameList)) { // elif formName isn't unique
        // send error message
    }
    else{
        // function to prevent sql injection needed?
        // add {formData : formName} to data base
       //temp redirect to success page or just post success message
    }
    res.render('business/formBuilder', {title: 'Express'});
};
