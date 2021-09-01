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
    const {
        email,
        password
    } = req.body;
    const privateKey = getPrivateKey();
    const usersTab = await db().collection(usersCollection).find({
        email,
        password
    }).toArray() as User[];
    if (usersTab.length === 0)
        return res.status(404).send();

    const user: User = usersTab[0];

    const payload = new PayloadJWT(user._id);
    const token: string = jwt.sign(payload.toPayload(), privateKey, {
        algorithm: jwtAlgorithm,
        expiresIn: jwtExpiresIn
    });
    return res.json({
        token
    });
});

router.post('/register', async (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (!!email && typeof email === 'string' && !!password && typeof password === 'string') {
        const usersTab = await db().collection(usersCollection).find({
            email
        }).toArray() as User[];
        if (usersTab.length !== 0)
            return res.status(409).send();

        const insertData = {email, password};
        const insert: InsertOneResult = await db().collection(usersCollection).insertOne(insertData);
        const user = new User(insert.insertedId, insertData.email, insertData.password);
        const payload = new PayloadJWT(user._id);
        const privateKey = getPrivateKey();
        const token: string = jwt.sign(payload.toPayload(), privateKey, {
            algorithm: jwtAlgorithm,
            expiresIn: jwtExpiresIn
        });
        return res.json({
            token
        });

    }
    return res.status(400).send();

});

export default router;
