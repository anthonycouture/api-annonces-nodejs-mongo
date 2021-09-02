import express, {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {PayloadJWT} from "../models/payloadJWT";
import {authentification} from "../middlewares/authentificationMiddleware";
import {addAnnonces, deleteAnnonce, getAllAnnonces, updateAnnonce} from "../service/annoncesService";

const router = express.Router();


router.get('/', async (req: Request, res: Response) => {
    return res.send(await getAllAnnonces());
});

router.post('/',authentification,async (req: Request, res: Response) => {
    const payload: PayloadJWT = req.cookies;
    const {
        title,
        description
    } = req.body;
    if (!!title && typeof title === 'string' && !!description && typeof description === 'string') {
        return res.status(200).json(await addAnnonces(title, description, payload.id));
    }
    return res.status(400).send();
});

router.put('/:idAnnonce',authentification, async (req: Request, res: Response) => {
    const payload: PayloadJWT = req.cookies;
    const {
        title,
        description
    } = req.body;
    if (!!title && typeof title === 'string' && !!description && typeof description === 'string') {
        try{
            await updateAnnonce(new ObjectId(req.params.idAnnonce), title,description, payload.id);
        } catch (error) {
            return res.status(404).send();
        }
        return res.send();
    } else {
        return res.status(400).send();
    }
});

router.delete('/:idAnnonce',authentification, async (req: Request, res: Response) => {
    const payload: PayloadJWT = req.cookies;
    try {
        await deleteAnnonce(new ObjectId(req.params.idAnnonce), payload.id);
    } catch (error) {
        return res.status(404).send();
    }

    return res.status(200).send();
});

export default router;