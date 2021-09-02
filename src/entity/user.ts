import {ObjectId} from "mongodb";
import {Roles} from "../common/roles";

export class User {
    _id: ObjectId | undefined;
    email: string;
    password: string;
    roles: Roles[];


    constructor(email: string, password: string, roles: Roles[], _id: ObjectId | undefined = undefined) {
        this._id = _id;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }
}