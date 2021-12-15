const queryController = require('../controllers/QueryController');
const express = require('express');
const router = express.Router();

router.use('/', queryController.index);

module.exports = router;