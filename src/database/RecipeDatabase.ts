import { IGetRecipeDetailsOutputDTO, IRecipeDB, Recipe } from "../models/Recipe"
import { BaseDatabase } from "./BaseDatabase"
import { UserDatabase } from "./UserDatabase"

export class RecipeDatabase extends BaseDatabase {
    public static TABLE_RECIPES = "Cookenu_Recipes"

    public getAllRecipes = async (): Promise<IRecipeDB[]> => {
        const recipesDB: IRecipeDB[] = await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .select()
        
        return recipesDB
    }

    public getRecipeDetails = async (recipeId: string): Promise<IGetRecipeDetailsOutputDTO> => {
        const recipesDB: any = await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .select(
                `${RecipeDatabase.TABLE_RECIPES}.id as id`,
                "title",
                "description",
                "createdAt",
                "imageUrl",
                `${UserDatabase.TABLE_USERS}.id as creatorId`,
                "name as creatorName"
            )
            .join(UserDatabase.TABLE_USERS, `${RecipeDatabase.TABLE_RECIPES}.creatorId`, `${UserDatabase.TABLE_USERS}.id`)
            .where({
                [`${RecipeDatabase.TABLE_RECIPES}.id`]: recipeId
            })

        return recipesDB[0] as IGetRecipeDetailsOutputDTO
    }

    public createRecipe = async (recipe: Recipe): Promise<void> => {
        const recipeDB: IRecipeDB = {
            id: recipe.getId(),
            title: recipe.getTitle(),
            description: recipe.getDescription(),
            imageUrl: recipe.getImageUrl(),
            createdAt: recipe.getCreatedAt(),
            creatorId: recipe.getCreatorId()
        }

        await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .insert(recipeDB)
    }

    public getRecipeById = async (recipeId: string): Promise<IRecipeDB | undefined> => {
        const recipesDB: IRecipeDB[] = await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .select()
            .where({
                id: recipeId
            })

        return recipesDB[0] 
    }

    public deleteRecipeById = async (recipeId: string): Promise<void> => {
        await BaseDatabase
            .connection(RecipeDatabase.TABLE_RECIPES)
            .delete()
            .where({
                id: recipeId
            })
    }
}