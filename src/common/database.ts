import {Db, MongoClient} from "mongodb";

export class Database {

    private static instance: Database;

    private _db!: Db;


    private constructor() {
    }

    get db(): Db{
        return this._db;
    }

    public static getInstance(): Database {
        if (!this.instance) {
            this.instance = new Database();
        }

        return this.instance;
    }

    connect = async () : Promise<void> => {
        try {

            const user = process.env.DB_USER;
            const pwd = process.env.DB_PWD;
            const db = process.env.DB_DB;
            const url = process.env.DB_URL;
            const port = process.env.DB_PORT;
            if (!user || !pwd || !db || !url || !port) {
                console.error(`Erreur dans le fichier .env`);
            } else {
                const client = new MongoClient(`mongodb://${user}:${pwd}@${url}:${port}/${db}`);
                await client.connect();
                this._db = client.db();
                console.log('Connexion à MongoDb réussi !!!');
            }
        }catch (error) {
            console.error('Connexion à MongoDb échoué !!!');
            process.exit(1);
        }

    }
}