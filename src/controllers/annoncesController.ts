import {NextFunction, Request, Response} from "express";
import {addAnnonces, deleteAnnonce, getAllAnnonces, updateAnnonce} from "../services/annoncesService";
import {PayloadJWT} from "../models/payloadJWT";
import {ObjectId} from "mongodb";
import {AnnonceNotFoundError} from "../errors/annonceNotFoundError";

export class AnnoncesController {
    public async getAnnonces(req: Request, res: Response, next: NextFunction) {
        return res.send(await getAllAnnonces().catch(next));
    }

    public async createAnnonce(req: Request, res: Response, next: NextFunction) {
        const payload: PayloadJWT = req.cookies;
        const {
            title,
            description
        } = req.body;
        if (!!title && typeof title === 'string' && !!description && typeof description === 'string') {
            return res.status(200)
                .json(await addAnnonces(title, description, payload.id).catch(next));
        }
        return res.status(400).send();
    }

    public async updateAnnonce(req: Request, res: Response, next: NextFunction) {
        const payload: PayloadJWT = req.cookies;
        const {
            title,
            description
        } = req.body;
        if (!!title && typeof title === 'string' && !!description && typeof description === 'string') {
            await updateAnnonce(new ObjectId(req.params.idAnnonce), title, description, payload.id)
                .catch((error) => {
                    if (error instanceof AnnonceNotFoundError)
                        return res.status(404).send();
                    return next(error);
                });
            return res.send();
        }
        return res.status(400).send();
    }

    public async deleteAnnonce(req: Request, res: Response, next: NextFunction) {
        const payload: PayloadJWT = req.cookies;
        await deleteAnnonce(new ObjectId(req.params.idAnnonce), payload.id)
            .catch((error) => {
                if (error instanceof AnnonceNotFoundError)
                    return res.status(404).send();
                return next(error);
            });
        return res.status(200).send();
    }
}