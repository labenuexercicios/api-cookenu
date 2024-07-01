import { UserDatabase } from "../database/UserDatabase"
import { NotFoundError } from "../errors/NotFoundError"
import { RequestError } from "../errors/RequestError"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { ILoginInputDTO, ILoginOutputDTO, ISignupInputDTO, ISignupOutputDTO, User } from "../models/User"
import { Authenticator, ITokenPayload } from "../services/Authenticator"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator
    ) {}

    public signup = async (input: ISignupInputDTO): Promise<ISignupOutputDTO> => {
        const { name, email, password } = input

        if (typeof name !== "string") {
            throw new RequestError("Campo 'name' inválido ou faltando: deve ser uma string")
        }

        if (typeof email !== "string") {
            throw new RequestError("Campo 'email' inválido ou faltando: deve ser uma string")
        }

        if (typeof password !== "string") {
            throw new RequestError("Campo 'password' inválido ou faltando: deve ser uma string")
        }

        if (name.length < 3) {
            throw new RequestError("Campo 'name' inválido: mínimo de 3 caracteres")
        }

        if (password.length < 6) {
            throw new RequestError("Campo 'password' inválido: mínimo de 6 caracteres")
        }

        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            throw new RequestError("Campo 'email' inválido")
        }

        const isEmailAlreadyExists = await this.userDatabase.findByEmail(email)
        
        if (isEmailAlreadyExists) {
            throw new RequestError("Email já cadastrado")
        }

        const id = this.idGenerator.generate()
        const hashedPassword = await this.hashManager.hash(password)

        const user = new User(
            id,
            name,
            email,
            hashedPassword
        )

        await this.userDatabase.createUser(user)

        const payload: ITokenPayload = {
            id: user.getId(),
            name: user.getName()
        }

        const token = this.authenticator.generateToken(payload)

        const response: ISignupOutputDTO = {
            message: "Cadastro realizado com sucesso",
            token
        }

        return response
    }

    public login = async (input: ILoginInputDTO): Promise<ILoginOutputDTO> => {
        const { email, password } = input

        if (typeof email !== "string") {
            throw new RequestError("Campo 'email' inválido ou faltando: deve ser uma string")
        }

        if (typeof password !== "string") {
            throw new RequestError("Campo 'password' inválido ou faltando: deve ser uma string")
        }

        if (password.length < 6) {
            throw new RequestError("Campo 'password' inválido: mínimo de 6 caracteres")
        }

        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            throw new RequestError("Campo 'email' inválido")
        }

        const userDB = await this.userDatabase.findByEmail(email)
        
        if (!userDB) {
            throw new NotFoundError("Email não cadastrado")
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password
        )

        const isPasswordCorrect = await this.hashManager.compare(
            password,
            user.getPassword()
        )

        if (!isPasswordCorrect) {
            throw new UnauthorizedError("Password incorreto")
        }

        const payload: ITokenPayload = {
            id: user.getId(),
            name: user.getName()
        }

        const token = this.authenticator.generateToken(payload)

        const response: ILoginOutputDTO = {
            message: "Login realizado com sucesso",
            token
        }

        return response
    }
}