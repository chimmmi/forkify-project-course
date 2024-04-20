import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import { search } from 'core-js/./es/symbol';
import { create } from 'core-js/./es/object';


export const state = {
    recipe: {},
    search: {
      query: '',
      results: [],
      page: 1,
      resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
}
const createRecipeObject = function(data) {
  const {recipe} = data.data; // * destructuring the data received from the API, more organized;

  return  { //Passing the data received from the API to the 'state' object;
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && {key: recipe.key}), // '&&' -> short circuits. If 'recipe.key' is a falsy value, then nothing happens. If it is some value, true, it will return the object and spread it -> 'key: recipe'
  };
}


// These functions will not return anything. Instead, it will change the state object which contains the recipe.

export const loadRecipe = async function (id){
  try  {
    const data = await AJAX(`${API_URL}${id}`); // Getting the API URL and storing into 'data';
    state.recipe = createRecipeObject(data);

    if(state.bookmarks.some(bookmark => bookmark.id === id)){
      // some() tests whether at least one element in the aray passes the test implemented by the provided function. It returns true if, in the array, it finds an element for which the provided function returns treu; otherwise it returns false. It doesnt modify the array.
      // In this case, it will check if any of the bookmarks have an 'id' proerty equal to the value stored in the variable 'id'
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }

    console.log(state.recipe);
  } catch(err){
    //Temp error handling
    console.error(`${err}`);
    throw err;
  }
};

export const loadSearchResults = async function(query) {
  try{
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && {key: rec.key}),
      }
    })
    console.log()
    state.search.page = 1;
  } catch(err) {
    console.error(`${err}`);
    throw err;
  }
};

export const getSearchResultsPage = function(page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end)
}

export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe) {
  // Add bookmark:
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks()
};

export const deleteBookmark = function(id) {

  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  // findIndex() method will return the index of the first element in an array that satisfies the provided testing function.
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if(id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function() {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}

init();
console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe));
  try{

    const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '').map(ing => {
      // const ingArr = ing[1].replaceAll(' ', '').split(',');
      const ingArr = ing[1].split(',').map(el => el.trim())
      const [quantity, unit, description] = ingArr;
      if(ingArr.length !== 3) throw new Error('wrong ingredient format! Please use the correctformat :)');
      
      return {quantity: quantity ? +quantity : null, unit, description};
    })
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    }
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch(err) {
    throw err;
  }

}