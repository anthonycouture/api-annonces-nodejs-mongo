import express, {Request, Response} from "express";
import {AnnoncesController} from "../controllers/annoncesController";
import {UsersController} from "../controllers/usersController";
import {AuthentificationMiddleware} from "../middlewares/authentificationMiddleware";

export class Routes {

    private readonly _annoncesController: AnnoncesController;
    private readonly _usersController: UsersController;
    private readonly _authentificationMiddleware: AuthentificationMiddleware;


    constructor() {
        this._annoncesController = new AnnoncesController();
        this._usersController = new UsersController();
        this._authentificationMiddleware = new AuthentificationMiddleware();
    }

    public routes(app: express.Application) {
        /** Route annonces */
        app.get('/annonces',
            this._annoncesController.getAnnonces);
        app.post('/annonces',
            this._authentificationMiddleware.authentification,
            this._annoncesController.createAnnonce);
        app.put('/annonces/:idAnnonce',
            this._authentificationMiddleware.authentification,
            this._annoncesController.updateAnnonce);
        app.delete('/annonces/:idAnnonce',
            this._authentificationMiddleware.authentification,
            this._annoncesController.deleteAnnonce);

        /** Route users */
        app.post('/login',
            this._usersController.login);
        app.post('/register',
            this._usersController.register);

        /**
         * 404 NOT FOUND
         * error si pas de routes toujours laisser en dernier
         */
        app.use('*', (req: Request, res: Response) => {
            return res.status(404).send();
        })
    }
}