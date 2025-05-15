import { Recipe, RecipeAPI } from '../../types';
import { convertKeysToCamelCase, getJSON } from '../helpers';

class RecipeModel {
  private _recipe: Recipe;

  get recipe() {
    return this._recipe;
  }
  set recipe(recipe: Recipe) {
    this._recipe = recipe;
  }

  async loadRecipe(id: string) {
    if (!id) throw new Error('id is required');
    const responseData = await getJSON<{ recipe: RecipeAPI }>(
      process.env.PARCEL_API_BASE_URL + `/recipes/${id}`
    );

    const { recipe } = responseData.data;

    const formattedRecipe =
      convertKeysToCamelCase<Omit<Recipe, 'bookmarked'>>(recipe);

    this.recipe = { ...formattedRecipe, bookmarked: false };
  }

  addBookmark() {
    this.recipe.bookmarked = true;
  }

  removeBookmark() {
    this.recipe.bookmarked = false;
  }

  updateServings(newServings: number) {
    if (!this.recipe) return;

    this.recipe.ingredients.forEach(ingredient => {
      if (ingredient.quantity) {
        ingredient.quantity =
          ingredient.quantity * (newServings / this.recipe.servings);
      }
    });
    this.recipe.servings = newServings;
  }
}
export default new RecipeModel();
