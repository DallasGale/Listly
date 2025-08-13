"use strict";
import Item from "./item.mjs";
/**
 * A lightweight class for creating dynamic lists from HTML forms
 * @class
 * @example
 * import Listly from "listly";
 * const container = document.querySelector("#container")
 * const form = document.querySelector("#form")
 * const myList = new Listly(container, form, "groceries")
 * myList.init()
 */
class Listly {
  /**
   * @param {string} form
   * @param {HTMLElement} container
   * @param {string} listName
   * @param {"ol" | "ul"} listElType
   * @param {boolean} listHeader
   * @throws {Error} When container or form is not a valid DOM element.
   */
  constructor(
    formId,
    containerId,
    listName = "list",
    listElType = "ol",
    listHeader = true,
  ) {
    this.formId = formId;
    this.containerId = containerId;

    this.headerLabels = [];
    this.allItems = [];
    this.listElType = listElType;
    this.listName = listName;
    this.listClass = `listly--${this.listElType}`;
    this.listHeader = listHeader;

    this.itemId = 0;

    // Form Element
    const form = document.querySelector(this.formId);
    form.addEventListener("submit", e => {
      e.preventDefault();
      this.addItem(e.target);
    });
  }

  init() {
    console.log("initialised new Listly()");
  }

  config({}) {
    // todo... optional configurationobject on class instance.
    // const myList = new Listly()
    // myList.config({
    //  formElement: ...,
    //  containerElement: ...
    // ...
    // })
  }

  /**
   * A static method that loops through the array of items and constructs the
   * html for the container.
   * @returns html
   */
  render() {
    // Container Element
    const container = document.querySelector(this.containerId);
    const html = `
      <div class="listly">
        ${
          this.listHeader &&
          `<header class="listly--header">
            ${this.headerLabels
              .map(label => `<div class="listly--header-column">${label}</div>`)
              .join("")}
          </header>`
        }
      
        <${this.listElType} id="${this.listName}-ol" class="${this.listClass}">
          ${this.allItems
            .map(
              task => `
            <li class="listly--li" id="listly-item-${task.id}">
              <div class="listly--li-content">
                ${task.formData
                  .map(
                    e => `
                  <div class="listly--field">
                    <div class="listly--item-field-value">${e[1]}</div>
                  </div>
                  `,
                  )
                  .join("")}
              </div>
            </li>
          `,
            )
            .join("")}
        </${this.listElType}>
      </div>
    `;

    container.innerHTML = html;
  }

  /**
   * a method that pushes an item to an arroy of items.
   * @param {EventTarget} target
   */
  addItem(target) {
    let labels = [];
    const inputs = target.querySelectorAll("input");
    inputs.forEach(input => {
      labels.push(input.dataset.listlyLabel);
    });
    console.log({ labels });
    const formData = new FormData(target);
    console.log(...formData);

    this.headerLabels = labels;

    const item = new Item(this.itemId, [...formData]);
    this.allItems.push(item);
    this.itemId++;
    this.render();
  }
}

export default Listly;
