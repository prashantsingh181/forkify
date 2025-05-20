import {
  ADD_RECIPE_FORM_VALIDATION_RULES,
  DEBOUNCE_SEC,
  MAX_SERVINGS_ALLOWED,
} from "./config";
import { debounce, validateForm } from "./helpers";
import bookmarksView from "./views/bookmarksView";
import recipeView from "./views/recipeViews";
import searchView from "./views/searchView";
import bookmarkModel from "./models/bookmarkModel";
import recipeModel from "./models/recipeModel";
import searchModel from "./models/searchModel";
import addRecipeView from "./views/addRecipeView";
import type { RecipeForm } from "../types";

async function controlRecipe() {
  // close the Modal
  searchView.hideSearchDialog();
  // get hash from url
  const { hash } = window.location;
  if (!hash) {
    bookmarkModel.setActive(null);
    if (bookmarkModel.bookmarks.length > 0) {
      bookmarksView.update(bookmarkModel.bookmarks);
    }
    return;
  }
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
      bookmarkModel.setActive(recipeModel.recipe.id);
    }
  } catch (error) {
    console.error(error);
    recipeView.renderError();
    bookmarkModel.setActive(null);
  }
  // update bookmark
  if (bookmarkModel.bookmarks.length > 0) {
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
  if (!bookmarkModel.bookmarks || bookmarkModel.bookmarks.length === 0) {
    bookmarksView.renderMessage();
    return;
  }
  bookmarksView.render(bookmarkModel.bookmarks);
}

async function controlAddRecipe(newRecipe: RecipeForm) {
  // validate the form fields
  const errors = validateForm(newRecipe, ADD_RECIPE_FORM_VALIDATION_RULES);

  // if error show error and return
  if (Object.keys(errors).length > 0) {
    addRecipeView.renderFormErrors(errors);
    return;
  }
  // if success show spinner and make api call
  addRecipeView.removeFormErrors();
  addRecipeView.renderSpinner();
  try {
    await recipeModel.createRecipe(newRecipe);
    // add the recipe to bookmarks and render
    bookmarkModel.addBookmark(recipeModel.recipe);
    bookmarksView.render(bookmarkModel.bookmarks);
    addRecipeView.hideDialog();

    location.hash = `#${recipeModel.recipe.id}`;
  } catch (error) {
    console.error(error);
    addRecipeView.renderError((error as Error).message);
    addRecipeView.removeSpinner();
    return;
  }
}

const debouncedControlSearchResults = debounce(
  controlSearchResults,
  DEBOUNCE_SEC * 1000
);

function init() {
  bookmarksView.addLoadHandler(controlLoadBookMark);
  searchView.addSearchHandler(debouncedControlSearchResults);
  recipeView.addRenderHandler(controlRecipe);
  recipeView.addUpdateServingsHandler(controlRecipeServings);
  recipeView.addBookmarkHandler(controlBookmarks);
  addRecipeView.addUploadHandler(controlAddRecipe);
}

init();
