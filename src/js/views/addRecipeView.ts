import type { RecipeForm } from '../../types';
import icons from "../../img/icons.svg";

class AddRecipeView {
  private readonly _form = document.querySelector('.upload') as HTMLFormElement;
  private readonly _dialog = document.querySelector(
    '.add-recipe-window'
  ) as HTMLDialogElement;
  private readonly _addRecipeButton = document.querySelector(
    '.nav__btn--add-recipe'
  ) as HTMLButtonElement;
  private readonly _closeModalButton = document.querySelector(
    '.btn--close-modal'
  ) as HTMLButtonElement;
  private readonly _formSubmitButton = document.querySelector(
    '.upload__btn'
  ) as HTMLButtonElement;
  private readonly _errorElement = document.querySelector(
    '.form-error'
  ) as HTMLDivElement;
  _errors!: Record<string, string>;
  _errorMessage = 'Something went wrong. Please try again later.';

  protected _init() {
    this._addRecipeButton.addEventListener('click', this.showDialog.bind(this));
    this._dialog.addEventListener('click', e => {
      const target = e.target;
      if (target instanceof HTMLElement && target.nodeName === 'DIALOG') {
        this.hideDialog();
      }
    });
    this._closeModalButton.addEventListener(
      'click',
      this.hideDialog.bind(this)
    );
  }

  addUploadHandler(handler: (recipe: RecipeForm) => void) {
    this._init();
    this._form.addEventListener('submit', e => {
      e.preventDefault();
      const formObject = Object.fromEntries(
        new FormData(this._form)
      ) as RecipeForm;
      handler(formObject);
    });
  }

  showDialog() {
    this._dialog.showModal();
  }

  hideDialog() {
    this._dialog.close();
    this._form.reset();
    this.removeSpinner();
    this.removeFormErrors();
  }
  renderSpinner() {
    this._formSubmitButton.innerHTML = `
        <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
    `;
    this._formSubmitButton.disabled = true;
  }

  removeSpinner() {
    this._formSubmitButton.innerHTML = `
        <span>Upload</span>
        <svg class="upload__icon">
            <use href="${icons}#icon-upload"></use>
        </svg>
    `;
    this._formSubmitButton.disabled = false;
  }

  renderError(message?: string) {
    this._errorElement.textContent = message ?? this._errorMessage;
  }

  renderFormErrors(errors: Record<string, string>) {
    this._errors = errors;
    for (const key in this._errors) {
      const formField = this._form.querySelector(`[name=${key}]`);
      formField?.insertAdjacentHTML(
        'afterend',
        `<div class='form-error'>${this._errors[key]}</div>`
      );
    }
  }
  removeFormErrors() {
    this._form.querySelectorAll('.form-error').forEach(error => {
      error.remove();
    });
  }
}

export default new AddRecipeView();
