import express from "express";
import {Annonce} from "../entity/annonce";
import {DeleteResult, InsertOneResult, ObjectId} from "mongodb";
import {annoncesCollection} from "../common/constantes";
import {Database} from "../common/db";
import {PayloadJWT} from "../models/payloadJWT";

const router = express.Router();

const db = () => Database.getInstance().db;

router.get('/', async (req, res) => {
    const payload: PayloadJWT = req.cookies;
    res.send(await db().collection(annoncesCollection).find({"meta.idUser": payload.id}).toArray() as Annonce[]);
});

router.post('/',async (req, res) => {
    const payload: PayloadJWT = req.cookies;
    if (!!req.body.title && typeof req.body.title === 'string') {
        const annonce = new Annonce(req.body.title, {email: payload.email, idUser: payload.id});
        const insert: InsertOneResult = await db().collection(annoncesCollection).insertOne(annonce);
        annonce._id = insert.insertedId;
        res.status(200).json(annonce);
    } else {
        res.status(500).send();
    }
});

router.delete('/:idAnnonce', async (req, res) => {
    const payload: PayloadJWT = req.cookies;
    const result: DeleteResult = await db().collection(annoncesCollection).deleteOne({
        _id: new ObjectId(req.params.idAnnonce),
        "meta.idUser": payload.id
    });
    if (result.deletedCount === 0)
        res.status(404).send();
    else
        res.status(200).send();
});

export default router;