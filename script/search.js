import data from "./data.js";
import state from "./state.js";
import {
  getIngredientsStringFromRecipe,
  getFullRecipesFromIds,
  getAllRecipeIds,
} from "./datalogic.js";
import { normalizeText } from "./utils.js";
import {
  getVisibleFilters,
  createFilterElt,
  clearAllFilters,
  getAllFiltersLength,
} from "./filters.js";
import { displayAllRecipes } from "./recipes.js";

// Condition Algo de recherche
const manageSearchInput = (evt) => {
  evt.preventDefault();
  state.currentSearch = evt.target.value;
  completeSearch();
};

////////////////////////////////  Algo V1
// Rechercher les recettes à partir du champ de recherche

const searchByInput = () => {
  const value = state.currentSearch;
  state.displayedRecipes = [];

  if (value.length > 2) {
    let t0 = performance.now();
    return data.recipes.forEach((recipe) => {
      const recipeToDisplay = document.getElementById(recipe.id);
      const normaliezedText = normalizeText(value);
      if (
        normalizeText(recipe.name).includes(normaliezedText) ||
        normalizeText(recipe.description).includes(normaliezedText) ||
        getIngredientsStringFromRecipe(recipe).includes(normaliezedText)
      ) {
        recipeToDisplay.style.display = "block";
        let t1 = performance.now();
        state.displayedRecipes.push(recipe.id);
        return console.log(t1 - t0 + " milliseconds");
      }
      return (recipeToDisplay.style.display = "none"); //
    });
  }
  return data.recipes.forEach((recipe) => {
    const recipeToDisplay = document.getElementById(recipe.id);
    recipeToDisplay.style.display = "block";
  });
};
////////////////////////////////

// rechercher les recettes depuis les filtres
const searchByTag = () => {
  // affectation de plusieurs variables à la fois depuis objet
  const {
    ingLabels,
    appLabels,
    ustLabels,
    displayedRecipes,
    ingObj,
    appObj,
    ustObj,
    currentSearch,
  } = state;

  let arrayOfRecipes = displayedRecipes;

  if (currentSearch.length < 3 && getAllFiltersLength() > 0) {
    arrayOfRecipes = getAllRecipeIds();
    displayAllRecipes();
  }

  arrayOfRecipes.forEach((idRecipe) => {
    const displayedRecipe = document.getElementById(idRecipe);

    ingLabels.forEach((ing) => {
      if (!ingObj[ing].includes(idRecipe)) displayedRecipe.style.display = "none";
    });

    appLabels.forEach((app) => {
      if (!appObj[app].includes(idRecipe)) displayedRecipe.style.display = "none";
    });

    ustLabels.forEach((ust) => {
      if (!ustObj[ust].includes(idRecipe)) displayedRecipe.style.display = "none";
    });
  });
};

// Afficher les filtres depuis les recettes affichées
const displayRemainingTags = () => {
  let recipesToConsider = [];

  if (state.currentSearch.length < 3 && getAllFiltersLength() === 0) {
    recipesToConsider = data.recipes;
  } else {
    const allRecipes = document.querySelectorAll("#main-content article");
    const visibleRecipesIds = Array.from(allRecipes)
      .filter((elt) => elt.style.display === "block")
      .map((elt) => parseInt(elt.id));
    recipesToConsider = getFullRecipesFromIds(visibleRecipesIds);
  }

  clearAllFilters();
  recipesToConsider.forEach((recipe) => displayFiltersFromRecipes(recipe));
};

// Afficher tous les filtres inclus dans les recettes affichées
const displayFiltersFromRecipes = (recipe) => {
  displayIngredientsFromRecipe(recipe);
  displayAppliancesFromRecipe(recipe);
  displayUstensilsFromRecipe(recipe);
};

// Afficher les filtres d'ingrédients inclus dans les recettes affichées
const displayIngredientsFromRecipe = (recipe) => {
  const ingListElt = document.getElementById("ing-filter-list");
  const visibleIngFilters = getVisibleFilters("ing");

  recipe.ingredients.forEach((ing) => {
    if (!visibleIngFilters.includes(ing.ingredient.toLowerCase()))
      ingListElt.appendChild(createFilterElt("ing", ing.ingredient.toLowerCase()));
  });
};

// Afficher les filtres de l'appareil inclus dans les recettes affichées
const displayAppliancesFromRecipe = (recipe) => {
  const appListElt = document.getElementById("app-filter-list");
  const visibleAppFilters = getVisibleFilters("app");

  if (!visibleAppFilters.includes(recipe.appliance.toLowerCase()))
    appListElt.appendChild(createFilterElt("app", recipe.appliance.toLowerCase()));
};

//  Afficher les filtres des ustensiles inclus dans les recettes affichées
const displayUstensilsFromRecipe = (recipe) => {
  const ustListElt = document.getElementById("ust-filter-list");
  const visibleUstFilters = getVisibleFilters("ust");

  recipe.ustensils.forEach((ust) => {
    if (!visibleUstFilters.includes(ust.toLowerCase()))
      ustListElt.appendChild(createFilterElt("ust", ust.toLowerCase()));
  });
};

// Afficher "aucun résultat" si aucune recette n'est affichée
const checkSearchResults = () => {
  const allRecipes = document.querySelectorAll("#main-content article");
  const mainContentElt = document.getElementById("result");
  const hiddenRecipes = Array.from(allRecipes).filter((elt) => elt.style.display === "none");

  if (hiddenRecipes.length === 50) {
    mainContentElt.textContent = "Aucune recette ne correspond à votre recherche...";
  } else {
    mainContentElt.textContent = "";
  }
};

// Recherche complète
const completeSearch = () => {
  searchByInput();
  searchByTag();
  displayRemainingTags();
  checkSearchResults();
};

export { manageSearchInput, completeSearch };
