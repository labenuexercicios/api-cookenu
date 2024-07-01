export interface IRecipeDB {
    id: string,
    title: string,
    description: string,
    createdAt: string, // no formato "dd/mm/aaaa"
    imageUrl: string,
    creatorId: string
}

export class Recipe {
    constructor(
        private id: string,
        private title: string,
        private description: string,
        private createdAt: string,
        private imageUrl: string,
        private creatorId: string,
        private creatorName: string
    ) {}

    public getId = () => {
        return this.id
    }

    public getTitle = () => {
        return this.title
    }

    public getDescription = () => {
        return this.description
    }

    public getCreatedAt = () => {
        return this.createdAt
    }

    public getImageUrl = () => {
        return this.imageUrl
    }

    public getCreatorId = () => {
        return this.creatorId
    }

    public getCreatorName = () => {
        return this.creatorName
    }

    public setId = (newId: string) => {
        return this.id = newId
    }

    public setTitle = (newTitle: string) => {
        return this.title = newTitle
    }

    public setDescription = (newDescription: string) => {
        return this.description = newDescription
    }

    public setCreatedAt = (newCreatedAt: string) => {
        return this.createdAt = newCreatedAt
    }

    public setImageUrl = (newImageUrl: string) => {
        return this.imageUrl = newImageUrl
    }

    public setCreatorId = (newCreatorId: string) => {
        return this.creatorId = newCreatorId
    }

    public setCreatorName = (newCreatorName: string) => {
        return this.creatorName = newCreatorName
    }
}

export interface IGetAllRecipesInputDTO {
    token: string
}

export interface IGetAllRecipesOutputDTO {
    id: string,
    title: string,
    imageUrl: string
}[]

export interface IGetRecipeDetailsInputDTO {
    token: string,
    recipeId: string
}

export interface IGetRecipeDetailsOutputDTO {
    id: string,
    title: string,
    description: string,
    createdAt: string,
    imageUrl: string,
    creatorId: string,
    creatorName: string
}

export interface ICreateRecipeInputDTO {
    token: string,
    title: string,
    description: string,
    imageUrl: string
}

export interface ICreateRecipeOutputDTO {
    message: string
}

export interface IDeleteRecipeByIdInputDTO {
    token: string,
    recipeId: string
}

export interface IDeleteRecipeByIdOutputDTO {
    message: string
}
