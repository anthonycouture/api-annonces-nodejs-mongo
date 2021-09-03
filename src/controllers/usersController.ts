import {NextFunction, Request, Response} from "express";
import {UsersService} from "../services/usersService";
import {UserNotFoundError} from "../errors/userNotFoundError";
import {UserExistError} from "../errors/userExistError";

export class UsersController {

    public async login(req: Request, res: Response, next: NextFunction) {
        const {
            email,
            password
        } = req.body;
        try {
            const userService = new UsersService();
            return res.json({
                token: await userService.authUser(email, password)
            });
        } catch (error) {
            console.log(error)
            if(error instanceof UserNotFoundError)
                return res.status(404).send();
            return next(error);
        }
    }

    public async register(req: Request, res: Response, next: NextFunction) {
        const {
            email,
            password
        } = req.body;
        if (!!email && typeof email === 'string' && !!password && typeof password === 'string') {
            try {
                const userService = new UsersService();
                return res.json({
                    token: await userService.registerUser(email, password, 'user')
                });
            } catch (error) {
                if(error instanceof UserExistError)
                    return res.status(409).send();
                return next(error);
            }

        }
        return res.status(400).send();
    }
}