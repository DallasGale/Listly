class Task {
  constructor(id, name, importance, completed = false) {
    this.id = id,
    this.name = name,
    this.importance = importance,
    this.completed = completed
  }


  setCompleted() {
    this.completed = true
    console.log(`completed ${this.name}: ${this.completed}` )
    return this.completed
  }
}
