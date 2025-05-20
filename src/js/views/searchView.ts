import type { RecipeBase } from '../../types';
import View from './view';
import recipePreviewView from './recipePreviewView';

class SearchView extends View<RecipeBase[]> {
  _parentElement = document.querySelector('.search-results') as HTMLDivElement;
  _searchButton = document.querySelector('.search') as HTMLButtonElement;
  _searchDialog = document.querySelector(
    '.search__dialog'
  ) as HTMLDialogElement;
  _searchField = document.querySelector(
    '.search__form .search__field'
  ) as HTMLInputElement;
  _message =
    'Start typing to search through our recipes. Please make sure to write full words, For Ex- Pizza, Burger.';
  _errorMessage =
    'No results found for your query. Please make sure to write full words, For Ex- Pizza, Burger.';

  protected _init() {
    this._searchButton.addEventListener(
      'click',
      this.showSearchDialog.bind(this)
    );
    this._searchDialog.addEventListener('click', e => {
      const target = e.target;
      if (target instanceof HTMLElement && target.nodeName === 'DIALOG') {
        this.hideSearchDialog();
      }
    });
  }

  addSearchHandler(handler: () => void) {
    this._init();
    this._searchField.addEventListener('input', handler);
  }
  getInputValue() {
    return this._searchField.value;
  }

  clearInputValue() {
    this._searchField.value = '';
  }

  showSearchDialog() {
    this._clear();
    this.renderMessage();
    this._searchDialog.showModal();
    this._searchField.focus();
  }
  hideSearchDialog() {
    this._searchDialog.close();
    this.clearInputValue();
  }

  protected _generateMarkup(): string {
    return `
        <ul class="results">
          ${this._data.reduce(
            (acc, recipe) =>
              acc + recipePreviewView.render(recipe, false),
            ''
          )}
        </ul>
    `;
  }
}

export default new SearchView();
