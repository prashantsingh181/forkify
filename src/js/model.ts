import { Recipe, RecipeAPI, RecipeAPIBase, RecipeBase } from '../types';
import { convertKeysToCamelCase, getJSON } from './helpers';

const BASE_URL = process.env.PARCEL_API_BASE_URL;

if (!BASE_URL)
  throw new Error('Provide PARCEL_API_BASE_URL in environment variable');

interface StateType {
  recipe?: Recipe;
  search: { query: string; results: RecipeBase[] };
  bookmarks: Recipe[];
}

export const state: StateType = {
  search: { query: '', results: [] },
  bookmarks: [],
};

export const setRecipe = function (recipe: Recipe) {
  state.recipe = recipe;
  console.log(recipe);
  state.bookmarks = state.bookmarks.map(bookmark => ({
    ...bookmark,
    active: bookmark.id === recipe.id,
  }));
};

export const loadRecipe = async function (id: string) {
  if (!id) throw new Error('id is required');
  const responseData = await getJSON<{ recipe: RecipeAPI }>(
    process.env.PARCEL_API_BASE_URL + `/recipes/${id}`
  );

  const { recipe } = responseData.data;

  const formattedRecipe =
    convertKeysToCamelCase<Omit<Recipe, 'bookmarked'>>(recipe);
  setRecipe({
    ...formattedRecipe,
    bookmarked: state.bookmarks.some(
      bookmark => bookmark.id === formattedRecipe.id
    ),
  });
};

export const loadSearchResult = async function (query: string = '') {
  const responseData = await getJSON<{ recipes: RecipeAPIBase[] }>(
    process.env.PARCEL_API_BASE_URL + `/recipes?search=${query}`
  );
  const formattedRecipes = responseData.data.recipes.map(recipe => {
    const formattedRecipe =
      convertKeysToCamelCase<Omit<RecipeBase, 'active'>>(recipe);
    return {
      ...formattedRecipe,
      active: state.recipe?.id === formattedRecipe.id,
    };
  });
  state.search.results = formattedRecipes;
};

export const updateServings = function (newServings: number) {
  if (!state.recipe) return;

  const recipe = state.recipe;
  state.recipe.ingredients.forEach(ingredient => {
    if (ingredient.quantity) {
      ingredient.quantity =
        ingredient.quantity * (newServings / recipe.servings);
    }
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe: Recipe) {
  if (state.recipe && state.recipe.id === recipe.id) {
    state.recipe.bookmarked = true;
  }
  state.bookmarks.push({
    ...recipe,
    bookmarked: true,
    active: state.recipe ? state.recipe.id === recipe.id : false,
  });
};

export const removeBookmark = function (recipeId: string) {
  state.bookmarks = state.bookmarks.filter(
    bookmark => bookmark.id !== recipeId
  );
  if (state.recipe && state.recipe.id === recipeId) {
    state.recipe.bookmarked = false;
  }
};
