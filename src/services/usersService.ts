import path from "path";
import fs from "fs";
import {JWT_ALGORITHM, JWT_EXPIRES_IN, USERS_COLLECTION} from "../common/constantes";
import {User} from "../entity/user";
import {Database} from "../common/database";
import {PayloadJWT} from "../models/payloadJWT";
import jwt from "jsonwebtoken";
import {Roles} from "../common/roles";
import {Db, InsertOneResult, ObjectId} from "mongodb";
import {UserNotFoundError} from "../errors/userNotFoundError";
import {ProblemDbError} from "../errors/problemDbError";
import {UserExistError} from "../errors/userExistError";

export class UsersService {

    private readonly _db: () => Db;

    constructor() {
        this._db = () => Database.getInstance().db;
    }

    async authUser(email: string, password: string): Promise<string> {
        const usersTab = await this._db()
            .collection(USERS_COLLECTION)
            .find({
                email,
                password
            })
            .toArray() as User[];

        if (usersTab.length === 0)
            throw new UserNotFoundError();

        const user: User = usersTab[0];

        if (!user._id) {
            throw new ProblemDbError('id users null bdd');
        }
        const payload = new PayloadJWT(user._id);
        return this._jwtById(payload);
    };


    async registerUser(email: string, password: string, role: 'admin' | 'user'): Promise<string> {
        const roles = role === "user" ? [Roles.user] : [Roles.user, Roles.admin];
        const usersTab = await this._db()
            .collection(USERS_COLLECTION)
            .find({
                email
            })
            .toArray() as User[];
        if (usersTab.length !== 0)
            throw new UserExistError();
        const insertData = {email, password, roles};
        const user = new User(insertData.email, insertData.password, insertData.roles);
        const insert: InsertOneResult = await this._db()
            .collection(USERS_COLLECTION)
            .insertOne(insertData);
        user._id = new ObjectId(insert.insertedId);
        const payload = new PayloadJWT(user._id);
        return this._jwtById(payload);
    };

    async getUserById(_id: ObjectId): Promise<User> {
        const users: User[] = await this._db()
            .collection(USERS_COLLECTION)
            .find({
                _id: new ObjectId(_id)
            })
            .toArray() as User[]
        if (users.length === 0)
            throw new UserNotFoundError();
        return users[0];
    }

    verifyJwt(tokenJwt: string): PayloadJWT {
        return jwt.verify(tokenJwt, this._getPrivateKey(), {
            algorithms: [JWT_ALGORITHM]
        }) as PayloadJWT;
    }

    private _getPrivateKey(): Buffer {
        const certPath = path.join(__dirname, '../common/private.key');
        return fs.readFileSync(certPath);
    }

    private _jwtById(payload: PayloadJWT): string {
        return jwt
            .sign(payload.toPayload(), this._getPrivateKey(),
                {
                    algorithm: JWT_ALGORITHM,
                    expiresIn: JWT_EXPIRES_IN
                }
            );
    }
}
