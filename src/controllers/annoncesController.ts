import { NextFunction, Request, Response } from "express";
import { PayloadJWT } from "../models/payloadJWT";
import { ObjectId } from "mongodb";
import { AnnonceNotFoundError } from "../errors/annonceNotFoundError";
import { AnnoncesService } from "../services/annoncesService";
import { AnnonceMapper } from "../mapper/annonceMapper";
import { Annonce } from "../entity/annonce";
import { Roles } from "../common/roles";
import { UnauthorizedError } from "../errors/unauthorizedError";

const annoncesService = new AnnoncesService();
const annonceMapper = new AnnonceMapper();

export class AnnoncesController {
  getAnnonces (req: Request, res: Response, next: NextFunction): void {
    annoncesService.getAllAnnonces()
      .then(async (annonces: Annonce[]) => {
        res.send(await annonceMapper.annoncesToAnnoncesDTO(annonces));
      })
      .catch(next);
  }

  createAnnonce (req: Request, res: Response, next: NextFunction): void {
    const payload: PayloadJWT = req.cookies;
    const {
      title,
      description
    } = req.body;
    if (!!title && typeof title === "string" && !!description && typeof description === "string") {
      annoncesService.addAnnonces(title, description, payload.id)
        .then((annonce: Annonce) => res.status(201).send(annonce))
        .catch(next);
    } else {
      res.status(400).send();
    }
  }

  updateAnnonce (req: Request, res: Response, next: NextFunction): void {
    const payload: PayloadJWT = req.cookies;
    const {
      title,
      description
    } = req.body;
    if (!!title && typeof title === "string" && !!description && typeof description === "string") {
      annoncesService.updateAnnonce(new ObjectId(req.params.idAnnonce), title, description, payload.id, payload.roles.includes(Roles.admin))
        .then(() => res.send())
        .catch((error) => {
          switch (error) {
            case error instanceof AnnonceNotFoundError:
              res.status(404).send();
              break;
            case error instanceof UnauthorizedError:
              res.status(401).send();
              break;
            default:
              next(error);
          }
        });
    } else {
      res.status(400).send();
    }
  }

  deleteAnnonce (req: Request, res: Response, next: NextFunction): void {
    const payload: PayloadJWT = req.cookies;
    annoncesService.deleteAnnonce(new ObjectId(req.params.idAnnonce), payload.id, payload.roles.includes(Roles.admin))
      .then(() => res.status(200).send())
      .catch((error) => {
        switch (error) {
          case error instanceof AnnonceNotFoundError:
            res.status(404).send();
            break;
          case error instanceof UnauthorizedError:
            res.status(401).send();
            break;
          default:
            next(error);
        }
      });
  }
}
