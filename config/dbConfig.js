require('dotenv').config();

const mongoose = require('mongoose');

const connexionDb = async () => {
    const user = process.env.DB_USER;
    const pwd = process.env.DB_PWD;
    const db = process.env.DB_DB;
    const url = process.env.DB_URL;
    const port = process.env.DB_PORT;
    if(!user || !pwd || !db || !url || !port){
        console.error(`Erreur dans le fichier .env`);
        process.exit(1)
    }
    try {
        await mongoose.connect(
            `mongodb://${user}:${pwd}@${url}:${port}/${db}`,
            {
                useNewUrlParser: true
            });
        console.log('Connexion à MongoDB réussie !');
    } catch (error) {
        console.log('Connexion à MongoDB échouée !');
        console.log(error);
        process.exit(1)
    }
}

connexionDb();


module.exports = mongoose;