import {Database} from "../common/database";
import {Annonce} from "../entity/annonce";
import {ANNONCES_COLLECTION} from "../common/constantes";
import {Db, DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {AnnonceNotFoundError} from "../errors/annonceNotFoundError";

export class AnnoncesService {

    private readonly _db: () => Db;

    constructor() {
        this._db = () => Database.getInstance().db;
    }

    async getAllAnnonces(): Promise<Annonce[]> {
        return await this._db()
            .collection(ANNONCES_COLLECTION)
            .find()
            .toArray() as Annonce[]
    };

    async addAnnonces(title: string, description: string, idUser: ObjectId): Promise<Annonce> {
        const annonce = new Annonce(title, description, idUser);
        const insert: InsertOneResult = await this._db()
            .collection(ANNONCES_COLLECTION)
            .insertOne(annonce);
        annonce._id = insert.insertedId;
        return annonce;
    };

    async updateAnnonce(idAnnonce: ObjectId, title: string, description: string, idUser: ObjectId) {
        const result: UpdateResult = await this._db()
            .collection(ANNONCES_COLLECTION)
            .updateOne(
                {
                    _id: idAnnonce,
                    'meta.idUser': idUser
                },
                {
                    $set: {
                        title,
                        description
                    }
                }
            );
        if (result.matchedCount === 0)
            throw new AnnonceNotFoundError();
    };

    async deleteAnnonce(idAnnonce: ObjectId, idUser: ObjectId) {
        const result: DeleteResult = await this._db()
            .collection(ANNONCES_COLLECTION)
            .deleteOne({
                _id: idAnnonce,
                "meta.idUser": idUser
            });
        if (result.deletedCount === 0)
            throw new AnnonceNotFoundError();
    };
}


