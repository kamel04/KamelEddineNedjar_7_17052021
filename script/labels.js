import state from "./state.js";
import { completeSearch } from "./search.js";
import { createGenericElt, normalizeText } from "./utils.js";

// Variable
const labelsElt = document.getElementById("labels");

// Créer un element label
// paramètre le type (ing, app, ust) et le nom
// return {node}
const createLabels = (type, name) => {
  const elt = createGenericElt("button", `label ${type}`);
  elt.setAttribute("type", "button");
  const iconElt = createGenericElt("span", "fas fa-times-circle");
  iconElt.addEventListener("click", removeFilter(type, name));
  elt.textContent = name;
  elt.appendChild(iconElt);

  return elt;
};

// Créer les labels de tous les types
const createAllLabels = () => {
  labelsElt.innerHTML = "";
  labelsElt.appendChild(createLabels(state.ingLabels, "ing"));
  labelsElt.appendChild(createLabels(state.appLabels, "app"));
  labelsElt.appendChild(createLabels(state.ustLabels, "ust"));
};

// Supprimer un label
const removeFilter = (type, name) => {
  return function (evt) {
    evt.preventDefault();
    const formattedName = normalizeText(name);

    if (type === "ing") {
      state.ingLabels = state.ingLabels.filter((elt) => formattedName !== elt);
    }
    if (type === "app") {
      state.appLabels = state.appLabels.filter((elt) => formattedName !== elt);
    }
    if (type === "ust") {
      state.ustLabels = state.ustLabels.filter((elt) => formattedName !== elt);
    }
    createAllLabels();
    completeSearch();
  };
};

export { createAllLabels };
