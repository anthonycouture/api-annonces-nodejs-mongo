import { ObjectId } from "mongodb";
import { Roles } from "../common/roles";

export class PayloadJWT {
  public id: ObjectId;
  public roles: Roles[];

  constructor (id: ObjectId, roles: Roles[]) {
    this.id = id;
    this.roles = roles;
  }

  toPayload (): { id: ObjectId, roles: Roles[] } {
    return {
      id: this.id,
      roles: this.roles
    };
  }
}
