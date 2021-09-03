import {NextFunction, Request, Response} from "express";
import {UsersService} from "../services/usersService";


export class AuthentificationMiddleware {

    private readonly _usersService: UsersService;


    constructor() {
        this._usersService = new UsersService();
    }

    authentification(req: Request, res: Response, next: NextFunction) {
        const token = req.header('Authorization')
        if (!!token) {
            try {
                req.cookies = this._usersService.verifyJwt(token.substring(7));
            } catch (error) {
                return res.status(401).json(error);
            }
        } else
            return res.status(401).send();

        next();
    }
}
