const express = require('express');
const controller = require('../controller/userController')
const auth = require('../middleware/authenication');

const router = express.Router();

router.post('/signupStatus', controller.signupStatus);
router.post('/userStatus', controller.userStatus);
router.get('/getWord', controller.getWord);
module.exports = router;
