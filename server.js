require('dotenv').config();

const connectDb = async () => {
    await require('./src/common/db').connect();
}

connectDb().then(() => {
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
});




