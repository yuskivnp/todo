let tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];
init();

function init() {
  for(let i = 0; i < tasks.length; i++) {
    renderItem(tasks[i]);
  }
}

function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function keyPressed(event) {
  if (event.code === "Enter") {
    saveTask();
  }
}

function removeTask(event) {
  const button = event.target;
  const taskItem = button.parentElement;
  const removedTask = taskItem.task;
  const newTasks = [];
  for(let i = 0; i < tasks.length; i++) {
    if(removedTask !== tasks[i]) {
      newTasks.push(tasks[i]);
    }
  }
  tasks = newTasks;
  saveTasksToStorage(tasks);

  taskItem.remove();
}

function handleDone(event) {
  const span = event.target;
  const taskItem = span.parentElement;
  taskItem.task.isDone = !taskItem.task.isDone;
  taskItem.classList.toggle("is-done", taskItem.task.isDone);
  saveTasksToStorage(tasks);
}

function createTaskItem(task) {
  const taskItem = document.createElement("li");
  taskItem.task = task;
  taskItem.classList.toggle("is-done", task.isDone);

  const taskText = document.createElement("span");
  taskText.onclick = handleDone;
  const text = document.createTextNode(task.description);
  taskText.append(text);
  
  const button = document.createElement("input");
  button.type = "button";
  button.value = "Delete";
  button.onclick = removeTask;
  
  taskItem.append(
    taskText,
    button,
  );

  return taskItem;
}

function renderItem(task) {
  const taskList = document.getElementById("taskList");
  const taskItem = createTaskItem(task);
  taskList.append(taskItem);
}

function saveTask() {
  const taskElement = document.getElementById("task");
  const taskValue = taskElement.value;
  taskElement.value = ""
  
  const task = {
    description: taskValue,
    isDone: false,
  };
  renderItem(task);

  tasks.push(task);
  saveTasksToStorage(tasks);
}