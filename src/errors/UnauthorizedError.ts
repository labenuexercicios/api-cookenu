import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
    constructor(
        message: string = "Credenciais inválidas. Cheque seu token"
    ) {
        super(401, message)
    }
}