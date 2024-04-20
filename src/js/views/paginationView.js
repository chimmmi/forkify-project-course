import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View{
    _parentElement = document.querySelector('.pagination');
    
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline') // Looking for the parent element to select specific the button
            
            if(!btn) return;

            const goToPage = +btn.dataset.goto;

            // console.log(goToPage);
            // console.log(handler);
            handler(goToPage);
            // handler = 'controlPagination(goToPage)'
        })
    }
    _buttonNext(curPage, totalPages) {
        return `
            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }
    _buttonPrev(curPage, totalPages) {
        return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>
        `; 
    }
 
    _buttonPair(curPage) {
        return `
            <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
        </button>

            <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
            
        `; 
    }
    _generateMarkup() {
        const curPage = this._data.page;
        const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        // console.log(numPages);

        // Page 1, and there are other pages
        if(curPage === 1 && numPages > 1) {
            return this._buttonNext(curPage);
        }

        
        // Last Page
        if(curPage === numPages) {
            return this._buttonPrev(curPage);
        }
        
        // Other page
        if(curPage < numPages) {
            return this._buttonPair(curPage);
        }

        // Page 1, and there are NO other pages
        return ' ';
    }
};

export default new PaginationView();