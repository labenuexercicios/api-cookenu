import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
    constructor(
        message: string = "Permissão insuficiente."
    ) {
        super(403, message)
    }
}