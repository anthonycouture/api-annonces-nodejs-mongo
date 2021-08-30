require('dotenv').config();

const start = async () => {
    const {connect} = require('./src/common/db');
    await connect();


    const http = require('http');
    const app = require('./src/app');

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
}

start();




