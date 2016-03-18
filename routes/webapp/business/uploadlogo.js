var fs = require('fs');
var auth = require('../../../lib/auth');

/**
 * Find out which account settings page to load based on user level
 *
 * @param employee
 *          1: load everything
 *          2: load everything
 *          3: load everything
 *          4: error
 * @returns hjs file to render
 */
function getPage(employee) {
    switch (employee.permissionLevel) {
        case 2: return 'business/level_2/uploadlogo';
        case 3: return 'business/level_3/uploadlogo';
        default: return 'error';
    }
}

exports.get = function(req, res, next){

    var db = req.db;
    var businesses = db.get('businesses');
    var businessID = req.user[0].business;

    businesses.findById(businessID,
        function (err, results){
            if(err){
                return next(err);
            }

            if(results.logo){

                res.render(getPage(req.user[0]),
                    {title:'Upload Logo',logo: results.logo});
            }
            else{
                res.render(getPage(req.user[0]),
                    {title:'Upload Logo'});
            }
        }
    );

};

exports.post = function(req, res, next){

    var db = req.db;
    var businesses = db.get('businesses');
    var businessID = req.user[0].business;

    if(req.files.userLogo){

        businesses.findById(businessID,
            function (err, results){

                if(err){
                    return next(err);
                }
                if (results.logo !== 'images/dentalLogo.jpg')
                  fs.unlink('public/'+results.logo);
            }
        );

        businesses.updateById(businessID, {
                $set: {
                    logo: '/images/uploads/' + req.files.userLogo.name
                }
            },{
                upsert: true
            }, function (err){
                if (err) {
                    return next(err);
                }

                res.render(getPage(req.user[0]),{
                    success:'Succesfully uploaded file: '+req.files.userLogo.originalname,
                    bg: "images/bg.jpg",  // + business.style.bg
                    logo:'/images/uploads/'+req.files.userLogo.name
                });

            }

        );
    }
    else{

        businesses.findById(businessID,
            function (err, results){
                if(err){
                    return next(err);
                }

                if(results.logo){

                    res.render(getPage(req.user[0]),{
                        title:'Upload Logo',
                        logo:results.logo,
                        bg: "images/bg.jpg",  // + business.style.bg
                        error:'Please select a valid image(png,jpg) file to upload.'
                    });
                }
                else{
                    res.render(getPage(req.user[0]),{
                        title:'Upload Logo',
                        bg: "images/bg.jpg",  // + business.style.bg
                        error:'Please select a valid image(png,jpg) file to upload.'
                    });
                }
            }
        );
    }

};
