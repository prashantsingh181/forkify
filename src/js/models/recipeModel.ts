import type { Recipe, RecipeAPI, RecipeForm } from '../../types';
import { AJAX, convertKeysToCamelCase } from '../helpers';

class RecipeModel {
  private _recipe!: Recipe;

  get recipe() {
    return this._recipe;
  }
  set recipe(recipe: Recipe) {
    this._recipe = recipe;
  }

  async loadRecipe(id: string) {
    if (!id) throw new Error('id is required');
    const responseData = await AJAX<{ recipe: RecipeAPI }>(
      import.meta.env.VITE_API_BASE_URL + `/recipes/${id}`,
      {queryParams: { key: import.meta.env.VITE_API_KEY }}
    );

    const { recipe } = responseData.data;

    const formattedRecipe =
      convertKeysToCamelCase<Omit<Recipe, 'bookmarked'>>(recipe);

    this.recipe = { ...formattedRecipe, bookmarked: false };
  }

  async createRecipe(newRecipe: RecipeForm) {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        const [quantity, unit, description] = ingArr;

        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    const requestBody = {
      title: newRecipe.title,
      source_url: newRecipe.source_url,
      image_url: newRecipe.image_url,
      publisher: newRecipe.publisher,
      cooking_time: Number(newRecipe.cooking_time),
      servings: Number(newRecipe.servings),
      ingredients,
    };

    const responseData = await AJAX<{ recipe: RecipeAPI }>(
      import.meta.env.VITE_API_BASE_URL + '/recipes',
      {
        method: 'POST',
        requestBody,
        queryParams: { key: import.meta.env.VITE_API_KEY },
      }
    );
    const formattedRecipe = convertKeysToCamelCase<Omit<Recipe, 'bookmarked'>>(
      responseData.data.recipe
    );
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
