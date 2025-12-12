// File: js/app.js
// Student: islam Ali Shahra (12429409)

const STUDENT_ID = "12429409";
const API_KEY = "nYs43u5f1oGK9";
const API_BASE = "https://portal.almasar101.com/assignment/api";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const statusDiv = document.getElementById("status");
const list = document.getElementById("task-list");

function setStatus(msg, isError = false) {
  statusDiv.textContent = msg;
  statusDiv.style.color = isError ? "#d9363e" : "#666";
}

document.addEventListener("DOMContentLoaded", async function () {
  setStatus("Loading tasks...");

  try {
    const res = await fetch(
      `${API_BASE}/get.php?stdid=${STUDENT_ID}&key=${API_KEY}`
    );

    const data = await res.json();

    if (data.tasks && Array.isArray(data.tasks)) {
      list.innerHTML = "";
      data.tasks.forEach((task) => renderTask(task));
      setStatus("");
    } else {
      setStatus("No tasks found.");
    }
  } catch (err) {
    setStatus("Failed to load tasks.", true);
    console.error(err);
  }
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = input.value.trim();
  if (!title) return;

  setStatus("Adding task...");

  try {
    const url = `${API_BASE}/add.php?stdid=${STUDENT_ID}&key=${API_KEY}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const data = await res.json();

    if (data.success) {
      renderTask(data.task);
      input.value = "";
      setStatus("Task added successfully.");
    } else {
      setStatus("Error adding task.", true);
    }
  } catch (err) {
    console.error(err);
    setStatus("Network error.", true);
  }
});

function renderTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const span = document.createElement("span");
  span.className = "task-title";
  span.textContent = task.title;

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", function () {
    deleteTask(task.id, li);
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);

  list.appendChild(li);
}

async function deleteTask(id, liElement) {

  if (!confirm("Delete this task?")) return;

  try {
    const url = `${API_BASE}/delete.php?stdid=${STUDENT_ID}&key=${API_KEY}&id=${id}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      liElement.remove();
      setStatus("Task deleted.");
    } else {
      setStatus("Delete failed.", true);
    }
  } catch (err) {
    console.error(err);
    setStatus("Network error.", true);
  }
}

