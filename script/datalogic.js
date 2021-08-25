import data from "./data.js";
import state from "./state.js";
import { normalizeText } from "./utils.js";

// Obtenir la liste des ID des recettes
// return {array} avec la liste des ID
const getAllRecipeIds = () => {
  return data.recipes.map((elt) => elt.id);
};

// Obtenir la liste de tous les ingrédients pour toutes les recettes
// return {array} avec la liste des ingrédients
const getAllIngredients = () => {
  let ingredients = [];
  data.recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      if (!ingredients.includes(ing.ingredient.toLowerCase()))
        ingredients.push(ing.ingredient.toLowerCase());
    });
  });

  return ingredients.map((ing) => ({
    type: "ing",
    name: ing,
  }));
};

// Obtenir la liste de tous les appareils de toutes les recettes
// return {array} avec la liste des appareils
const getAllAppliances = () => {
  let appliances = [];
  data.recipes.forEach((recipe) => {
    if (!appliances.includes(recipe.appliance.toLowerCase())) {
      appliances.push(recipe.appliance.toLowerCase());
    }
  });
  return appliances.map((app) => ({
    type: "app",
    name: app,
  }));
};

// Obtenir la liste de tous les ustensiles de toutes les recettes
// return {array} avec la liste des ustensiles
const getAllUstensils = () => {
  let ustensils = [];
  data.recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      if (!ustensils.includes(ustensil.toLowerCase())) ustensils.push(ustensil.toLowerCase());
    });
  });
  return ustensils.map((ust) => ({
    type: "ust",
    name: ust,
  }));
};

// Obtenir une chaîne unique avec tous les ingrédients d'une recette
// return {string}
const getIngredientsStringFromRecipe = (recipe) => {
  let ingredientsString = "";
  recipe.ingredients.forEach((ing) => {
    ingredientsString += `${normalizeText(ing.ingredient)}`;
  });
  return ingredientsString;
};

// Obtenir la liste de tous les ingredients de toutes les recettes
// paramètre tableau tagList
// return {object}
const createTagObject = (tagList) => {
  let tagObj = {};
  tagList.forEach((tag) => (tagObj[normalizeText(tag.name)] = []));

  return tagObj;
};

// Obtenir un objet avec le nom de tous les ingredients
// return {object}
const getIngredientsObject = () => {
  let ingredientsObject = createTagObject(getAllIngredients());
  data.recipes.forEach((recipe) => {
    recipe.ingredients.forEach((elt) => {
      const objKey = normalizeText(elt.ingredient);
      ingredientsObject[objKey].push(recipe.id);
    });
  });

  return ingredientsObject;
};

// Obtenir un objet avec le nom de tous les appareils
// return {object}
const getAppliancesObject = () => {
  let appliancesObject = createTagObject(getAllAppliances());

  data.recipes.forEach((recipe) => {
    const objKey = normalizeText(recipe.appliance);
    appliancesObject[objKey].push(recipe.id);
  });

  return appliancesObject;
};

// Obtenir un objet avec le nom de tous les ustensils
// return {object}
const getUstensilsObject = () => {
  let ustensilesObject = createTagObject(getAllUstensils());

  data.recipes.forEach((recipe) => {
    recipe.ustensils.forEach((elt) => {
      const objKey = normalizeText(elt);
      ustensilesObject[objKey].push(recipe.id);
    });
  });

  return ustensilesObject;
};

// Obtenez des données de recette complètes à partir des identifiants
// return {array}
const getFullRecipesFromIds = (idsArray) => {
  return data.recipes.filter((recipe) => idsArray.includes(recipe.id));
};

// initialiser les données
const initializeState = () => {
  state.displayedIng = getAllIngredients();
  state.displayedApp = getAllAppliances();
  state.displayedUst = getAllUstensils();
  state.displayedRecipes = getAllRecipeIds();
  state.ingObj = getIngredientsObject();
  state.appObj = getAppliancesObject();
  state.ustObj = getUstensilsObject();
};

export { initializeState, getIngredientsStringFromRecipe, getFullRecipesFromIds, getAllRecipeIds };
