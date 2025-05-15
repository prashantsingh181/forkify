import { DEBOUNCE_SEC, MAX_SERVINGS_ALLOWED } from './config';
import { debounce } from './helpers';
import bookmarksView from './views/bookmarksView';
import recipeView from './views/recipeViews';
import searchView from './views/searchView';
import bookmarkModel from './models/bookmarkModel';
import recipeModel from './models/recipeModel';
import searchModel from './models/searchModel';

async function controlRecipe() {
  // close the Modal
  searchView.hideSearchDialog();

  // get hash from url
  const { hash } = window.location;
  if (!hash) return;

  const id = hash.slice(1);

  try {
    // show spinner
    recipeView.renderSpinner();
    // load the recipe
    await recipeModel.loadRecipe(id);

    // check if the recipe is bookmarked then render
    if (recipeModel.recipe) {
      if (bookmarkModel.has(recipeModel.recipe.id)) {
        recipeModel.addBookmark();
      }
      recipeView.render(recipeModel.recipe);
    }
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
  // set active recipe in bookmarks and update
  if (bookmarkModel.bookmarks.length > 0) {
    bookmarkModel.setActive(recipeModel.recipe.id);
    bookmarksView.update(bookmarkModel.bookmarks);
  }
}

async function controlSearchResults() {
  // get search query from input
  const query = searchView.getInputValue();
  if (!query) return;

  try {
    // render spinner
    searchView.renderSpinner();
    // load search result
    await searchModel.loadSearchResult(query);

    // if no data then show error
    if (
      !searchModel.results ||
      (Array.isArray(searchModel.results) && searchModel.results.length === 0)
    ) {
      searchView.renderError();
      return;
    }
    // set active recipe in search result
    if (recipeModel.recipe) {
      searchModel.setActive(recipeModel.recipe.id);
    }
    // render search view
    searchView.render(searchModel.results);
  } catch (error) {
    console.error(error);
    searchView.renderError();
  }
}

function controlRecipeServings(newServings: number) {
  if (newServings <= 0 || newServings > MAX_SERVINGS_ALLOWED) return;
  if (recipeModel.recipe) {
    // update servings data and view
    recipeModel.updateServings(newServings);
    recipeView.update(recipeModel.recipe);
  }
}

function controlBookmarks() {
  // adding or removing bookmark in model
  if (!recipeModel.recipe) return;
  if (!recipeModel.recipe.bookmarked) {
    recipeModel.addBookmark();
    bookmarkModel.addBookmark(recipeModel.recipe);
  } else {
    recipeModel.removeBookmark();
    bookmarkModel.removeBookmark(recipeModel.recipe.id);
  }

  // updating recipeView to change the bookmark icon
  recipeView.update(recipeModel.recipe);

  // set active in bookmark and render
  bookmarkModel.setActive(recipeModel.recipe.id);
  bookmarksView.render(bookmarkModel.bookmarks);
}

function controlLoadBookMark() {
  // loading bookmarks and rendering its view
  bookmarkModel.load();
  bookmarksView.render(bookmarkModel.bookmarks);
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
  bookmarksView.addLoadHandler(controlLoadBookMark);
}

init();
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//API KEY: 3cf37c37-c1c5-492a-9832-21a935a66e3d
// URL: https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886
