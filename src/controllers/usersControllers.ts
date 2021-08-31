import express from "express";
import {jwtAlgorithm, jwtExpiresIn, usersCollection} from "../common/constantes";
import jwt from 'jsonwebtoken';
import {getPrivateKey} from "../common/utils";
import {Database} from "../common/db";
import {User} from "../entity/user";
import {PayloadJWT} from "../models/payloadJWT";
import {InsertOneResult} from "mongodb";

const router = express.Router();

const db = () => Database.getInstance().db;

router.post('/login', async (req, res) => {
    const privateKey = getPrivateKey();
    const usersTab = await db().collection(usersCollection).find({
        email: req.body.email,
        password: req.body.password
    }).toArray() as User[];
    if (usersTab.length === 0)
        return res.status(404).send();
    else {
        const user: User = usersTab[0];

        const payload = new PayloadJWT(user._id, user.email);
        const token: string = jwt.sign(payload.toPayload(), privateKey, {
            algorithm: jwtAlgorithm,
            expiresIn: jwtExpiresIn
        });
        return res.json({
            token: token
        });
    }
});

router.post('/register', async (req, res) => {
    if (!!req.body.email && typeof req.body.email === 'string' && !!req.body.password && typeof req.body.password === 'string') {
        const usersTab = await db().collection(usersCollection).find({
            email: req.body.email
        }).toArray() as User[];
        if (usersTab.length !== 0)
            return res.status(500).send();
        else {
            const insertData = {email: req.body.email, password: req.body.password};
            const insert: InsertOneResult = await db().collection(usersCollection).insertOne(insertData);
            const user = new User(insert.insertedId, insertData.email, insertData.password);
            const payload = new PayloadJWT(user._id, user.email);
            const privateKey = getPrivateKey();
            const token: string = jwt.sign(payload.toPayload(), privateKey, {
                algorithm: jwtAlgorithm,
                expiresIn: jwtExpiresIn
            });
            return res.json({
                token: token
            });
        }
    } else {
        return res.status(500).send();
    }
});

export default router;
