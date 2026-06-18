let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

const taskList = document.getElementById("taskList");
const progressText = document.getElementById("progress");
const progressFill = document.getElementById("progressFill");

/* Save */
function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* Add Task */
function addTask() {
    const name = document.getElementById("taskName").value.trim();
    const subject = document.getElementById("subject").value;
    const priority = document.getElementById("priority").value;
    const dueDate = document.getElementById("dueDate").value;

    if (!name) return alert("Enter task name");

    tasks.push({
        id: Date.now(),
        name,
        subject,
        priority,
        dueDate,
        completed: false
    });

    document.getElementById("taskName").value = "";
    render();
}

/* Render */
function render() {
    taskList.innerHTML = "";

    let filtered = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
    });

    filtered.forEach(task => {
        const li = document.createElement("li");

        li.className = `${task.priority.toLowerCase()} ${task.completed ? "completed" : ""}`;

        const today = new Date().toISOString().split("T")[0];
        const overdue = task.dueDate && task.dueDate < today;

        li.innerHTML = `
            <div class="task-title">${task.name}</div>
            <div>📘 ${task.subject} | ${task.priority}</div>
            <div>📅 ${task.dueDate || "No date"} ${overdue ? "⚠️" : ""}</div>
            <div class="actions">
                <button onclick="toggle(${task.id})">✔</button>
                <button onclick="editTask(${task.id})">Edit</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateProgress();
    save();
}

/* Toggle */
function toggle(id) {
    tasks = tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    render();
}

/* Edit */
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newName = prompt("Edit task:", task.name);
    if (newName) task.name = newName;
    render();
}

/* Delete */
function deleteTask(id) {
    if (confirm("Delete task?")) {
        tasks = tasks.filter(t => t.id !== id);
        render();
    }
}

/* Filter */
function setFilter(type) {
    filter = type;
    render();
}

/* Progress */
function updateProgress() {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;

    progressText.innerText = `${completed} / ${total} completed`;

    const percent = total ? (completed / total) * 100 : 0;
    progressFill.style.width = percent + "%";

    if (total > 0 && completed === total) {
        progressText.innerText += " 🎉";
    }
}

/* Init */
render();
