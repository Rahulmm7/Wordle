const express = require('express');
const controller = require('../controller/userController')


const router = express.Router();

router.post('/signupStatus', controller.signupStatus);


module.exports = router;
