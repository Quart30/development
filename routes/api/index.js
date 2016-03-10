'use strict';

var express = require('express');
var controller = require('./api.controller');

var router = express.Router();
var auth = require('../../lib/auth');

router.post('/createemployee', auth.isAuthenticated, controller.createemployee);
