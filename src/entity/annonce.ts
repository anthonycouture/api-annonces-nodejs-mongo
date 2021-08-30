import {ObjectId} from "mongodb";

export class Annonce {
    public _id: ObjectId | undefined;
    public title: string;

    constructor(title: string, _id = undefined) {
        this.title = title;
        this._id = _id;
    }


}