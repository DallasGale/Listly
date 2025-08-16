"use strict";
// import { getDocument } from "ssr-window";
import Item from "./item.js";
/**
 * A lightweight class for creating dynamic lists from HTML forms
 * @class
 * @example
 * import quick-list from "qwk-list";
 * const container = document.querySelector("#container")
 * const form = document.querySelector("#form")
 * const myList = new quick-list(container, form, "groceries")
 * myList.init()
 */
class QuickList {
  /**
   * @param {string} _formEl
   * @param {HTMLElement} _containerEl
   * @param {Object} params
   * @param {Object} params.options
   * @param {string} params.options.listName
   * @param {"ol" | "ul"} params.options.listType
   * @param {boolean} params.options.hasHeader
   * @param {boolean} params.options.showMarker
   * @throws {Error} When container or form is not a valid DOM element.
   */
  constructor(...args) {
    let formEl;
    let containerEl;
    let params;

    [formEl, containerEl, params] = args;
    if (!params) params = {};

    if (formEl && !params.formEl) params.formEl = formEl;
    if (containerEl && !params.containerEl) params.containerEl = containerEl;

    // This needs to be accessed inside the render() method
    this.containerEl = containerEl;
    this.params = params;

    // Local mutating variables
    this.headerLabels = [];
    this.allItems = [];
    this.itemId = 0;

    // Options Params...
    this.hasHeader = params.options.hasHeader || false;
    this.listType = params.options.listType || "ol";
    this.listId = params.options.listId;
    this.showMarker = params.options.showMarker || false;

    // Element ClassNames
    this.removeItemButtonClass = "qwk-button--remove-item";
    this.editItemButtonClass = "qwk-button--edit-item";
    this.updateItemButtonClass = "qwk-button--update-item";
    this.submitListButtonClass = "qwk-button--submit-list";
    this.listClass = `qwk-list--${this.listType}`;

    // Check for valid form and container elements
    if (
      params.formEl
      && params.containerEl
      && typeof params.formEl === "string"
      && typeof params.containerEl === "string"
      && document.querySelector(params.formEl)
      && document.querySelector(params.containerEl)
    ) {
      // console.log("formEl, containerEl are valide");

      // Form Element
      let form = document.querySelector(params.formEl);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addItem(e);
      });

      // Listeners for action click
      const containerElement = document.querySelector(params.containerEl);
      containerElement.addEventListener("click", (e) => {
        console.log(e.target);
        // Remove
        if (e.target.classList.contains(this.removeItemButtonClass)) {
          const itemId = e.target.dataset.id;
          this.removeItem(itemId);
        }

        // Edit
        if (e.target.classList.contains(this.editItemButtonClass)) {
          const itemId = e.target.dataset.id;
          this.editItem(itemId);
        }

        // Submit List
        if (e.target.classList.contains(this.submitListButtonClass)) {
          this.submitList();
        }
      });
    }
  }

  /**
   * a method that pushes an item to an arroy of items.
   * @param {EventTarget} target
   */
  addItem(event) {
    let types = [];
    let labels = [];
    let inputData = [];

    // Adding input data
    const inputs = event.target.querySelectorAll("input");
    inputs.forEach((input) => {
      console.log({input});
      labels.push(input.dataset.qwkInputLabel);
      inputData.push({
        attrs: input.attributes,
        name: input.name,
        dataset: input.dataset,
        id: input.id,
        type: input.type,
        value: input.value,
      });
    });
    this.headerLabels = labels;
    this.inputTypes = types;

    // Line items: 
    // const formData = new FormData(event.target);
    const item = new Item(this.itemId, [...inputData]);

    this.allItems.push(item);
    this.itemId++;
    this.render();
  }

   /**
   * a method that pushes an item to an arroy of items.
   * @param {EventTarget} target
   */
  replaceItem(event, id) {
    let inputData = [];

    // Adding input data
    const inputs = event.target.querySelectorAll("input");
    inputs.forEach((input) => {
      console.log({input});
      inputData.push({
        attrs: input.attributes,
        name: input.name,
        dataset: input.dataset,
        id: input.id,
        type: input.type,
        value: input.value,
      });
    });
    const replacedItem = new Item(parseInt(id), [...inputData]);
    this.allItems = this.allItems.map((item) => {
      if (item.id === parseInt(id)) {
        return {...replacedItem, edit: false}
      } else {
        return item;
      }
    })
    this.render();
  }

  /**
   *
   * @param {string} id
   */
  removeItem(id) {
    const listItem = document.getElementById(`qwk-list-item-${id}`);
    if (listItem) {
      // Filter out the list first...
      const newList = this.allItems.filter(item => item.id !== parseInt(id));
      // Remove the DOM element
      this.allItems = newList;
      this.render();
    }
  }

  /**
   *
   * @param {string} id
   */
  editItem(id) {
    console.log("1.", "this.itemId", this.itemId, {id})
    const listItem = document.getElementById(`qwk-list-item-${id}`);
    if (listItem) {
      const newList = this.allItems.map((item) => {
        if (item.id === parseInt(id)) {
          item.edit = true;
          return item;
        }
        else {
          item.edit = false;
          return item;
        }
      });

      this.allItems = newList;
      this.render();

      // editing
       const editableForm = document.getElementById("qwk-editable-form");
      if (editableForm) {
        editableForm.addEventListener("submit", (e) => {
          e.preventDefault()
          this.replaceItem(e, id)
        })
      }
    }
   
  }


  submitList() {
    let json = []  
    const listItems = document.querySelectorAll(".qwk-list--li")
    // console.log({list})
    // let obj = {}

    // for each row
    listItems.forEach((item) => {
    


      // for each cell
      const fieldValues = item.querySelectorAll(".qwk-list--item-field-value")
      let obj = {}
      fieldValues.forEach((value => {
        obj.id = item.id
        obj[`${value.dataset.name}`] = value.textContent
      }))
      json.push(obj)
    })
    
    console.log({json})

      // create json from the array


  }


  /**
   * A static method that loops through the array of items and constructs the
   * html for the container.
   * @returns html
   */
  render() {
    /** @type {HTMLElement} */
    const container = document.querySelector(this.containerEl);

    const header =
      `<header class="qwk-list--header">
        ${this.headerLabels.map(label =>
          `<div class="qwk-list--header-column">${label}</div>`).join("")}
      </header>`;

    const li = `${this.allItems.map((item) => `
      <li class="qwk-list--li" id="qwk-list-item-${item.id}">
        ${item.edit ? (`
          <form id="qwk-editable-form">
            <div class="qwk-form-field-wrapper">
            ${item.formData.map(e => `
              <input 
                autocomplete="false"
                id="${e.id}"
                name="${e.name}"
                type="${e.type}" 
                value="${e.value}" 
                class="qwk-input" />
              `).join("")}
              </div>
            <button type="submit" class="qwk-button qwk-button--update-item" data-id="${item.id}">update</button>
          </form>`) 
          : (`
          <div class="qwk-list--li-content">
            ${item.formData.map(e => `
              <div class="qwk-list--field">
                <div class="qwk-list--item-field-value" data-name="${e.name}">${e.value}</div>    
              </div>
            `).join("")}
          </div>`
          )}


        <div class="qwk-list--actions">
          <button class="qwk-button qwk-button--remove-item" data-id="${item.id}">Remove</button>
          ${!item.edit ? `<button class="qwk-button qwk-button--edit-item" data-id="${item.id}">edit</button>` : ""}
        </div>
      </li>`).join("")}`;

    const html = `
      <div class="qwk-list">
        ${this.hasHeader && header}
      
        <${this.listType} 
          id="qwk-list-item-${this.listId}" 
          class="${this.listClass} ${this.showMarker ? "qwk-list-marker-visible" : "qwk-list-marker-hidden"}">
          ${li}
        </${this.listType}>

        <button id="saveList" class="qwk-button ${this.submitListButtonClass}">send to service</button>
      </div>
    `;

    container.innerHTML = html;
  }
}

export default QuickList;
