const express = require('express');
const router = express.Router();
const auth = require('../middleware/authenication');
const controller = require('../controller/adminController');

router.post('/setWord', controller.setWord);
router.get('/userDetails', controller.userDetails);

module.exports = router;
