"use strict";
const body = document.querySelector("body");
const toggle = document.querySelector(".toggle");
const input = document.getElementById("new-task");
const item = document.getElementById("items");
const list = document.querySelector(".task-list");
const card = document.querySelector(".card");
const toDoList = {};
let taskCount = 0;
let size = 0;

window.addEventListener("load", function () {
  taskCount = Number(this.localStorage.getItem("counter"));
  for (const key in this.localStorage) {
    if (key.includes("task"))
      toDoList[key] = JSON.parse(this.localStorage[key]);
  }
  for (const key in toDoList) {
    createNewTask(toDoList[key]);
  }
  [...list.children].forEach((el) => {
    if (el.children[2].classList.contains("completed")) {
      el.children[0].checked = true;
    }
  });
  size = Object.keys(toDoList).length;
  item.textContent = `${size} items left`;
  if (size > 0) {
    card.classList.remove("hidden");
  }
  if (this.matchMedia && this.matchMedia("(prefers-color-scheme:dark)").matches)
    body.classList.add("dark");
});

toggle.addEventListener("click", function (e) {
  body.classList.contains("dark")
    ? body.classList.remove("dark")
    : body.classList.add("dark");
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    taskCount++;
    localStorage.setItem(`counter`, taskCount);
    const task = {
      id: `task-${taskCount}`,
      info: input.value,
      status: "active",
    };
    input.value = "";
    input.blur();
    toDoList[`task-${taskCount}`] = task;
    localStorage.setItem(`task-${taskCount}`, JSON.stringify(task));
    size = Object.keys(toDoList).length;
    createNewTask(task);
    item.textContent = `${size} items left`;
    if (size > 0) {
      card.classList.remove("hidden");
    }
  }
});

document.addEventListener("click", function (e) {
  if (e.target.closest(".checkbox")) {
    const target = e.target.closest("label");
    if (
      !target.parentElement.children[0].checked &&
      target.parentElement.children[2].classList.contains("active")
    ) {
      target.parentElement.children[2].classList.remove("active");
      target.parentElement.children[2].classList.add("completed");
      toDoList[target.getAttribute("for")].status = "completed";
      localStorage.setItem(
        target.getAttribute("for"),
        JSON.stringify(toDoList[target.getAttribute("for")])
      );
    } else if (
      target.parentElement.children[0].checked &&
      !target.parentElement.children[2].classList.contains("active")
    ) {
      target.parentElement.children[2].classList.remove("completed");
      target.parentElement.children[2].classList.add("active");
      toDoList[target.getAttribute("for")].status = "active";
      localStorage.setItem(
        target.getAttribute("for"),
        JSON.stringify(toDoList[target.getAttribute("for")])
      );
    }
  } else if (e.target.closest(".btn-clear")) {
    [...list.children].forEach((el) => {
      if (!el.children[2].classList.contains("active")) {
        e.target.closest(".btn-clear").blur();
        delete toDoList[el.children[0].id];
        localStorage.removeItem(el.children[0].id);
        el.remove();
        size = Object.keys(toDoList).length;
        item.textContent = `${size} items left`;
        if (size <= 0) {
          card.classList.add("hidden");
          taskCount = 0;
          localStorage.clear();
        }
      }
    });
  } else if (e.target.closest(".btn-active")) {
    [...list.children].forEach((el) => {
      el.classList.remove("hidden");
      if (!el.children[2].classList.contains("active")) {
        el.classList.add("hidden");
      }
    });
  } else if (e.target.closest(".btn-completed")) {
    [...list.children].forEach((el) => {
      el.classList.remove("hidden");
      if (el.children[2].classList.contains("active")) {
        el.classList.add("hidden");
      }
    });
  } else if (e.target.closest(".btn-all")) {
    [...list.children].forEach((el) => {
      el.classList.remove("hidden");
    });
  } else return;
});

function createNewTask(data) {
  const { id, info, status } = data;
  const html = `<div class="task-field">
          <input type="checkbox" name="task" id="${id}" />
          <label class="checkbox" for="${id}"></label>
          <p class="task-description ${status}">${info}</p>
          <button class="btn-del" aria-label="Delete task" onclick="deleteTask.bind(this)()"></button>
        </div>`;
  list.insertAdjacentHTML("afterbegin", html);
}

function deleteTask() {
  const task = this.parentElement;
  const taskId = task.children[0].id;
  delete toDoList[taskId];
  localStorage.removeItem(taskId);
  task.remove();
  size = Object.keys(toDoList).length;
  item.textContent = `${size} items left`;
  if (size <= 0) {
    card.classList.add("hidden");
    taskCount = 0;
    localStorage.clear();
  }
}
