let tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];
init();

function init() {
  for (let i = 0; i < tasks.length; i++) {
    renderItem(tasks[i]);
  }
  const toggle = document.querySelector('.toggler');
  toggle.onclick = handleToggle;
  const theme = localStorage.getItem('theme') ?? 'dark';
  const toggler = toggle.querySelector('input[type="checkbox"]');
  toggler.checked = theme !== 'dark';
  handleToggle({ currentTarget: toggle });
  const user =
    (localStorage.getItem('user') ?? prompt('Enter your name')?.trim()) ||
    'Anonymous';
  updateUsername(user).onclick = renameUser;
}

function updateUsername(user) {
  localStorage.setItem('user', user);
  const userElement = document.getElementById('user');
  userElement.innerText = `, ${user}!`;
  return userElement;
}

function renameUser(event) {
  const user = prompt('Enter your name')?.trim();
  if (!user) {
    return;
  }
  if (user.length > 20) {
    alert('Your name is too long');
    return;
  }
  updateUsername(user);
}

function handleToggle(event) {
  const toggler = event.currentTarget.querySelector('input[type="checkbox"]');
  toggler.checked = !toggler.checked;
  if (toggler.checked) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
  document.body.classList.toggle('dark', toggler.checked);
}

function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function keyPressed(event) {
  if (event.code === 'Enter') {
    saveTask();
  }
}

function removeTask(event) {
  const button = event.target;
  const taskItem = button.parentElement;
  const removedTask = taskItem.task;
  const newTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    if (removedTask !== tasks[i]) {
      newTasks.push(tasks[i]);
    }
  }
  tasks = newTasks;
  saveTasksToStorage(tasks);
  taskItem.classList.add('removing');
  setTimeout(() => {
    taskItem.remove();
  }, 990);
}

function handleDone(event) {
  const span = event.target;
  const taskItem = span.parentElement;
  taskItem.task.isDone = !taskItem.task.isDone;
  taskItem.classList.toggle('is-done', taskItem.task.isDone);
  saveTasksToStorage(tasks);
}

function createTaskItem(task) {
  const taskItem = document.createElement('li');
  taskItem.task = task;
  taskItem.classList.toggle('is-done', task.isDone);
  taskItem.classList.add('adding');
  setTimeout(() => {
    taskItem.classList.remove('adding');
  });

  const taskText = document.createElement('span');
  taskText.onclick = handleDone;
  const text = document.createTextNode(task.description);
  taskText.append(text);

  const button = document.createElement('input');
  button.type = 'button';
  button.value = 'Delete';
  button.onclick = removeTask;

  taskItem.append(taskText, button);

  return taskItem;
}

function renderItem(task) {
  const taskList = document.getElementById('taskList');
  const taskItem = createTaskItem(task);
  taskList.append(taskItem);
}

function saveTask() {
  const taskElement = document.getElementById('task');
  const taskValue = taskElement.value.trim();
  taskElement.value = '';

  if (taskValue === '') {
    alert('Please enter task');
    return;
  }

  if (taskValue.length > 200) {
    alert('Your task is too long');
    return;
  }

  const task = {
    description: taskValue,
    isDone: false
  };
  renderItem(task);

  tasks.push(task);
  saveTasksToStorage(tasks);
}
