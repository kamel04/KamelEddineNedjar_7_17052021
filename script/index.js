import { initializeState } from "./datalogic.js";
import { initializeFilters } from "./filters.js";
import { initializeRecipes } from "./recipes.js";
import { manageSearchInput } from "./search.js";

// initialiser les données
initializeState();
initializeFilters();
initializeRecipes();

// écouter la saisi de la barre de recherche
const searchBarElt = document.getElementById("search-bar");
searchBarElt.addEventListener("input", manageSearchInput);
