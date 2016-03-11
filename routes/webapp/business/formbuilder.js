
exports.get = function (req, res) {
    res.render('business/formBuilder');
};

exports.post = function (req, res) {
    var formData = (req.body.saveData);
    var formName = (req.body.formName);
    var bid = req.user[0].business;
    var formDB = req.db.get('forms');

    if (!formName || !formData) {
        return res.render('business/formBuilder', {error: 'Please fill in all fields.'});
    }

    var query = {
        query: {business: bid},
        update: {$set: {data: formData}}
    };

    var insertFormCallback = function (err, result) {
      if (err) {
          throw err;
      }
      console.log("Inserted form successfully.");
      console.log("insert result: " + result);
      return res.render('business/formBuilder', {error: 'Form successfully saved.'});
    };

    var saveFormCallback = function (err, result) {
        if (err) {
            throw err;
        }
        if (result === null) {
            return formDB.insert({business: bid, data: formData}, insertFormCallback);
        }
        console.log("Updated form successfully.");
        console.log("findAndModify result: " + result);
        return res.render('business/formBuilder', {error: 'Form successfully saved.'});
    };

    console.log(formName + " " + formData);
    formDB.findAndModify(query, saveFormCallback);
};
