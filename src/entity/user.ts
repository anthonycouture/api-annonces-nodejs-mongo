import {ObjectId} from "mongodb";
import {Roles} from "../common/roles";

export class User {
    _id: ObjectId;
    email: string;
    password: string;
    roles: Roles[];


    constructor(id: ObjectId, email: string, password: string, roles: Roles[]) {
        this._id = id;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }
}