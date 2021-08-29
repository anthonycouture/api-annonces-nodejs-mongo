require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

let _db;

const connexionDb = async () => {

    const user = process.env.DB_USER;
    const pwd = process.env.DB_PWD;
    const db = process.env.DB_DB;
    const url = process.env.DB_URL;
    const port = process.env.DB_PORT;
    if (!user || !pwd || !db || !url || !port) {
        console.error(`Erreur dans le fichier .env`);
        process.exit(1)
    }

    const client = new MongoClient(`mongodb://${user}:${pwd}@${url}:${port}/${db}`);

    await client.connect();
    _db = client.db();
    console.log('Connexion à MongoDb réussi !!!');

}

module.exports.connect = async () => await connexionDb();
module.exports.getDb = () => _db;