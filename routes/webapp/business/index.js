var express = require('express');
var router = express.Router();

var landing = require('./landing');
var theming = require('./theming');
var login = require('./login');
var formbuilder = require('./formbuilder');
var accountSettings = require('./accountsettings');
var uploadLogo = require('./uploadlogo');
var register = require('./register');
var dashboard = require('./dashboard');
var addEmployees = require('./addemployees');
var modifyEmployees = require('./modifyemployees');
var employeeRegister = require('./employeeregister');
var viewForm = require('./viewform');
var customizeTheme = require('./customize_theme');
var manageForms = require('./manage_forms');
var businesssetting = require('./businesssetting');
var checkin = require('./checkin');

module.exports = function (passport) {

    //Setup the routes
    router.get('/', landing.get);
    router.post('/', landing.post);

    router.get('/theming', isLoggedIn, theming.get);

    router.post('/login',passport.authenticate('local-login',{
        successRedirect : '/dashboard',
        failureRedirect : '/',
        failureFlash: true
    }));

    router.get('/formbuilder',isLoggedIn, formbuilder.get);
    router.post('/formbuilder', isLoggedIn, formbuilder.post);

    router.get('/accountSettings', isLoggedIn, accountSettings.get);
    router.post('/accountSettings', isLoggedIn, accountSettings.post);

    router.get('/businesssetting', isLoggedIn, businesssetting.get);
    router.post('/businesssetting', isLoggedIn,businesssetting.post);

    router.get('/uploadlogo', isLoggedIn, uploadLogo.get);
    router.post('/uploadlogo', isLoggedIn, uploadLogo.post);

    router.get('/register', register.get);
    // router.post('/register',passport.authenticate('local-signup',{
    //     successRedirect : '/dashboard', // redirect to the secure profile section
    //     failureRedirect : '/register' // redirect back to the signup page if there is an error
    // }));
    router.post('/register', register.post);

    router.get('/dashboard', isLoggedIn, dashboard.get);

    router.get('/addemployees',isLoggedIn, addEmployees.get);
    router.post('/addemployees',isLoggedIn, addEmployees.post);
    router.post('/addemployees/delete', isLoggedIn, addEmployees.delete); // html can only call GET or POST
    router.post('/addemployees/mod', isLoggedIn, modifyEmployees.post);
    router.post('/employeeregister/resend', isLoggedIn, employeeRegister.post);

    router.get('/customizetheme', isLoggedIn, customizeTheme.get);

    router.get('/manageforms', isLoggedIn, manageForms.get);

    router.get('/employeeregister', employeeRegister.get);
    router.post('/employeeregister', passport.authenticate('local-signup-employee',{
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/register' // redirect back to the signup page if there is an error
    }));

    router.get('/viewform/:id', viewForm.get);

    router.get('/checkin', isLoggedIn, checkin.get);
    router.post('/checkin', isLoggedIn, checkin.post);

    router.get('/logout', logOutUser);

    function logOutUser(req, res) {
        req.logOut();
        res.redirect('/');
    }

    function isLoggedIn(req,res,next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    }

    return router;
};
