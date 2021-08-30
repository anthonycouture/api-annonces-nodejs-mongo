import express from 'express';
import {config} from "dotenv";
import bodyParser from 'body-parser';
import route from './controllers';
import {Database} from "./common/db";
import http from "http";

config();
const app = express();
app.use(bodyParser.json());

Database.getInstance();
const PRODUCTION = process.env.PRODUCTION;
const PORT = process.env.PORT

if (!PORT || !PRODUCTION) {
    console.error(`Erreur dans le fichier .env`);
    process.exit(1)
}

app.set('port', PORT);

const server = http.createServer(app);


server.listen(PORT);

if (process.env.PRODUCTION !== `true`) {
    console.log(`Serveur démarré sur l'url http://localhost:${PORT}`);
}

app.use(route);