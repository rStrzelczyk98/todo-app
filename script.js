"use strict";
function app() {
  const list = document.querySelector(".task-list");
  const toDoList = {};
  let taskCount = 0;

  window.addEventListener("load", function () {
    if (matchMedia && matchMedia("(prefers-color-scheme:dark)").matches)
      document.body.classList.add("dark");
    taskCount = Number(localStorage.getItem("counter"));
    for (const key in localStorage) {
      if (key.includes("task")) toDoList[key] = JSON.parse(localStorage[key]);
    }
    for (const key in toDoList) {
      createNewTask(toDoList[key]);
    }
    [...list.children].forEach((el) => {
      if (el.children[2].classList.contains("completed"))
        el.children[0].checked = true;
    });
    itemsLeft();
    displayTaskList();
    document.body.classList.remove("hidden");
  });

  document.addEventListener("keydown", function (e) {
    const input = document.getElementById("new-task");
    if (e.key === "Enter" && input.value != "") {
      const task = {
        id: `task-${++taskCount}`,
        info: input.value,
        status: "active",
      };
      input.value = "";
      toDoList[`task-${taskCount}`] = task;
      localStorage.setItem(`counter`, taskCount);
      localStorage.setItem(`task-${taskCount}`, JSON.stringify(task));
      createNewTask(task);
      itemsLeft();
      displayTaskList();
    } else return;
  });

  document.addEventListener("click", function (e) {
    if (
      e.target.closest(".checkbox") ||
      e.target.closest(".task-description")
    ) {
      const checkbox = e.target.parentElement.children[0];
      const label = e.target.parentElement.children[1];
      const taskStatus = e.target.parentElement.children[2].classList;
      if (!checkbox.checked && taskStatus.contains("active")) {
        if (e.target === e.target.closest(".task-description"))
          checkbox.checked = true;
        taskStatus.remove("active");
        taskStatus.add("completed");
        updateStatus.call(label, "completed");
      } else if (checkbox.checked && taskStatus.contains("completed")) {
        if (e.target === e.target.closest(".task-description"))
          checkbox.checked = false;
        taskStatus.remove("completed");
        taskStatus.add("active");
        updateStatus.call(label, "active");
      }
      itemsLeft();
    } else if (e.target.closest(".btn-clear")) {
      [...list.children].forEach((el) => {
        if (el.children[2].classList.contains("active")) return;
        delete toDoList[el.children[0].id];
        localStorage.removeItem(el.children[0].id);
        el.remove();
        itemsLeft();
        displayTaskList();
      });
    } else if (e.target.closest(".btn-active")) {
      filterTasks("active");
    } else if (e.target.closest(".btn-completed")) {
      filterTasks("completed");
    } else if (e.target.closest(".btn-all")) {
      filterTasks();
    } else if (e.target.closest(".btn-del")) {
      deleteTask.call(e.target);
    } else if (e.target.closest(".toggle")) {
      document.body.classList.contains("dark")
        ? document.body.classList.remove("dark")
        : document.body.classList.add("dark");
    } else return;
  });

  function createNewTask(data) {
    const { id, info, status } = data;
    const html = `<div class="task-field">
          <input type="checkbox" name="task" id="${id}" />
          <label class="checkbox" for="${id}"></label>
          <p class="task-description ${status}">${info}</p>
          <button class="btn-del" aria-label="Delete task"></button>
        </div>`;
    list.insertAdjacentHTML("afterbegin", html);
  }

  function deleteTask() {
    const task = this.parentElement;
    const taskId = task.children[0].id;
    delete toDoList[taskId];
    localStorage.removeItem(taskId);
    task.remove();
    itemsLeft();
    displayTaskList();
  }

  function itemsLeft() {
    let count = 0;
    const item = document.getElementById("items");
    for (const key in toDoList) {
      if (toDoList[key]?.status === "active") {
        count++;
      }
    }
    item.textContent =
      count === 1 ? `${count} item left` : `${count} items left`;
    return Object.keys(toDoList).length;
  }

  function displayTaskList() {
    const tasks = itemsLeft();
    const card = document.querySelector(".card");
    if (tasks > 0) {
      card.classList.remove("hidden");
    } else if (tasks <= 0) {
      card.classList.add("hidden");
      taskCount = 0;
      localStorage.clear();
    }
  }

  function updateStatus(msg) {
    toDoList[this.getAttribute("for")].status = msg;
    localStorage.setItem(
      this.getAttribute("for"),
      JSON.stringify(toDoList[this.getAttribute("for")])
    );
  }

  function filterTasks(value) {
    [...list.children].forEach((el) => {
      el.classList.remove("hidden");
      if (value && !el.children[2].classList.contains(value))
        el.classList.add("hidden");
    });
  }
}
app();
