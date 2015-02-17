var express = require('express');
var router = express.Router();

//No associated use case so far
router.get('/office/:id/done', function (req, res, next) {
    res.render('checkin/done', {title: 'Express'});
});

//Appointment Info
router.get('/office/:id/apptinfo', function (req, res, next) {
    res.render('checkin/apptinfo', {title: 'Express'});
});

//Enter Code
router.get('/office/:id/entercode', function (req, res, next) {
    res.render('checkin/entercode', {title: 'CompanyName'});
});

//No Code
router.get('/office/:id/nocode', function (req, res, next) {
    res.render('checkin/nocode', {title: 'Express'});
});

//Checkin Start
router.get('/office/:id/checkin', function (req, res, next) {
    res.render('checkin/checkin', {title: 'Express'});
});

//Custom Form
router.get('/office/:id/customform', function (req, res, next) {
    res.render('checkin/customform', {title: 'Express'});
});

module.exports = router;
