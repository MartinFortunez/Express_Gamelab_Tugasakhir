var express = require('express');
var router = express.Router();
var {home} = require('../controller/homeController')
var { profile } = require('../controller/profileController');
var { isLogin } = require('../library/verify');

router.get('/',isLogin, home);
router.get('/profile', isLogin, profile);


module.exports = router;
