import { Router } from 'express'
import { RecipeBusiness } from '../business/RecipeBusiness'
import { RecipeController } from '../controller/RecipeController'
import { RecipeDatabase } from '../database/RecipeDatabase'
import { Authenticator } from '../services/Authenticator'
import { IdGenerator } from '../services/IdGenerator'

export const recipeRouter = Router()

const recipeController = new RecipeController(
    new RecipeBusiness(
        new RecipeDatabase(),
        new IdGenerator(),
        new Authenticator()
    )
)

recipeRouter.get("/all", recipeController.getAllRecipes)
recipeRouter.get("/:recipeId", recipeController.getRecipeDetails)
recipeRouter.post("/", recipeController.createRecipe)
recipeRouter.delete("/:recipeId", recipeController.deleteRecipeById)