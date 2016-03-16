
exports.get = function (req, res) {
    sendPageWithCurrentForm(req, res, '');
};

exports.post = function (req, res) {
    var bid = req.user[0].business;
    var formData = (req.body.formData);
    var formDB = req.db.get('forms');

    if (!formData) {
        console.log('Empty form data.');
        sendPageWithCurrentForm(req, res, 'Please create a new form.');
        return;
    }

    var query = {
        query: {business: bid},
        update: {$set: {data: formData}},
    };

    var insertFormCallback = function (err, result) {
      if (err) {
          throw err;
      }
      console.log("Inserted form successfully.");
      console.log("insert result: " + result);
    };

    var updateFormCallback = function (err, result) {
        if (err) {
            throw err;
        }
        if (result === null) {
            formDB.insert({business: bid, data: formData}, insertFormCallback);
            return;
        }
        console.log("Updated form successfully.");
        console.log("findAndModify result: " + result.data);
    };

    console.log(formData);
    formDB.findAndModify(query, updateFormCallback);
    res.render('business/formBuilder', {form: formData, error: 'Form successfully updated.'});
};


function sendPageWithCurrentForm(req, res, message) {
    var bid = req.user[0].business;
    var formDB = req.db.get('forms');

    var query = {business: bid};
    var findFormCallback = function (err, result) {
        if (err || result.length === 0) {
            res.render('business/formBuilder');
            return;
        }
        console.log(result);
        console.log(result[0].data);
        res.render('business/formBuilder', {form: result[0].data, error: message});
    };

    formDB.find(query, findFormCallback);
}
