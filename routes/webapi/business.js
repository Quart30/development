/**
 * Simply fetches all business names in the database as well as their IDs.
 * Should save much headaches in fetching the business IDs for other things,
 * such as adding employees.
 * @param req
 * @param res
 */
exports.get = function(req, res) {
    var businessDB = req.db.get('businesses');
    businessDB.find({}, {sort: {companyName: 1}}, function(err, results) {
        if (err) {
            console.error('MongoDB Error in /api/businesses: ' + err);
            return res.send(500);
        }

        var strippedResults = [];
        for (var i = 0; i < results.length; i++) {
            strippedResults.push({company: results[i].companyName, _id: results[i]._id});
        }

        res.json(strippedResults);
    });
};
