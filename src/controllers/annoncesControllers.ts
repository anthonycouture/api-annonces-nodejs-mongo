import express from "express";
import {Annonce} from "../entity/annonce";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {annoncesCollection} from "../common/constantes";
import {Database} from "../common/db";
import {PayloadJWT} from "../models/payloadJWT";

const router = express.Router();

const db = () => Database.getInstance().db;

router.get('/', async (req, res) => {
    return res.send(await db().collection(annoncesCollection).find().toArray() as Annonce[]);
});

router.post('/',async (req, res) => {
    const payload: PayloadJWT = req.cookies;
    const {
        title,
        description
    } = req.body;
    if (!!title && typeof title === 'string' && !!description && typeof description === 'string') {
        const annonce = new Annonce(title, description, {idUser: payload.id});
        const insert: InsertOneResult = await db().collection(annoncesCollection).insertOne(annonce);
        annonce._id = insert.insertedId;
        return res.status(200).json(annonce);
    }
    return res.status(400).send();
});

router.put('/:idAnnonce', async (req, res) => {
    const payload: PayloadJWT = req.cookies;
    const {
        title,
        description
    } = req.body;
    if (!!title && typeof title === 'string' && !!description && typeof description === 'string') {
        const result: UpdateResult = await db().collection(annoncesCollection)
            .updateOne(
                {
                    _id: new ObjectId(req.params.idAnnonce),
                    'meta.idUser': payload.id
                },
                {
                    $set: {
                        title,
                        description
                    }
                }
            );
        if(result.matchedCount === 0){
            return res.status(400).send();
        }
        return res.send();
    } else {
        return res.status(400).send();
    }
});

router.delete('/:idAnnonce', async (req, res) => {
    const payload: PayloadJWT = req.cookies;
    const result: DeleteResult = await db().collection(annoncesCollection).deleteOne({
        _id: new ObjectId(req.params.idAnnonce),
        "meta.idUser": payload.id
    });
    if (result.deletedCount === 0)
        return res.status(404).send();

    return res.status(200).send();
});

export default router;