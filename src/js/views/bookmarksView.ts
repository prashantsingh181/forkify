import type { RecipeBase } from '../../types';
import recipePreviewView from './recipePreviewView';
import View from './view';

class BookmarksView extends View<RecipeBase[]> {
  _parentElement = document.querySelector('.bookmarks') as HTMLDivElement;
  _message = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addLoadHandler(handler: () => void) {
    window.addEventListener('load', handler);
  }

  protected _generateMarkup(): string {
    return `
        <ul class="results">
        ${this._data.reduce(
          (acc, recipe) => acc + recipePreviewView.render(recipe, false),
          ''
        )}
        </ul>
    `;
  }
}

export default new BookmarksView();
