
exports.get = function (req, res) {
    res.render('business/formBuilder');
};

exports.post = function (req, res) {
    var bid = req.user[0].business;
    var formData = (req.body.formData);
    var formDB = req.db.get('forms');

    if (!formData) {
        console.log('Empty form data.');
        res.render('business/formBuilder', {error: 'Please fill in all fields.'});        
        return;
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
      res.render('business/formBuilder', {error: 'Form successfully saved.'});
    };

    var saveFormCallback = function (err, result) {
        if (err) {
            throw err;
        }
        if (result === null) {
            formDB.insert({business: bid, data: formData}, insertFormCallback);
            return;
        }
        console.log("Updated form successfully.");
        console.log("findAndModify result: " + result);
        res.render('business/formBuilder', {error: 'Form successfully saved.'});
    };

    console.log(formData);
    formDB.findAndModify(query, saveFormCallback);
};
