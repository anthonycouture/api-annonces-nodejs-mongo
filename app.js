require('dotenv').config();
require('./config');

const express = require('express');
const app = express();
const route = require('./controllers');

const PRODUCTION = process.env.PRODUCTION;
const PORT = process.env.PORT

if(!PORT || !PRODUCTION) {
    console.error(`Erreur dans le fichier .env`);
    process.exit(1)
}

app.listen(PORT);

if(process.env.PRODUCTION !== `true`) {
    console.log(`Serveur démarré sur l'url http://localhost:${PORT}`);
}
app.use(route);