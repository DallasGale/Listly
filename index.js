"use strict";

import Task from './task'


class Listly {
  constructor(listEl, formEl) {
    this.id = 0;
    this.listEl = listEl;
    this.allTasks = [];
  }

  // static allTasks = [];
  addTask(name, importance) {
    const task = new Task(this.id, name, importance, false);
    this.allTasks.push(task)
    this.id++
    console.log("Adding task: ", task)
    console.log("All tasks: ", this.allTasks)
    
    this.render();
    return task;
  }

  submitForm() {
    const formData = new FormData(e.target)
    const taskName = formData.get("taskName")
    const taskImportance = formData.get("taskImportance")
    taskly.addTask(taskName, taskImportance)
  }  
  

  render() {
    const html = this.allTasks.map(task => `
      <li>
        ${task.id}
        ${task.name}
        ${task.importance}
        ${task.completed ? "yes" : "no"}
        <button>Complete</button>
        <button>Remove</button>
      </li>
    `).join("");

    this.listEl.innerHTML = html
  }


  setupEventListeners() {

  }
}

export default Listly