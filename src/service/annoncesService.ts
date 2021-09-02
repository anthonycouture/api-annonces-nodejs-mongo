import {Database} from "../common/db";
import {Annonce} from "../entity/annonce";
import {ANNONCES_COLLECTION} from "../common/constantes";
import {DeleteResult, InsertOneResult, ObjectId, UpdateResult} from "mongodb";
import {AnnonceNotFoundError} from "../errors/annonceNotFoundError";

const db = () => Database.getInstance().db;

export const getAllAnnonces = async (): Promise<Annonce[]> => {
    return await db()
        .collection(ANNONCES_COLLECTION)
        .find()
        .toArray() as Annonce[]
};

export const addAnnonces = async (title: string, description: string, idUser: ObjectId): Promise<Annonce> => {
    const annonce = new Annonce(title, description, idUser);
    const insert: InsertOneResult = await db()
        .collection(ANNONCES_COLLECTION)
        .insertOne(annonce);
    annonce._id = insert.insertedId;
    return annonce;
};

export const updateAnnonce = async (idAnnonce: ObjectId, title: string, description: string, idUser: ObjectId) => {
    const result: UpdateResult = await db()
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

export const deleteAnnonce = async (idAnnonce: ObjectId, idUser: ObjectId) => {
    const result: DeleteResult = await db()
        .collection(ANNONCES_COLLECTION)
        .deleteOne({
            _id: idAnnonce,
            "meta.idUser": idUser
        });
    if (result.deletedCount === 0)
        throw new AnnonceNotFoundError();
};