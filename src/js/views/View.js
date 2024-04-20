import icons from 'url:../../img/icons.svg';

export default class View {
    _data;

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data  The data to be rendered (e.g. recipe); 
     * @param {boolean} [render=true] if false, create markup string instead of rendering to the DOM
     * @returns {undefined | String} A markup string is returned if render=false
     * @this {Object} View instance
     * @author Chime Tsegon
     * @todo Finish implementation 
     */

    render(data, render = true) { // ! this data was sent from the model.js to controller.js = "recipeView.render(model.state.recipe)"";
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError(); // If there is no data, or there is a data but with an empty array, return an error message.

        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup;
        
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {

      this._data = data;
      const newMarkup = this._generateMarkup();

      const newDom = document.createRange().createContextualFragment(newMarkup); // This will create a new HTML fragment using the 'createContextualFragment()' method of the "Range" object in the DOM. The method takes a string of HTML markupt ('newMarkup') as input, and returns a DocumentFragment obejct that represents the HTML content parsed from the string.
      // It allows to dynamically create HTML content from a string of markup, which can then be manipulated and inserted into the DOM. 

      const newElements = Array.from(newDom.querySelectorAll('*'));

      const curElements = Array.from(this._parentElement.querySelectorAll('*'));
      console.log(newElements, curElements);
      // console.log(newElements);

      newElements.forEach((newEl, i) => {
        const curEl = curElements[i];
        // console.log(curEl, newEl.isEqualNode(curEl));
        // isEqualNode() method tests whether they have same type, defining characteristics(for elements, this would be their ID, number of children, and so forth), its attributes match ,and so on

        // Updates hanged TEXT:
        if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
          // nodeValue -> a string containing the value fo the current node, if any. For the docuement itself the nodeValue retursn null. For text, comment, and CDATA nodes, nodeValue returns the content of the node. For attriute nodes, the value of the attribute is returned.
          // console.log(newEl.firstChild.nodeValue.trim())
          curEl.textContent = newEl.textContent;
        }

        // Updates changed ATTRIBUTES:
        if(!newEl.isEqualNode(curEl)) {
          // console.log(newEl.attributes);
          // attributes returns a live collection of all attribute nodes registered to the specified node.
          Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value))
        }
      })
  }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    
    renderSpinner() {
        const markup = `
          <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `
        this._clear(); // * Clearing the parent element
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
      };

    renderError(message = this._errorMessage) {
      const markup = `
          <div class="error">
          <div>
            <svg>
              <use href="src/img/${icons}svg#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `
      this._clear(); // * Clearing the parent element
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderMessage(message = this._message) {
      const markup = `
          <div class="message">
          <div>
            <svg>
              <use href="src/img/${icons}svg#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
      `
      this._clear(); // * Clearing the parent element
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}