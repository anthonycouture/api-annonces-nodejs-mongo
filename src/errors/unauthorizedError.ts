export class UnauthorizedError extends Error {

    constructor(message: string = `Non autorisé`) {
        super(message);
    }
}