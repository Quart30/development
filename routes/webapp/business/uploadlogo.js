var fs = require('fs');
var auth = require('../../../lib/auth');

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

                res.render('business//level_2/uploadLogo',
                    {title:'Upload Logo',logo: results.logo});
            }
            else{
                res.render('business//level_2/uploadLogo',
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

                res.render('business//level_2/customize_theme',{
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

                    res.render('business//level_2/customize_theme',{
                        title:'Upload Logo',
                        logo:results.logo,
                        bg: "images/bg.jpg",  // + business.style.bg
                        error:'Please select a valid image(png,jpg) file to upload.'
                    });
                }
                else{
                    res.render('business//level_2/customize_theme',{
                        title:'Upload Logo',
                        bg: "images/bg.jpg",  // + business.style.bg
                        error:'Please select a valid image(png,jpg) file to upload.'
                    });
                }
            }
        );
    }

};
