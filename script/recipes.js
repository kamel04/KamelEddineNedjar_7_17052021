import data from "./data.js";
import { createGenericElt, createLinkElt } from "./utils.js";

// Variables DOM
const mainContentElt = document.getElementById("main-content");

// Créer une recette
// return {node} de l'élement créé
const createRecipeElement = (recipe) => {
  const elt = createGenericElt("article", "recipe");
  elt.id = recipe.id;
  const aElt = createLinkElt("index.html", recipe.name);
  aElt.textContent = "";
  const imgElt = createGenericElt("div", "recipe-img");
  const dataElt = createGenericElt("div", "recipe-data");
  const headerElt = createGenericElt("header");
  const h2Elt = createGenericElt("h2");
  const timeElt = createGenericElt("div", "recipe-time");
  const categoryLeftElt = createGenericElt("div", "recipe-category");
  const categoryRightElt = createGenericElt("div", "recipe-category");

  const ulElt = createGenericElt("ul");
  recipe.ingredients.forEach((ingrediant) => {
    const liElt = createIngredient(ingrediant);
    ulElt.appendChild(liElt);
  });

  h2Elt.textContent = recipe.name;
  timeElt.innerHTML = `<span class="far fa-clock"></span> ${recipe.time} min`;
  categoryRightElt.textContent = recipe.description;

  headerElt.appendChild(h2Elt);
  headerElt.appendChild(timeElt);
  categoryLeftElt.appendChild(ulElt);
  dataElt.appendChild(headerElt);
  dataElt.appendChild(categoryLeftElt);
  dataElt.appendChild(categoryRightElt);
  aElt.appendChild(imgElt);
  aElt.appendChild(dataElt);
  elt.appendChild(aElt);

  return elt;
};

// Créer un ingrédient
// return {node} de l'ingrédient créé
const createIngredient = (ingredient) => {
  const liElt = document.createElement("li");
  liElt.innerHTML = `<strong>${ingredient.ingredient}`;
  liElt.innerHTML += ingredient.quantity ? `: </strong><span>${ingredient.quantity}` : `</strong>`;
  liElt.innerHTML += ingredient.unit ? `${ingredient.unit}</span>` : `</span>`;

  return liElt;
};

// Construire et réinitialiser toutes les recettes
const initializeRecipes = () => {
  mainContentElt.innerHTML = "";
  data.recipes.forEach((recipe) => {
    const recipeElt = createRecipeElement(recipe);
    recipeElt.style.display = "block";
    mainContentElt.appendChild(recipeElt);
  });
};

// Afficher toutes les recettes dans le DOM
const displayAllRecipes = () => {
  data.recipes.forEach((recipe) => {
    const recipeToDisplay = document.getElementById(recipe.id);
    recipeToDisplay.style.display = "block";
  });
};

export { initializeRecipes, displayAllRecipes };
