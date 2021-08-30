import express from "express";
import {Annonce} from "../entity/annonce";
import {ObjectId} from "mongodb";
import {annonceCollection} from "../common/constantes";
import {Database} from "../common/db";

const router = express.Router();

const db = () => Database.getInstance().db;

router.get('/', async (req, res) => {
    res.send(await db().collection(annonceCollection).find().toArray());
});

router.post('/',async (req, res) => {
    if (!!req.body.title) {
        const annonce = new Annonce(req.body.title);
        const insert = await db().collection(annonceCollection).insertOne(annonce);
        annonce._id = insert.insertedId;
        res.status(200).json(annonce);
    }
    res.status(500).send();
});

router.delete('/:idAnnonce', async (req, res) => {
    await db().collection(annonceCollection).deleteOne({
        _id: new ObjectId(req.params.idAnnonce)
    });
    res.status(200).send();
})

export default router;