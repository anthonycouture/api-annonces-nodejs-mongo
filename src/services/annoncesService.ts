import { Database } from "../common/database";
import { Annonce } from "../entity/annonce";
import { ANNONCES_COLLECTION } from "../common/constantes";
import { Db, DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { AnnonceNotFoundError } from "../errors/annonceNotFoundError";
import { UnauthorizedError } from "../errors/unauthorizedError";

export class AnnoncesService {
  private readonly _db: () => Db;

  constructor () {
    this._db = () => Database.getInstance().db;
  }

  async getAllAnnonces (): Promise<Annonce[]> {
    return await this._db()
      .collection(ANNONCES_COLLECTION)
      .find()
      .toArray() as Annonce[];
  }

  async addAnnonces (title: string, description: string, idUser: ObjectId): Promise<Annonce> {
    const annonce = new Annonce(title, description, idUser);
    const insert: InsertOneResult = await this._db()
      .collection(ANNONCES_COLLECTION)
      .insertOne(annonce);
    annonce._id = insert.insertedId;
    return annonce;
  }

  async updateAnnonce (idAnnonce: ObjectId, title: string, description: string, idUser: ObjectId, admin = false): Promise<void> {
    const _update = async () => {
      const result: UpdateResult = await this._db()
        .collection(ANNONCES_COLLECTION)
        .updateOne(
          {
            _id: idAnnonce
          },
          {
            $set: {
              title,
              description
            }
          }
        );
      if (result.matchedCount === 0) {
        throw new AnnonceNotFoundError();
      }
    };
    if (admin) {
      await _update();
    } else {
      const annonces = await this._db()
        .collection(ANNONCES_COLLECTION)
        .find({
          _id: idAnnonce
        }).toArray() as Annonce[];
      if (annonces.length === 0) {
        throw new AnnonceNotFoundError();
      }
      if (annonces[0].meta.idUser !== idUser) {
        throw new UnauthorizedError();
      }
      await _update();
    }
  }

  async deleteAnnonce (idAnnonce: ObjectId, idUser: ObjectId, admin = false): Promise<void> {
    const _delete = async () => {
      const result: DeleteResult = await this._db()
        .collection(ANNONCES_COLLECTION)
        .deleteOne({
          _id: idAnnonce
        });
      if (result.deletedCount === 0) {
        throw new AnnonceNotFoundError();
      }
    };
    if (admin) {
      await _delete();
    } else {
      const annonces = await this._db()
        .collection(ANNONCES_COLLECTION)
        .find({
          _id: idAnnonce
        }).toArray() as Annonce[];
      if (annonces.length === 0) {
        throw new AnnonceNotFoundError();
      }
      if (annonces[0].meta.idUser !== idUser) {
        throw new UnauthorizedError();
      }
      await _delete();
    }
  }
}
