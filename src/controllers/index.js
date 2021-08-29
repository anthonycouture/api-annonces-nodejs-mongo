const express = require('express');
const router = express.Router();

const annonces = require('./annoncesControllers');

router.use('/annonces',annonces);

module.exports = router;