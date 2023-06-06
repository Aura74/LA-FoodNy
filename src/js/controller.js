import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0 update results view to mark selecter search results
    resultsView.update(model.getSearchReasultsPage());

    //3, uppdaterar booksmarks view
    bookmarksView.update(model.state.bookmarks);

    // 1 laddar recepo
    await model.loadRecipe(id);

    // 2 renerar reept
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controllSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1, get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2, laddar search result
    await model.loadSearchResults(query);

    // 3, renerar reept
    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchReasultsPage());

    // 4, laddar Padination knappar
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1, renderar nytt resultat
  resultsView.render(model.getSearchReasultsPage(goToPage));

  // 2, laddar NYA Padination knappar
  paginationView.render(model.state.search);
};

// är eventhandlers
const controlServings = function (newServings) {
  // update receptet serving (in state)
  model.updateServings(newServings);

  // Uppdatera recept vyn
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1, add or remove
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2, Uppdaterar reept vy
  recipeView.update(model.state.recipe);

  // 3, renderar bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // spinner
    addRecipeView.renderSpinner();

    //addRecipeView.render();
    await model.uploadRecipe(newRecipe);

    // render rec view
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // render boobkmarks view
    bookmarksView.render(model.state.bookmarks);

    // change ID in url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    // close form widow
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error("😎", err);
    addRecipeView.renderError(err.message);
  }
  // upload ny data
  model.uploadRecipe(newRecipe);
};

const init = function () {
  recipeView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandllerSearch(controllSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
