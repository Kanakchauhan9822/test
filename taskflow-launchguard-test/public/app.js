const API = "/api";
let token = localStorage.getItem("taskflow_token");
let currentUser = JSON.parse(localStorage.getItem("taskflow_user") || "null");
let registerMode = false;

const authPanel = document.getElementById("authPanel");
const appPanel = document.getElementById("appPanel");
const authForm = document.getElementById("authForm");
const taskForm = document.getElementById("taskForm");

function setMessage(id, message) {
  document.getElementById(id).textContent = message;
}

function setAuthMode(isRegister) {
  registerMode = isRegister;
  document.getElementById("nameLabel").classList.toggle("hidden", !isRegister);
  document.getElementById("authSubmit").textContent = isRegister ? "Create account" : "Login";
  document.getElementById("showLogin").classList.toggle("active", !isRegister);
  document.getElementById("showRegister").classList.toggle("active", isRegister);
  setMessage("authMessage", "");
}

document.getElementById("showLogin").addEventListener("click", () => setAuthMode(false));
document.getElementById("showRegister").addEventListener("click", () => setAuthMode(true));

function showApp() {
  authPanel.classList.add("hidden");
  appPanel.classList.remove("hidden");
  document.getElementById("logoutButton").classList.remove("hidden");
  document.getElementById("welcomeText").textContent = `Welcome, ${currentUser.name}`;
  loadTasks();
}

function showAuth() {
  authPanel.classList.remove("hidden");
  appPanel.classList.add("hidden");
  document.getElementById("logoutButton").classList.add("hidden");
}

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    const response = await fetch(`${API}/auth/${registerMode ? "register" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Authentication failed");

    token = data.token;
    currentUser = data.user;
    localStorage.setItem("taskflow_token", token);
    localStorage.setItem("taskflow_user", JSON.stringify(currentUser));
    showApp();
  } catch (error) {
    setMessage("authMessage", error.message);
  }
});

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

async function loadTasks() {
  try {
    const status = document.getElementById("statusFilter").value;
    const priority = document.getElementById("priorityFilter").value;
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (priority) params.set("priority", priority);

    const tasks = await apiRequest(`/tasks?${params.toString()}`);
    renderTasks(tasks);
  } catch (error) {
    setMessage("taskMessage", error.message);
  }
}

function renderTasks(tasks) {
  const list = document.getElementById("taskList");
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("doneCount").textContent = tasks.filter((task) => task.completed).length;

  if (!tasks.length) {
    list.innerHTML = '<div class="empty">No tasks found. Add one above.</div>';
    return;
  }

  list.innerHTML = tasks.map((task) => `
    <article class="task-card ${task.completed ? "done" : ""}">
      <div>
        <div class="task-title">${task.title}</div>
        <p class="task-description">${task.description || "No description"}</p>
        <div class="task-meta"><span class="priority">${task.priority}</span></div>
      </div>
      <div class="task-actions">
        <button onclick="toggleTask(${task.id}, ${!task.completed})">${task.completed ? "Undo" : "Complete"}</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    </article>
  `).join("");
}

taskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify({
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDescription").value,
        priority: document.getElementById("taskPriority").value
      })
    });
    taskForm.reset();
    document.getElementById("taskPriority").value = "Medium";
    loadTasks();
  } catch (error) {
    setMessage("taskMessage", error.message);
  }
});

async function toggleTask(id, completed) {
  try {
    await apiRequest(`/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ completed })
    });
    loadTasks();
  } catch (error) {
    setMessage("taskMessage", error.message);
  }
}

async function deleteTask(id) {
  try {
    await apiRequest(`/tasks/${id}`, { method: "DELETE" });
    loadTasks();
  } catch (error) {
    setMessage("taskMessage", error.message);
  }
}

document.getElementById("statusFilter").addEventListener("change", loadTasks);
document.getElementById("priorityFilter").addEventListener("change", loadTasks);

document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("taskflow_token");
  localStorage.removeItem("taskflow_user");
  token = null;
  currentUser = null;
  showAuth();
});

if (token && currentUser) showApp();
else showAuth();
