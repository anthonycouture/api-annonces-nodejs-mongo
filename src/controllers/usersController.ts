import {Request, Response} from "express";
import {authUser, registerUser} from "../services/usersService";

export class UsersController {

    public async login(req: Request, res: Response) {
        const {
            email,
            password
        } = req.body;
        try {
            return res.json({
                token: await authUser(email, password)
            });
        } catch (error) {
            return res.status(404).send();
        }
    }

    public async register(req: Request, res: Response) {
        const {
            email,
            password
        } = req.body;
        if (!!email && typeof email === 'string' && !!password && typeof password === 'string') {
            try {
                return res.json({
                    token: await registerUser(email, password, 'user')
                });
            } catch (error) {
                return res.status(409).send();
            }

        }
        return res.status(400).send();
    }
}