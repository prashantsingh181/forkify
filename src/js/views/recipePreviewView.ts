import type { RecipeBase } from '../../types';
import View from './view';
import icons from '../../img/icons.svg';

class RecipePreviewView extends View<RecipeBase> {
  render(data: RecipeBase, shouldRender: boolean = false) {
    this._data = data;
    const html = this._generateMarkup();
    if (!shouldRender) return html;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  protected _generateMarkup(): string {
    return `
        <li class="preview">
            <a class="preview__link ${
              this._data.active ? 'preview__link--active' : ''
            }" href="#${this._data.id}">
              <figure class="preview__fig">
                <img
                  src="${this._data.imageUrl}"
                  alt="${this._data.title}"
                />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>
                 <div class="preview__user-generated ${
                   this._data.key ? '' : 'hidden'
                 }">
              <svg>
              <use href="${icons}#icon-user"></use>
              </svg>
            </div>
              </div>
            </a>
          </li>`;
  }
}

export default new RecipePreviewView();
