"use strict";

// Requirements
// - Valid HTML Form Element with inputs
// - Valid <div id />

// todo Options:
// - CSS Class
// - Style prop
// - With Edit,
// - With Delete,
// - With Validation
// - With Header / Column Name
//  eg: Name / Importance / Due Date
//      This will be taken from the label value


import Item from './item.mjs'


class Listly {
  constructor(container, form) {
    this.id = 0;
    this.container = container;
    this.allTasks = [];
    this.form = form
  }

  addItem(target) {
    
    const formData = new FormData(target)
    console.log("formData: ", ...formData)
    // Form Data needs to be spread so we can access the array including the name/value input
    // Each array is a field
    // eg ['fieldId', fieldValue]
    // const task = new Task(this.id, name, importance, false);
    const task = new Item(this.id, [...formData]);
    console.log({task})
    this.allTasks.push(task)
    this.id++
    // console.log("Adding task: ", task)
    // console.log("All tasks: ", this.allTasks)
    
    this.render();
    return task;
  }


  render() {
    const html = this.allTasks.map(task =>  `
      <li id="${task.id}">
        ${task.formData.map((e) => `
          <div>${e[0]}</div>
          <div>${e[1]}</div>
          `).join("")}
      </li>
    `).join("")
    this.container.innerHTML = html
  }
}

export default Listly