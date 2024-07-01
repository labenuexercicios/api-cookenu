import { RecipeDatabase } from "../database/RecipeDatabase"
import { ForbiddenError } from "../errors/ForbiddenError"
import { NotFoundError } from "../errors/NotFoundError"
import { RequestError } from "../errors/RequestError"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { ICreateRecipeInputDTO, ICreateRecipeOutputDTO, IDeleteRecipeByIdInputDTO, IDeleteRecipeByIdOutputDTO, IGetAllRecipesInputDTO, IGetAllRecipesOutputDTO, IGetRecipeDetailsInputDTO, IGetRecipeDetailsOutputDTO, IRecipeDB, Recipe } from "../models/Recipe"
import { Authenticator } from "../services/Authenticator"
import { IdGenerator } from "../services/IdGenerator"

export class RecipeBusiness {
    constructor(
        private recipeDatabase: RecipeDatabase,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator
    ) { }

    public getAllRecipes = async (input: IGetAllRecipesInputDTO): Promise<IGetAllRecipesOutputDTO[]> => {
        const { token } = input

        if (!token) {
            throw new UnauthorizedError()
        }

        const payload = this.authenticator.getTokenPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const recipesDB = await this.recipeDatabase.getAllRecipes()

        const response: IGetAllRecipesOutputDTO[] = recipesDB.map((recipeDB) => ({
            id: recipeDB.id,
            title: recipeDB.title,
            imageUrl: recipeDB.imageUrl
        }))

        return response
    }

    public getRecipeDetails = async (input: IGetRecipeDetailsInputDTO): Promise<IGetRecipeDetailsOutputDTO> => {
        const { token, recipeId } = input

        if (!token) {
            throw new UnauthorizedError()
        }

        const payload = this.authenticator.getTokenPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const response = await this.recipeDatabase.getRecipeDetails(recipeId)

        return response
    }

    public createRecipe = async (input: ICreateRecipeInputDTO): Promise<ICreateRecipeOutputDTO> => {
        const {
            token,
            title,
            description,
            imageUrl
        } = input

        if (!token) {
            throw new UnauthorizedError()
        }

        const payload = this.authenticator.getTokenPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        if (typeof title !== "string") {
            throw new RequestError("Campo 'title' inválido ou faltando: deve ser uma string")
        }

        if (typeof description !== "string") {
            throw new RequestError("Campo 'description' inválido ou faltando: deve ser uma string")
        }

        if (typeof imageUrl !== "string") {
            throw new RequestError("Campo 'imageUrl' inválido ou faltando: deve ser uma string")
        }

        if (title.length < 3) {
            throw new RequestError("Campo 'title' inválido: mínimo de 3 caracteres")
        }

        if (description.length < 6) {
            throw new RequestError("Campo 'description' inválido: mínimo de 5 caracteres")
        }

        if (imageUrl.length < 6) {
            throw new RequestError("Campo 'description' inválido: mínimo de 5 caracteres")
        }

        const recipe = new Recipe(
            this.idGenerator.generate(),
            title,
            description,
            new Date().toLocaleDateString('pt-BR'),
            imageUrl,
            payload.id,
            payload.name
        )

        await this.recipeDatabase.createRecipe(recipe)

        const response: ICreateRecipeOutputDTO = {
            message: "Receita criada com sucesso"
        }

        return response
    }

    public deleteRecipeById = async (input: IDeleteRecipeByIdInputDTO): Promise<IDeleteRecipeByIdOutputDTO> => {
        const { token, recipeId } = input

        if (!token) {
            throw new UnauthorizedError()
        }

        const payload = this.authenticator.getTokenPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const recipeDB = await this.recipeDatabase.getRecipeById(recipeId)

        if (!recipeDB) {
            throw new NotFoundError()
        }

        if (payload.id !== recipeDB.creatorId) {
            throw new ForbiddenError("Permissão insuficiente. Somente a conta que criou a receita pode deletá-la.")
        }

        await this.recipeDatabase.deleteRecipeById(recipeId)

        const response: IDeleteRecipeByIdOutputDTO = {
            message: "Receita deletada com sucesso"
        }

        return response
    }
}