import express from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import { Database } from "./common/database";
import { Routes } from "./routes/routes";

class Application {
  readonly app: express.Application;
  readonly production: string;
  readonly port: string;

  private readonly _database: Database;
  private readonly _routes: Routes;

  constructor () {
    config();
    if (!process.env.PORT ||
      !process.env.PRODUCTION ||
      !process.env.DB_USER ||
      !process.env.DB_PWD ||
      !process.env.DB_DB ||
      !process.env.DB_URL ||
      !process.env.DB_PORT) {
      console.error("Erreur dans le fichier .env");
      process.exit(1);
    }
    this.production = process.env.PRODUCTION;
    this.port = process.env.PORT;
    this.app = express();
    this._database = Database.getInstance();
    this._init().then(() => this._config());
    this._routes = new Routes();
  }

  private _init = async (): Promise<void> => {
    await this._database.connect();
    this.app.set("_port", this.port);
  };

  private _config = () => {
    this.app.use(bodyParser.json());
    this._routes.routes(this.app);
  };
}

export default new Application();
