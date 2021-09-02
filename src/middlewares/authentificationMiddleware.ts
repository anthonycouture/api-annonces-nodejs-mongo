import {NextFunction, Request, Response} from "express";
import {verifyJwt} from "../service/usersService";

export const authentification = (req : Request, res: Response, next : NextFunction) => {
    const token = req.header('Authorization')
    if (!!token)
        try {
            req.cookies = verifyJwt(token.substring(7));
        } catch (error) {
            return res.status(401).json(error);
        }
    else
        return res.status(401).send();

    next();
}
