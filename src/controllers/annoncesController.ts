import {NextFunction, Request, Response} from "express";
import {PayloadJWT} from "../models/payloadJWT";
import {ObjectId} from "mongodb";
import {AnnonceNotFoundError} from "../errors/annonceNotFoundError";
import {AnnoncesService} from "../services/annoncesService";
import {AnnonceMapper} from "../mapper/annonceMapper";
import {Annonce} from "../entity/annonce";
import {Roles} from "../common/roles";
import {UnauthorizedError} from "../errors/unauthorizedError";


const annoncesService = new AnnoncesService();
const annonceMapper = new AnnonceMapper();

export class AnnoncesController {

    async getAnnonces(req: Request, res: Response, next: NextFunction) {
        annoncesService.getAllAnnonces()
            .then(async (annonces: Annonce[]) => {
                return res.send(await annonceMapper.annoncesToAnnoncesDTO(annonces));
            })
            .catch(next);
    }

    async createAnnonce(req: Request, res: Response, next: NextFunction) {
        const payload: PayloadJWT = req.cookies;
        const {
            title,
            description
        } = req.body;
        if (!!title && typeof title === 'string' && !!description && typeof description === 'string') {
            return res.status(200)
                .json(await annoncesService.addAnnonces(title, description, payload.id).catch(next));
        }
        return res.status(400).send();
    }

    async updateAnnonce(req: Request, res: Response, next: NextFunction) {
        const payload: PayloadJWT = req.cookies;
        const {
            title,
            description
        } = req.body;
        if (!!title && typeof title === 'string' && !!description && typeof description === 'string') {
            await annoncesService.updateAnnonce(new ObjectId(req.params.idAnnonce), title, description, payload.id, payload.roles.includes(Roles.admin))
                .catch((error) => {
                    switch (error) {
                        case error instanceof AnnonceNotFoundError:
                            return res.status(404).send();
                        case error instanceof UnauthorizedError:
                            return res.status(401).send();
                        default:
                            return next(error);
                    }
                });
            return res.send();
        }
        return res.status(400).send();
    }

    async deleteAnnonce(req: Request, res: Response, next: NextFunction) {
        const payload: PayloadJWT = req.cookies;
        await annoncesService.deleteAnnonce(new ObjectId(req.params.idAnnonce), payload.id, payload.roles.includes(Roles.admin))
            .catch((error) => {
                switch (error) {
                    case error instanceof AnnonceNotFoundError:
                        return res.status(404).send();
                    case error instanceof UnauthorizedError:
                        return res.status(401).send();
                    default:
                        return next(error);
                }
            });
        return res.status(200).send();
    }
}