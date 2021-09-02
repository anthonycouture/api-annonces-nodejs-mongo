import path from "path";
import fs from "fs";
import {JWT_ALGORITHM, JWT_EXPIRES_IN, USERS_COLLECTION} from "../common/constantes";
import {User} from "../entity/user";
import {Database} from "../common/db";
import {PayloadJWT} from "../models/payloadJWT";
import jwt from "jsonwebtoken";
import {Roles} from "../common/roles";
import {InsertOneResult} from "mongodb";

const db = () => Database.getInstance().db;

const getPrivateKey = (): Buffer => {
    const certPath = path.join(__dirname, '../common/private.key');
    return fs.readFileSync(certPath);
}

const jwtById = (payload: PayloadJWT): string => {
    return jwt
        .sign(payload.toPayload(), getPrivateKey(),
            {
                algorithm: JWT_ALGORITHM,
                expiresIn: JWT_EXPIRES_IN
            });
}

export const authUser = async (email: string, password: string): Promise<string> => {
    const usersTab = await db()
        .collection(USERS_COLLECTION)
        .find({
            email,
            password
        })
        .toArray() as User[];

    if (usersTab.length === 0)
        throw new Error("utilisateur non trouvé");

    const user: User = usersTab[0];

    const payload = new PayloadJWT(user._id);
    return jwtById(payload);
};

export const registerUser = async (email: string, password: string, role: 'admin' | 'user'): Promise<string> => {
    const roles = role === "user" ? [Roles.user] : [Roles.user, Roles.admin];
    const usersTab = await db()
        .collection(USERS_COLLECTION)
        .find({
            email
        })
        .toArray() as User[];
    if (usersTab.length !== 0)
        throw new Error("utilisateur déjà présent");
    const insertData = {email, password, roles};
    const insert: InsertOneResult = await db()
        .collection(USERS_COLLECTION)
        .insertOne(insertData);
    const user = new User(insert.insertedId, insertData.email, insertData.password, insertData.roles);
    const payload = new PayloadJWT(user._id);
    return jwtById(payload);
};

export const verifyJwt = (tokenJwt: string) : PayloadJWT => {
    return jwt.verify(tokenJwt, getPrivateKey(), {
        algorithms: [JWT_ALGORITHM]
    }) as PayloadJWT;
}