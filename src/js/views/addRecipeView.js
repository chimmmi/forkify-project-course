import icons from 'url:../../img/icons.svg';
import View from './View';

class AddRecipeView extends View{
    _parentElement = document.querySelector('.upload');
    _message = 'Recipe was successfully uploaded';
    
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super(); // calls the constructor of its parent class to access the parent's properties and methods. 
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }
    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));

    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            const dataArr = [...new FormData(this)]; // new FormData() is a js constructor function that creates a new FormData object. The FormData object is primarily used to handle data form HTML forms and allows you to easily construct and asend ata to the server via AJAX or fetch requests. Using the spread operator to convert into array to be able to handle the 'form' values.
            const data = Object.fromEntries(dataArr); // Takes an array of entries and convert into object
            handler(data);
        })
    }

    _generateMarkup() {
      
    }
};

export default new AddRecipeView();