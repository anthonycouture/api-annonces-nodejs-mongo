import {NextFunction, Request, Response} from "express";
import {UsersService} from "../services/usersService";


const usersService: UsersService = new UsersService();

export class AuthentificationMiddleware {

    authentification(req: Request, res: Response, next: NextFunction) {
        const token = req.header('Authorization')
        if (!!token) {
            try {
                req.cookies = usersService.verifyJwt(token.substring(7));
            } catch (error) {
                return res.status(401).json(error);
            }
        } else
            return res.status(401).send();

        next();
    }
}
