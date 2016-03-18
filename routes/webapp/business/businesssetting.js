var auth = require ('../../../lib/auth');

/**
 * Find out which account settings page to load based on user level
 *
 * @param employee
 *          1: error
 *          2: load everything
 *          3: load everything minus credit card info
 *          4: error
 * @returns hjs file to render
 */
function getPage(employee) {
    switch (employee.permissionLevel) {
        case 2:
        case 3: return 'business/level_2/businesssetting';
        default: return 'error';
    }
}

function phoneString(phoneNumber) {
    var length = phoneNumber.length;
    var phone_str = phoneNumber;

    switch (length) {
        case 11: phone_str = phone_str.slice(1,12);
        case 10: return '(' + phone_str.slice(0,3) + ') ' + phone_str.slice(3,6) + '-' + phone_str.slice(6);
        default: // no default
            break;
    }
}


exports.get = function (req,res) {
    var bid = req.user[0].business;
    console.log(bid);
    var db = req.db;
    var businesses = db.get('businesses');
    businesses.findById(bid, function (err, result) {
        if (err) {
                return next(err);
            }
        var dbBusiness = result;
        var phone = phoneString(dbBusiness.phone);

        res.render(getPage(req.user[0]), {
            companyName: dbBusiness.companyName,
            phone: phone
        });
    });
};


exports.post = function (req, res) {
    var db = req.db;
    var businesses = db.get('businesses');
    var bid = req.user[0].business;

    var companyName = req.body.companyName;
    var phone = req.body.phone;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;
    businesses.findById(bid, function (err, result) {
        if (err) {
                return next(err);
            }
        var dbBusiness = result;
        var dbPassword = result.password;
         //checks and makes sure to only perform a name, phone email setting
        if(phone  && companyName) {
            //if input fields are empty
            if (companyName === '' || phone === '') {
                phone = phoneString(dbBusiness.phone);
                res.render(getPage(req.user[0]), {
                    error: 'You must fill in all fields.',
                    companyName: dbBusiness.companyName,
                    phone: phone
                });
            }
             else {
                phone = phone.replace(/\D/g, '');
                if(phone.length === 10){
                    //this regex is removing the dashesh from input
                    //its adding 1 in the front for US coutry code
                    phone = '1'+phone;
                    businesses.update({_id:bid}, {
                        //writes in database
                        $set :{
                            companyName: companyName,
                            phone: phone
                        }
                    });
                    phone = phoneString(phone);
                    res.render(getPage(req.user[0]), {
                        companyName: companyName,
                        phone: phone,
                        edited: 'change successfully done.'
                    });
                }
                else{
                    phone = phoneString(dbBusiness.phone);
                    res.render(getPage(req.user[0]), {
                        companyName: dbBusiness.companyName,
                        phone: phone,
                        error: 'phone number should be in 1 xxx-xxx-xxxx format'
                    });
                }

            }
        }// end of undefined password if statement

        //performs only if password submit is pressed
        else if (oldPassword && newPassword && confirmPassword) {
                var boolPsw = auth.validPassword(dbPassword, oldPassword);
                if (boolPsw &&  newPassword === confirmPassword) {
                    newPassword = auth.hashPassword(newPassword);
                    businesses.update({_id:bid}, {
                        $set :{
                            password: newPassword,
                        }
                    });
                    phone = phoneString(dbBusiness.phone);
                    res.render(getPage(req.user[0]), {
                        companyName: dbBusiness.companyName,
                        phone: phone,
                        edited: 'password successfully changed.'
                    });
                }
                else {
                    phone = phoneString(dbBusiness.phone);
                    res.render(getPage(req.user[0]), {
                        companyName: dbBusiness.companyName,
                        phone: phone,
                        error: 'password does not match'
                    });
                }
        }//end of elseif statement
        else {
            phone = phoneString(dbBusiness.phone);
            res.render(getPage(req.user[0]), {
                error: 'You must fill in all fields.',
                companyName: dbBusiness.companyName,
                phone: phone
            });

        }

    });


};
