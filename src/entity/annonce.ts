import { ObjectId } from "mongodb";

interface Meta {
  idUser: ObjectId;
}

export class Annonce {
  public _id: ObjectId | undefined;
  public title: string;
  public description: string;
  public meta: Meta;

  constructor (title: string, description: string, idUser: ObjectId, _id: ObjectId | undefined = undefined) {
    this.title = title;
    this.description = description;
    this._id = _id;
    this.meta = {
      idUser
    };
  }
}
