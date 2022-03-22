const express = require('express');
const controller = require('../controller/userController')
const auth = require('../middleware/authenication');

const router = express.Router();

router.post('/signup', controller.signup);
router.post('/emailVerify', controller.emailVerify);
router.post('/userStatus',auth, controller.userStatus);
router.get('/userDetails',auth, controller.userDetails);
router.get('/getWord', controller.getWord);
module.exports = router;
