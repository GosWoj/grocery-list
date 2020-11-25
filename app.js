//SELECT ITEMS
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//Edit option
let editElement;
let editFlag = false;
let editID = "";

//FUNCTIONS
const addItem = (e) => {
  e.preventDefault();
  const value = grocery.value;
  //Getting unique id
  //TODO: change the way ID is set
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    createListItem(id, value);

    //Display alert
    displayAlert("Item was added to the list", "success");

    //Show container
    container.classList.add("show-container");

    //Add to local storage
    addToLocalStorage(id, value);

    //Set back to default
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Value was changed", "success");
    editLocalStorage(editID, value);
    setBackToDefault();

    //Empty value
  } else {
    displayAlert("Enter item name", "danger");
  }
};

//Edit function
const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;

  //Set edit item
  //Accessing title
  editElement = e.currentTarget.parentElement.previousElementSibling;

  //Set form value
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "Edit";
};

//Delete function
const deleteItem = (e) => {
  //Grabbing grocery item
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;
  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }

  displayAlert("Item was removed", "danger");
  setBackToDefault();

  //Remove from local storage
  removeFromLocalStorage(id);
};

//Display alert
const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  //Remove alert
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

//Set back to default
const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "Add";
};

//Clear items
const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }

  container.classList.remove("show-container");
  displayAlert("List has been cleared", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
};

//Create list items
const createListItem = (id, value) => {
  const element = document.createElement("article");

  //Add class
  element.classList.add("grocery-item");

  //Add id
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);

  element.innerHTML = `<p class="title">${value}</p>
   <div class="btn-container">
     <button type="button" class="edit-btn">
       <i class="fas fa-edit"></i>
     </button>
     <button type="button" class="delete-btn">
       <i class="fas fa-trash"></i>
     </button>
   </div>`;

  const editBtn = element.querySelector(".edit-btn");
  const deleteBtn = element.querySelector(".delete-btn");

  editBtn.addEventListener("click", editItem);
  deleteBtn.addEventListener("click", deleteItem);

  //Append child
  list.appendChild(element);
};

//SETUP ITEMS
const setupItems = () => {
  let items = getLocalStorage();

  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
};

//EVENT LISTENERS
//Submit form
form.addEventListener("submit", addItem);

//Clear items
clearBtn.addEventListener("click", clearItems);

//Load items
window.addEventListener("DOMContentLoaded", setupItems);

//LOCAL STORAGE
const addToLocalStorage = (id, value) => {
  const grocery = {
    id: id,
    value: value,
  };

  let items = getLocalStorage();

  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
};

const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();

  items = items.filter((item) => {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStorage = (id, value) => {
  let items = getLocalStorage();

  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
};

const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
