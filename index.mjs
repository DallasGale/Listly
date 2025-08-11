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
 */
class Listly {
  /**
   * @param {HTMLElement} container
   * @param {HTMLFormElement} form
   * @param {string} listName
   * @throws {Error} When container or form is not a valid DOM element.
   */
  constructor(form, container, listName = "list") {
    this.allItems = [];
    this.container = container;
    this.form = form;
    this.listName = listName;
    this.listClass = "listly";

    this.itemId = 0;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("listly submitting", e);
      this.addItem(e.target);
    });
  }

  /**
   * A static method that loops through the array of items and constructs the
   * html for the container.
   * @returns html
   */
  render() {
    const html = `
      <ol id="${this.listName}-list" class="${this.listClass}">
        ${this.allItems.map(task => `
          <li id="taskly-item-${task.id}">
            ${task.formData.map(e => `
              <div class="taskly--field">
                <div class="taskly--item-field-name">${e[0]}</div>
                <div class="taskly--item-field-value">${e[1]}</div>
              </div>
              `).join("")}
          </li>
        `).join("")}
      </ol>
    `;
    this.container.innerHTML = html;
  }

  /**
   * a method that pushes an item to an arroy of items.
   * @param {EventTarget} target
   */
  addItem(target) {
    const formData = new FormData(target);
    const item = new Item(this.itemId, [...formData]);
    this.allItems.push(item);
    this.itemId++;
    this.render();
  }
};

export default Listly;
