import express, {Request, Response} from "express";
import {authUser, registerUser} from "../service/usersService";

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
    const {
        email,
        password
    } = req.body;
    try{
        return res.json({
            token : await authUser(email, password)
        });
    } catch (error) {
        return res.status(404).send();
    }
});

router.post('/register', async (req: Request, res: Response) => {
    const {
        email,
        password
    } = req.body;
    if (!!email && typeof email === 'string' && !!password && typeof password === 'string') {
        try{
            return res.json({
                token : await registerUser(email, password, 'user')
            });
        }catch (error) {
            return res.status(409).send();
        }

    }
    return res.status(400).send();

});

export default router;
