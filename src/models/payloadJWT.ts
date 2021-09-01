import {ObjectId} from "mongodb";

export class PayloadJWT {
    public id: ObjectId;


    constructor(id: ObjectId) {
        this.id = id;
    }

    toPayload(): { id: ObjectId } {
        return {
            id: this.id
        }
    }
}