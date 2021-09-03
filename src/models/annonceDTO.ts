import { ObjectId } from "mongodb";

export class AnnonceDTO {
  public _id: ObjectId;
  public title: string;
  public description: string;
  public email: string;

  constructor (id: ObjectId, title: string, description: string, email: string) {
    this._id = id;
    this.title = title;
    this.description = description;
    this.email = email;
  }
}
