import type { RecipeAPIBase, RecipeBase } from '../../types';
import { AJAX, convertKeysToCamelCase } from '../helpers';

class SearchModel {
  query!: string;
  private _results: RecipeBase[] = [];

  get results() {
    return this._results;
  }
  set results(results: RecipeBase[]) {
    this._results = results;
  }

  async loadSearchResult(query: string = '') {
    const responseData = await AJAX<{ recipes: RecipeAPIBase[] }>(
      import.meta.env.VITE_API_BASE_URL + `/recipes?search=${query}`
    );
    const formattedRecipes = responseData.data.recipes.map(recipe => {
      const formattedRecipe =
        convertKeysToCamelCase<Omit<RecipeBase, 'active'>>(recipe);
      return {
        ...formattedRecipe,
        active: false,
      };
    });
    this.results = formattedRecipes;
  }

  setActive(recipeId: string) {
    this.results = this.results.map(recipe => ({
      ...recipe,
      active: recipe.id === recipeId,
    }));
  }
}

export default new SearchModel();
