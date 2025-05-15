import { RecipeBase } from '../../types';
import recipePreviewView from './recipePreviewView';
import View from './view';

class BookmarksView extends View<RecipeBase[]> {
  _parentElement = document.querySelector('.bookmarks') as HTMLDivElement;

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
