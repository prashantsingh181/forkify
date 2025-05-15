import { DEBOUNCE_SEC, MAX_SERVINGS_ALLOWED } from './config';
import { debounce } from './helpers';
import * as model from './model';
import bookmarksView from './views/bookmarksView';
import recipeView from './views/recipeViews';
import searchView from './views/searchView';

async function controlRecipe() {
  searchView.hideSearchDialog();
  const { hash } = window.location;
  if (!hash) return;

  const id = hash.slice(1);

  try {
    recipeView.renderSpinner();
    await model.loadRecipe(id);
    if (model.state.recipe) {
      recipeView.render(model.state.recipe);
    }
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
  if (model.state.bookmarks.length > 0)
    bookmarksView.update(model.state.bookmarks);
}

async function controlSearchResults() {
  const query = searchView.getInputValue();
  if (!query) return;

  try {
    searchView.renderSpinner();
    await model.loadSearchResult(query);
    const data = model.state.search.results;
    if (data && Array.isArray(data) && data.length === 0) {
      searchView.renderError();
      return;
    }
    searchView.render(data);
  } catch (error) {
    console.error(error);
    searchView.renderError();
  }
}

function controlRecipeServings(newServings: number) {
  if (newServings <= 0 || newServings > MAX_SERVINGS_ALLOWED) return;
  if (model.state.recipe) {
    model.updateServings(newServings);
    recipeView.update(model.state.recipe);
  }
}

function controlBookmarks() {
  // adding or removing bookmark in model
  if (!model.state.recipe) return;
  if (!model.state.recipe?.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.removeBookmark(model.state.recipe.id);
  }

  // updating recipeView to change the bookmark icon
  recipeView.update(model.state.recipe);

  // render bookmarkView
  bookmarksView.render(model.state.bookmarks);
}

const debouncedControlSearchResults = debounce(
  controlSearchResults,
  DEBOUNCE_SEC * 1000
);

function init() {
  searchView.addSearchHandler(debouncedControlSearchResults);
  recipeView.addRenderHandler(controlRecipe);
  recipeView.addUpdateServingsHandler(controlRecipeServings);
  recipeView.addBookmarkHandler(controlBookmarks);
}

init();
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//API KEY: 3cf37c37-c1c5-492a-9832-21a935a66e3d
// URL: https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886
