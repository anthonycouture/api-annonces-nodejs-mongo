import {Db, MongoClient} from "mongodb";

export class Database {

    private static instance: Database;

    private _db!: Db;


    private constructor() {
        this.connexionDb();
    }

    get db(): Db{
        return this._db;
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    connexionDb = async () : Promise<void> => {

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
        this._db = client.db();
        console.log('Connexion à MongoDb réussi !!!');

    }
}