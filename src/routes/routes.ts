import express, { NextFunction, Request, Response } from "express";
import { AnnoncesController } from "../controllers/annoncesController";
import { UsersController } from "../controllers/usersController";
import { AuthentificationMiddleware } from "../middlewares/authentificationMiddleware";

export class Routes {
  private readonly _annoncesController: AnnoncesController;
  private readonly _usersController: UsersController;
  private readonly _authentificationMiddleware: AuthentificationMiddleware;

  constructor () {
    this._annoncesController = new AnnoncesController();
    this._usersController = new UsersController();
    this._authentificationMiddleware = new AuthentificationMiddleware();
  }

  routes (app: express.Application): void {
    /**
     * Route annonces
     */
    app.get("/annonces",
      this._annoncesController.getAnnonces);
    app.post("/annonces",
      this._authentificationMiddleware.authentification,
      this._annoncesController.createAnnonce);
    app.put("/annonces/:idAnnonce",
      this._authentificationMiddleware.authentification,
      this._annoncesController.updateAnnonce);
    app.delete("/annonces/:idAnnonce",
      this._authentificationMiddleware.authentification,
      this._annoncesController.deleteAnnonce);

    /**
     * Route users
     */
    app.post("/login",
      this._usersController.login);
    app.post("/register",
      this._usersController.register);

    /**
     * Récupère les erreurs envoyer dans la fonction next
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error("Error Handling Middleware called");
      console.error("Path: ", req.path);
      console.error("Error: ", error);
      res.status(500).send();
    });

    /**
     * 404 NOT FOUND
     * error si pas de routes toujours laisser en dernier
     */
    app.use((req: Request, res: Response) => {
      return res.status(404).send();
    });
  }
}
