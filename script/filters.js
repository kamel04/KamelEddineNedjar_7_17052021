import state from "./state.js";
import { completeSearch } from "./search.js";
import { createGenericElt, createLinkElt, normalizeText } from "./utils.js";
import { createAllLabels } from "./labels.js";

// Variables du DOM
const overlayElt = document.getElementById("overlay");
const ingFiltersListElt = document.getElementById("ing-filter-list");
const appFiltersListElt = document.getElementById("app-filter-list");
const ustFiltersListElt = document.getElementById("ust-filter-list");
const ingBtnElt = document.getElementById("ing-btn");
const appBtnElt = document.getElementById("app-btn");
const ustBtnElt = document.getElementById("ust-btn");
const ingInputElt = document.getElementById("ing-input");
const appInputElt = document.getElementById("app-input");
const ustInputElt = document.getElementById("ust-input");

// Créer un élement de filtre
// Paramètre {string} type ing ou app ou ust
// return {node}
const createFilterElt = (type, name) => {
  const liElt = createGenericElt("li");
  const aElt = createLinkElt("/", name, "filter-tag");
  liElt.appendChild(aElt);
  liElt.addEventListener("click", addFilter(type, name));

  return liElt;
};

// Ajouter un filtre au clique
const addFilter = (type, name) => {
  return function (evt) {
    evt.preventDefault();
    const formattedName = normalizeText(name);

    if (type === "ing") {
      if (!state.ingLabels.includes(formattedName)) state.ingLabels.push(formattedName);
    }
    if (type === "app") {
      if (!state.appLabels.includes(formattedName)) state.appLabels.push(formattedName);
    }
    if (type === "ust") {
      if (!state.ustLabels.includes(formattedName)) state.ustLabels.push(formattedName);
    }

    putFiltersToInitialState();
    createAllLabels();
    completeSearch();
  };
};

// Créer la liste des éléments du filtre
// {array} liste des filtres à afficher
// return {node}
const createFiltersList = (listElt, list) => {
  listElt.innerHTML = "";
  list.forEach((elt) => {
    const liElt = createFilterElt(elt.type, elt.name);
    listElt.appendChild(liElt);
  });
};

// Remplir la liste des filtres avec les données
const fillAllFilterLists = () => {
  createFiltersList(ingFiltersListElt, state.displayedIng);
  //onsole.log(state.displayedIng);
  createFiltersList(appFiltersListElt, state.displayedApp);
  createFiltersList(ustFiltersListElt, state.displayedUst);
};

// Afficher les filtres initiaux
const initializeFilters = () => {
  fillAllFilterLists();
  ingBtnElt.addEventListener("click", toggleFilterList);
  appBtnElt.addEventListener("click", toggleFilterList);
  ustBtnElt.addEventListener("click", toggleFilterList);
  overlayElt.addEventListener("click", putFiltersToInitialState);

  ingInputElt.addEventListener("focus", scaleFilterUp);
  appInputElt.addEventListener("focus", scaleFilterUp);
  ustInputElt.addEventListener("focus", scaleFilterUp);

  ingInputElt.addEventListener("input", manageCompletion);
  appInputElt.addEventListener("input", manageCompletion);
  ustInputElt.addEventListener("input", manageCompletion);
};

// Gerer le toggle de la liste des filtres
const toggleFilterList = (evt) => {
  evt.preventDefault();
  if (evt.target.tagName !== "SPAN") return;

  if (evt.target.className === "fas fa-chevron-down") {
    scaleFilterUp(evt);
  } else {
    closeAllFilterLists();
    scaleAllFiltersDown();
  }
};

// Fermer tous les filtres
const closeAllFilterLists = () => {
  overlayElt.style.display = "none";

  ingFiltersListElt.parentNode.classList.remove("open");
  appFiltersListElt.parentNode.classList.remove("open");
  ustFiltersListElt.parentNode.classList.remove("open");

  ingBtnElt.className = "fas fa-chevron-down";
  appBtnElt.className = "fas fa-chevron-down";
  ustBtnElt.className = "fas fa-chevron-down";

  removeFilterInputsValue();
  resetTagsDisplay();
};

// Déployer l'input du filtre
const scaleFilterUp = (evt) => {
  evt.preventDefault();
  scaleAllFiltersDown();
  const parentElt = evt.target.parentNode;
  const parentEltId = parentElt.id;
  const elt = document.querySelector(`#${parentEltId} div`);
  const buttonId = document.querySelector(`#${parentEltId} span`);
  parentElt.className += " scaled";
  openFilterList(elt, buttonId.id);
};

// Ouvrir la liste des filtres
const openFilterList = (elt, buttonId) => {
  closeAllFilterLists();
  elt.className += " open";
  const buttonElt = document.getElementById(buttonId);
  buttonElt.className = "fas fa-chevron-up";
  overlayElt.style.display = "block";
};

// Réduire l'input du filtre
const scaleAllFiltersDown = () => {
  const filtersElts = document.querySelectorAll(".filters-elt");
  filtersElts.forEach((elt) => elt.classList.remove("scaled"));
};

// Fermer et réduire tous les filtres
const putFiltersToInitialState = () => {
  closeAllFilterLists();
  scaleAllFiltersDown();
};

// Obtenir la liste des filtres affichés
// type  ing, app ou ust  return {array}
const getVisibleFilters = (type) => {
  const listNodes = document.querySelectorAll(`#${type}-filter-list li a`);
  const listContentArray = Array.from(listNodes).map((elt) => elt.textContent.toLowerCase());
  return listContentArray;
};

// Effacer les filtres du DOM
const clearAllFilters = () => {
  ingFiltersListElt.innerHTML = "";
  appFiltersListElt.innerHTML = "";
  ustFiltersListElt.innerHTML = "";
};

// Obtenez le nombre de filtres ajoutés (ing + app + ust)
const getAllFiltersLength = () => {
  const fullTagArray = state.ingLabels.concat(state.appLabels).concat(state.ustLabels);

  return fullTagArray.length;
};

// Supprimer la valeur des l'inputs des filtres
const removeFilterInputsValue = () => {
  ingInputElt.value = "";
  appInputElt.value = "";
  ustInputElt.value = "";
};

// Autocompletion des saisis dans les filtres
const manageCompletion = (evt) => {
  const idTarget = evt.target.parentNode.id;
  const formattedValue = normalizeText(evt.target.value);
  const allTags = document.querySelectorAll(`#${idTarget} li a`);

  allTags.forEach((tag) => {
    if (!tag.textContent.includes(formattedValue)) {
      tag.parentNode.style.display = "none";
    } else tag.parentNode.style.display = "block";
  });
};

// Afficher tous les tags dans le DOM
const resetTagsDisplay = () => {
  const allIngTags = document.querySelectorAll(`#ing-filtre-list li`);
  const allAppTags = document.querySelectorAll(`#app-filter-list li`);
  const allUstTags = document.querySelectorAll(`#ust-filter-list li`);

  allIngTags.forEach((ing) => (ing.style.display = "block"));
  allAppTags.forEach((app) => (app.style.display = "block"));
  allUstTags.forEach((ust) => (ust.style.display = "block"));
};

export {
  initializeFilters,
  getVisibleFilters,
  createFilterElt,
  clearAllFilters,
  getAllFiltersLength,
};
