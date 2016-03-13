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

exports.post = function (req, res) {

	console.log(req.body);
	res.json({message: 'Success'});
};
