export class UserExistError extends Error {

    constructor(message: string = `L'utilisateur existe déjà`) {
        super(message);
    }
}