import type { Ingredient, Recipe } from '../../types';
import icons from '../../img/icons.svg';
import View from './view';
import { MAX_SERVINGS_ALLOWED } from '../config';

class RecipeView extends View<Recipe> {
  _parentElement = document.querySelector('.recipe') as HTMLDivElement;
  _errorMessage = "We couldn't find this recipe. Please try another one.";
  _message = '';

  addRenderHandler(handler: () => void) {
    ['load', 'hashchange'].forEach(event => {
      window.addEventListener(event, handler);
    });
  }

  addUpdateServingsHandler(handler: (servings: number) => void) {
    this._parentElement.addEventListener('click', ({ target }) => {
      if (!target || !(target instanceof Element)) return;

      const btn = target.closest('.btn--tiny') as HTMLButtonElement;
      if (!btn) return;
      const updateTo = Number(btn.dataset.updateTo);
      if (updateTo) {
        handler(updateTo);
      }
    });
  }

  addBookmarkHandler(handler: () => void) {
    this._parentElement.addEventListener('click', ({ target }) => {
      if (!target || !(target instanceof Element)) return;

      const bookmarkButton = target.closest('.btn--bookmark');
      if (!bookmarkButton) return;
      handler();
    });
  }

  protected _generateMarkup() {
    return `
        <figure class="recipe__fig">
        <img src="${this._data.imageUrl}" alt="Tomato" class="recipe__img" />
        <h1 class="recipe__title">
            <span>${this._data.title}</span>
        </h1>
        </figure>

        <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
            <button class="btn--tiny btn--decrease-servings" data-update-to="${
              this._data.servings - 1
            }"
              ${this._data.servings === 1 ? 'disabled' : ''}
            >
                <svg>
                <use href="${icons}#icon-minus-circle"></use>
                </svg>
            </button>
            <button class="btn--tiny btn--increase-servings" data-update-to="${
              this._data.servings + 1
            }"
              ${this._data.servings === MAX_SERVINGS_ALLOWED ? 'disabled' : ''}
            >
                <svg>
                <use href="${icons}#icon-plus-circle"></use>
                </svg>
            </button>
            </div>
        </div>

        <div class="recipe__options">
          ${
            this._data.key
              ? `<div class="recipe__user-generated">
                <svg>
                <use href="${icons}#icon-user"></use>
                </svg> 
              </div> `
              : ''
          }
          <button class="btn--round btn--bookmark">
              <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
              </svg>
          </button>
        </div>
        </div>

        <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
            ${this._data.ingredients.reduce((acc, ingredient) => {
              return acc + this._generateIngredientMarkup(ingredient);
            }, '')}
        </ul>
        </div>

        <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
        </p>
        <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
        >
            <span>Directions</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </a>
        </div>
        `;
  }

  protected _generateIngredientMarkup(ingredient: Ingredient) {
    return `
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${ingredient.quantity ?? ''}</div>
            <div class="recipe__description">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.description}
            </div>
        </li>`;
  }
}

export default new RecipeView();
