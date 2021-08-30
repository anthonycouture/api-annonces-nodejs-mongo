import express from "express";
import {Annonce} from "../entity/annonce";
import {Db, ObjectId} from "mongodb";
import {annonceCollection} from "../common/constantes";
import {Database} from "../common/db";

const router = express.Router();

router.get('/', async (req, res) => {
    const db : Db = Database.getInstance().db;
    res.send(await db.collection(annonceCollection).find().toArray());
});

router.post('/',async (req, res) => {
    const db : Db = Database.getInstance().db;
    if (!!req.body.title && typeof req.body.title === 'string') {
        const annonce = new Annonce(req.body.title);
        const insert = await db.collection(annonceCollection).insertOne(annonce);
        annonce._id = insert.insertedId;
        res.status(200).json(annonce);
    }
    res.status(500).send();
});

router.delete('/:idAnnonce', async (req, res) => {
    const db : Db = Database.getInstance().db;
    await db.collection(annonceCollection).deleteOne({
        _id: new ObjectId(req.params.idAnnonce)
    });
    res.status(200).send();
})

export default router;