import {ObjectId} from "mongodb";

export class User {
    _id: ObjectId;
    email: string;
    password: string;


    constructor(id: ObjectId, email: string, password: string) {
        this._id = id;
        this.email = email;
        this.password = password;
    }
}