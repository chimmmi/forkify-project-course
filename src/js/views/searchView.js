class SearchView {
    _parentEl = document.querySelector('.search');
    getQuery() {
        const query = this._parentEl.querySelector('.search__field').value;
        this._clearInput(); // Clearing the search field after the user submitting.
        return query;
    }
    _clearInput(){
        this._parentEl.querySelector('.search__field').value = '';
    }
    addHandlerSearch(handler) { //Publisher
        this._parentEl.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        })
    }
}

export default new SearchView();