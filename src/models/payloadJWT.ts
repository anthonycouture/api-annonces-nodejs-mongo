import {ObjectId} from "mongodb";

export class PayloadJWT {
    public id: ObjectId;
    public email: string;


    constructor(id: ObjectId, email: string) {
        this.id = id;
        this.email = email;
    }

    toPayload(): { id: ObjectId; email: string } {
        return {
            id: this.id,
            email: this.email
        }
    }
}