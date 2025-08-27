"use strict";
import Item from "./lineItem/lineItem.js";

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
   * @param {string} formEl
   * @param {HTMLElement} containerEl
   *
   * @param {Object} params
   * @param {Object} params.options
   * @param {string} params.options.listName
   * @param {"ol" | "ul"} params.options.listType
   * @param {boolean} params.options.hasHeader
   * @param {boolean} params.options.showMarker
   * @param {boolean} params.options.showActions
   * @param {Array} params.options.prefill
   * @throws {Error} When container or form is not a valid DOM element.
   */
  constructor(...args) {
    let formEl, containerEl, params;
    [formEl, containerEl, params] = args;
    // console.log({ formEl, containerEl, params });
    // --------------------------------------------------------------
    if (!params) params = {};
    // --------------------------------------------------------------
    // This needs to be accessed inside the render() method
    this.containerEl = containerEl;
    // --------------------------------------------------------------
    // params: { options: ...}
    this.hasHeader = params?.options?.hasHeader || false;
    this.listType = params?.options?.listType || "ol";
    this.listId = params?.options?.listId;
    this.showMarker = params?.options?.showMarker || false;
    this.showActions = params?.options?.showActions || false;
    this.showSubmit = params?.options?.showSubmit || false;
    this.prefill = params?.options?.prefill || null;
    // --------------------------------------------------------------

    // Local mutating variables
    this.headerLabels = [];
    this.allItems = [];
    this.itemId = 0;
    this.formInputElements = [];

    // Element ClassNames
    this.qwkInputFieldClass = ".qwk-form-field";
    this.removeItemButtonClass = "qwk--action-btn-remove";
    this.editItemButtonClass = "qwk--action-btn-edit";
    this.updateItemButtonClass = "qwk--action-btn-done";
    this.submitListButtonClass = "qwk-button--submit-list";
    this.listClass = `qwk--${this.listType}`;

    // Check for valid form and container elements
    if (
      formEl &&
      containerEl &&
      typeof formEl === "string" &&
      typeof containerEl === "string" &&
      document.querySelector(formEl) &&
      document.querySelector(containerEl)
    ) {
      // Form submit to addItem
      const form = document.querySelector(formEl);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.addItem(e);
      });

      // Adding input data
      const inputs = document.querySelectorAll(this.qwkInputFieldClass);
      this.retrieveFormInputElements(inputs);

      // Listeners for action click
      const containerElement = document.querySelector(containerEl);
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

    // Add input data
    const inputs = event.target.querySelectorAll( this.qwkInputFieldClass);
    inputs.forEach((input) => {
      console.log({input})
      labels.push(input.dataset.qwkInputLabel);
      inputData.push({
        node: input.nodeName.toLowerCase(),
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
    const item = new Item(this.itemId, [...inputData]);

    console.log({item});
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
    // const inputs = event.target.querySelectorAll("input")
    //  This should be querying class names just like the initial query of the form inputs
    const inputs = event.target.querySelectorAll(this.qwkInputFieldClass);
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
        return {...replacedItem, edit: false};
      } else {
        return item;
      }
    });
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
      const newList = this.allItems.filter((item) => item.id !== parseInt(id));
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
    const listItem = document.getElementById(`qwk-list-item-${id}`);
    if (listItem) {
      const newList = this.allItems.map((item) => {
        if (item.id === parseInt(id)) {
          item.edit = true;
          return item;
        } else {
          item.edit = false;
          return item;
        }
      });

      this.allItems = newList;
      this.render();

      // editing
      const editingContainer = document.querySelector(".editing-container");
      this.formInputElements.forEach((el) => {
        console.log({el})
        editingContainer.appendChild(el)
      })

      const editableForm = document.getElementById("qwk-editable-form");
      if (editableForm) {
        editableForm.addEventListener("submit", (e) => {
          e.preventDefault();
          this.replaceItem(e, id);
        });
      }
    }
  }

  /**
   * @returns {json}
   */
  submitList() {
    let json = [];
    const listItems = document.querySelectorAll(".qwk--li");
    console.log({listItems})
    // console.log({list})
    // let obj = {}

    // for each row
    listItems.forEach((item) => {
      // for each cell
      const fieldValues = item.querySelectorAll(".qwk--item-field-value");
      console.log({fieldValues})
      let obj = {};
      fieldValues.forEach((value) => {
        obj.id = item.id;
        obj[`${value.dataset.name}`] = value.textContent;
      });
      json.push(obj);
    });
  }

  /**
   * This needs to return all different input elements and then be used inside the 'edit' condition for the html.
   * @param {HTMLInputElement} el;
   * @returns {html}
   */
  retrieveFormInputElements(el) {
    let htmlElements = [];
    el.forEach((e) => htmlElements.push(e.cloneNode(true)));
    this.formInputElements = htmlElements;
  }

  // renderCorrectInputElement(editableElements) {
  //   console.log("this.formInputElements", this.formInputElements)
  //   // let foundElement;
  //   // if (editableElement) {
  //   this.formInputElements.map((el) => {
  //     // console.log({el}, editableElement.filter.formData)
  //    editableElements.formData.filter((edit) => {
  //     if (edit.id === el.id) {
  //       console.log()return el
  //     // if (el.id === editableElements.formData.id) {
  //     //   console.log({el})
  //     // }})
  //     // return 
  //   })
  // })}

  /**
   * A static method that loops through the array of items and constructs the
   * html for the container.
   * @returns html
   */
  render() {
    /** @type {HTMLElement} */
    const container = document.querySelector(this.containerEl);

    const header = `<header class="qwk--header">
          <div class="qwk--header-content">
          ${this.headerLabels
            .map(
              (label) => `<div class="qwk--header-column">${label}</div>`
            )
            .join("")}
          </div>
      </header>`;

    const li = `${this.allItems.map((item, _index) => `
      <li class="qwk--li ${item.edit ? "qwk--li-editing" : "qwk--li-reading"}" id="qwk-list-item-${item.id}">
        ${this.listType === "ol" ? `<div class="qwk--li-count">${_index + 1}</div>` : ""}
        ${item.edit ? `
          <form id="qwk-editable-form">
            <div class="qwk-form-field-wrapper editing-container">
            </div>
            <div class="qwk--actions">
              <button type="submit" class="qwk-action-button ${this.updateItemButtonClass}" data-id="${item.id}">DONE</button>
            </div>
          </form>`
            : `
          <div class="qwk--li-content">
            ${item.formData
              .map(
                (e) => `
              <div class="qwk--field">
                <div class="qwk--item-field-value" data-name="${e.name}">${e.value}</div>    
              </div>
            `).join("")}
          </div>`
        }
        ${
          this.showActions
            ? `
          <div class="qwk--actions">
            <button class="qwk--action-btn qwk--action-btn-remove" data-id="${item.id}"></button>
            ${!item.edit ? `<button class="qwk--action-btn qwk--action-btn-edit" data-id="${item.id}"></button>` : ""}
          </div>`
            : ""
        }
      </li>`).join("")}`;

    const html = `
      <div class="qwk-list">
        ${this.hasHeader ? header : ""}
      
        <${this.listType} 
          id="qwk-list-item-${this.listId}" 
          class="${this.listClass} ${this.showMarker ? "qwk-list-marker-visible" : "qwk-list-marker-hidden"}">
          ${li}
        </${this.listType}>


        ${
          this.showSubmit
            ? `<button id="saveList" class="qwk-button ${this.submitListButtonClass}">send to service</button>`
            : ""
        }
      </div>
    `;

    container.innerHTML = html;
  }
}

export default QuickList;
