const express = require('express');
const router = express.Router();
const {Annonce} = require('../entity/annonce');
const {ObjectId} = require("mongodb");

const db = require('../common/db').getDb();
const {annonceCollection} = require('../common/constantes');


router.get('/', async (req, res) => {
    res.send(await db.collection(annonceCollection).find().toArray());
});

router.post('/',async (req, res) => {
    if (!!req.body.title && typeof req.body.title === 'string') {
        const annonce = new Annonce(req.body.title);
        const insert = await db.collection(annonceCollection).insertOne(annonce);
        annonce._id = insert.insertedId;
        res.status(200).json(annonce);
    }
    res.status(500).send();
});

router.delete('/:idAnnonce', async (req, res) => {
    await db.collection(annonceCollection).deleteOne({
        _id: ObjectId(req.params.idAnnonce)
    });
    res.status(200).send();
})

module.exports = router;