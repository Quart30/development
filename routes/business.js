var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
// var session = require('express-session');




module.exports = function(passport){

router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//Company Registration
router.get('/register', function (req, res) {
    res.render('business/register');
});

//Landing Page
router.get('/', function (req, res) {
    res.render('business/landing', {title: 'Landing Page'});
});

router.get('/login', function(req, res) {
    res.render('business/login.hjs');
});

router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/config',
    failureRedirect : '/login'
}));

//Office Configuration
router.get('/config', isLoggedIn, function (req, res) {
    res.render('business/config', {title: 'Express'});
});

//Form Builder
router.get('/formbuilder', function (req, res) {
    res.render('business/formbuilder', {title: 'Express'});
});


router.post('/register', passport.authenticate('local-signup',{
    successRedirect : '/config', // redirect to the secure profile section
    failureRedirect : '/register' // redirect back to the signup page if there is an error
}));



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/');
}


//Device Reg
router.get('/registerDevice', function (req,res) {
    res.render('business/registerDevice', {title: 'Express'});
});

 return router;
};
