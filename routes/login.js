const router = require('express').Router();
// cara 1 ambil index
// const loginController = require('../controller').login;
// cara 2 ambil dafri loginController langsung
const { login, logout, loginAuth } = require('../controller/loginController')
const { isLogout } = require('../library/verify');
// // cara 1 ambil index
// router.get('/', verifyUser.isLogout, loginController.login);
// router.get('/logout', loginController.logout);

router.get('/', isLogout, login);
router.get('/logout', logout);

router.post('/auth', loginAuth);

module.exports = router;