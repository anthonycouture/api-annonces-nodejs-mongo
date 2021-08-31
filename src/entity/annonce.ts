import {ObjectId} from "mongodb";

interface Meta {
    idUser: ObjectId;
    email: string;
}

export class Annonce {
    public _id: ObjectId | undefined;
    public title: string;
    public meta: Meta;

    constructor(title: string, meta: Meta, _id = undefined) {
        this.title = title;
        this._id = _id;
        this.meta = meta;
    }


}