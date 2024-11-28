const router = require('express').Router();
// ngambil dari index di controller
// const registerController = require('../controller').register;
// ngambil file register langsung
const { formRegister, saveRegister }  = require('../controller/registerController');
const verifyUser = require('../library/verify');

router.get('/', verifyUser.isLogout, formRegister);
router.post('/save', verifyUser.isLogout, saveRegister);

module.exports = router;