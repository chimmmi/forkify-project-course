import * as model from './model.js'; //Importing everything from the 'model' module.
import {MODAL_CLOSE_SEC} from './config.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';


// ! Polifyiling the code in order to run in older browsers.
import 'core-js/stable';
import 'regenerator-runtime/runtime.js'; // ! needed for async/await systax to work properly especially in envrionments that don't support it out of the box.
import { async } from 'regenerator-runtime'; 

// if (!module.hot) {
  //   module.hot.accept();
  // }
  ///////////////////////////////////////
  
  const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1); //This line will extract the hash portion of the URL and removes the '#' character using the slice method.
    //  console.log(id);
    
    if(!id) return; // If doesn't exists, it will return immediately and won't continue executing further. It is a 'guard clause'
    recipeView.renderSpinner(); //Calling method from the 'recipeView' module.
    
    // todo: Update results view to current selected each result:
    resultsView.update(model.getSearchResultsPage());

    // todo: Updating bookmarks view:
    bookmarksView.update(model.state.bookmarks)
    
    // todo: Loading recipe:
    await model.loadRecipe(id); // Awaiting the promis returned by the loadRecipe method.
    
    
    // todo: Rendering the recipe:
    recipeView.render(model.state.recipe); // Once the recipe data is loaded successfully, this line call 'render' method of the recipeView class, which passes the recipe data.
    
    
    
  } catch (err) {
    recipeView.renderError();
  }
}
controlRecipes();

const controlSearchResults = async function(){
  try {
    // ! Getting the search query:
    const query = searchView.getQuery();
    
    if(!query) return;
    
    // ! Loading search results:
    resultsView.renderSpinner();
    
    await model.loadSearchResults(query);
    
    
    // ! Rendering search results:
    // console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    
    // ! Render initial pagination buttons
    // console.log(paginationView);
    // console.log('hi')

    paginationView.render(model.state.search, model.state.search.resultsPerPage.length);
    // console.log(model.state.search.);
    
    
    
  } catch(err){
    console.log(err);
  }
};

const controlPagination = function(goToPage) {
  // Rendering new results:
  console.log(goToPage);
  resultsView.render(model.getSearchResultsPage(goToPage));
  
  // Rendering new pagination buttons:
  
  paginationView.render(model.state.search);
}
const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  // 1) Add/remove bookmark:
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
     model.deleteBookmark(model.state.recipe.id);
  }

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks)
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks)
}


const controlAddRecipe = async function(newRecipe) {
  try{
    // console.log(newRecipe);

    //Show loading spinner:
    addRecipeView.renderSpinner()

    //Upload the new recipe data:
    await model.uploadRecipe(newRecipe);

    //Render new recipe data:
    recipeView.render(model.state.recipe);

    //Success message:
    addRecipeView.renderMessage();

    //Render bookmark view:
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL:
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // This method is used to monitor aleterations to the history of the browser. We can add a record to the web browser's session history stack.
    

    //Close form window:
    setTimeout(function(){
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000)
  } catch(err) {
    console.error(':/');
    addRecipeView.renderError(err.message);
  }

}

const init = function() { 
  bookmarksView.addHandlerRender(controlBookmarks); // Subscriber
  recipeView.addHandlerRender(controlRecipes); // Subscriber -> Handling the event that will be listened in 'recipeView.js' model.
  recipeView.addHandlerUpdateServings(controlServings); // Subscriber
  recipeView.addHandlerAddBookmark(controlAddBookmark); // Subscriber
  searchView.addHandlerSearch(controlSearchResults); //Subscriber
  paginationView.addHandlerClick(controlPagination); //Subscriber
  addRecipeView.addHandlerUpload(controlAddRecipe); // Subscriber
} 
init()