import icons from '../../img/icons.svg';

abstract class View<T> {
  _parentElement!: HTMLElement;
  _errorMessage!: string;
  _message!: string;
  _data!: T;

  protected abstract _generateMarkup(): string;

  protected _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  render(data: T) {
    this._data = data;
    const html = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }

  update(data: T) {
    this._data = data;

    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    currentElements.forEach((element, index) => {
      const newElement = newElements[index];

      if (
        !element.isEqualNode(newElement) &&
        element.firstChild?.nodeValue?.trim() !== ''
      ) {
        element.textContent = newElement.textContent;
      }

      if (!element.isEqualNode(newElement)) {
        const attributes = element.attributes;
        const newAttributes = newElement.attributes;


        Array.from(attributes).forEach(attribute => {
          element.removeAttribute(attribute.name);
        });

        Array.from(newAttributes).forEach(attribute => {
          element.setAttribute(attribute.name, attribute.value);
        });
      }
    });
  }
}

export default View;
