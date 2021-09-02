import {Request, Response} from "express";
import {addAnnonces, deleteAnnonce, getAllAnnonces, updateAnnonce} from "../services/annoncesService";
import {PayloadJWT} from "../models/payloadJWT";
import {ObjectId} from "mongodb";

export class AnnoncesController {
    public async getAnnonces(req: Request, res: Response) {
        return res.send(await getAllAnnonces());
    }

    public async createAnnonce(req: Request, res: Response) {
        const payload: PayloadJWT = req.cookies;
        const {
            title,
            description
        } = req.body;
        if (!!title && typeof title === 'string' && !!description && typeof description === 'string') {
            return res.status(200).json(await addAnnonces(title, description, payload.id));
        }
        return res.status(400).send();
    }

    public async updateAnnonce(req: Request, res: Response) {
        const payload: PayloadJWT = req.cookies;
        const {
            title,
            description
        } = req.body;
        if (!!title && typeof title === 'string' && !!description && typeof description === 'string') {
            try {
                await updateAnnonce(new ObjectId(req.params.idAnnonce), title, description, payload.id);
            } catch (error) {
                return res.status(404).send();
            }
            return res.send();
        } else {
            return res.status(400).send();
        }
    }

    public async deleteAnnonce(req: Request, res: Response) {
        const payload: PayloadJWT = req.cookies;
        try {
            await deleteAnnonce(new ObjectId(req.params.idAnnonce), payload.id);
        } catch (error) {
            return res.status(404).send();
        }

        return res.status(200).send();
    }
}