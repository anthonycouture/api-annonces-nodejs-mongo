import express from "express";
import annoncesControllers from "./annoncesControllers";
import usersControllers from "./usersControllers";
import jwt from "jsonwebtoken";
import {jwtAlgorithm} from "../common/constantes";
import {getPrivateKey} from "../common/utils";
import {PayloadJWT} from "../models/payloadJWT";

const router = express.Router();

router.use((req, res, next) => {
    if (req.path.startsWith('/annonces')) {
        const privateKey = getPrivateKey()
        const token = req.header('Authorization')
        if (!!token)
            try {
                req.cookies = jwt.verify(token.substring(7), privateKey, {
                    algorithms: [jwtAlgorithm]
                }) as PayloadJWT;
            } catch (error) {
                return res.status(401).json(error);
            }
        else
            return res.status(401).send();
    }
    next();
});
router.use('/annonces', annoncesControllers);
router.use('/users', usersControllers);

export default router;