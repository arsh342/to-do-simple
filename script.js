document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const assigneeInput = document.getElementById("assignee-input");
  const deadlineInput = document.getElementById("deadline-input");
  const timeInput = document.getElementById("time-input");
  const taskList = document.getElementById("task-list");
  const completedTasksList = document.getElementById("completed-tasks");

  taskForm.addEventListener("submit", addTask);
  taskList.addEventListener("click", handleTaskAction);
  completedTasksList.addEventListener("click", handleTaskAction);

  loadTasks();

  function addTask(event) {
    event.preventDefault();
    const taskText = taskInput.value;
    const assignee = assigneeInput.value;
    const deadlineDate = deadlineInput.value;
    const deadlineTime = timeInput.value;
    const deadline = new Date(`${deadlineDate}T${deadlineTime}`).toISOString();
    const newTask = {
      text: taskText,
      assignee: assignee,
      deadline: deadline,
      deadlineDate: deadlineDate,
      deadlineTime: deadlineTime,
      createdAt: new Date().toISOString(),
      completed: false
    };

    const tasks = getTasksFromStorage();
    tasks.push(newTask);
    saveTasksToStorage(tasks);
    renderTask(newTask);
    taskForm.reset();
  }

  function handleTaskAction(event) {
    const li = event.target.closest('li');
    if (event.target.classList.contains("remove")) {
      removeTask(li);
    } else if (event.target.classList.contains("complete")) {
      completeTask(li);
    }
  }

  function removeTask(taskElement) {
    const tasks = getTasksFromStorage().filter(task => task.createdAt !== taskElement.dataset.id);
    saveTasksToStorage(tasks);
    taskElement.remove();
  }

  function completeTask(taskElement) {
    const tasks = getTasksFromStorage();
    const task = tasks.find(task => task.createdAt === taskElement.dataset.id);
    task.completed = true;
    saveTasksToStorage(tasks);
    taskElement.remove();
    renderTask(task);
  }

  function getTasksFromStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  function saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTask(task) {
    const li = document.createElement("li");
    li.dataset.id = task.createdAt;

    const taskDetails = document.createElement("div");
    taskDetails.classList.add("task-details");
    taskDetails.innerHTML = `<span>${task.text} (Assigned to: ${task.assignee})</span>
                                 <span>Deadline: ${new Date(task.deadline).toLocaleString()}</span>`;

    const taskActions = document.createElement("div");

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove");

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.classList.add("complete");

    taskActions.appendChild(removeButton);
    if (!task.completed) {
      taskActions.appendChild(completeButton);
      li.appendChild(taskDetails);
      li.appendChild(taskActions);
      taskList.appendChild(li);
    } else {
      li.classList.add("completed");
      li.appendChild(taskDetails);
      li.appendChild(taskActions);
      completedTasksList.appendChild(li);
    }
  }

  function loadTasks() {
    const tasks = getTasksFromStorage();
    tasks.forEach(task => renderTask(task));
  }
});
