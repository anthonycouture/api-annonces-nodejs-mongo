const express = require('express');
const router = express.Router();
const annonce = require('../entity').annonce;


router.get('/', async (req, res) => {
    res.send(await annonce.find());
})

module.exports = router;