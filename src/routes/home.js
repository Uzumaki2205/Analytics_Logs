const homeController = require('../controllers/HomeController');
const express = require('express');
const router = express.Router();

router.use('/', homeController.index);

module.exports = router;