// Select elements
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const prioritySelect = document.getElementById("priority-select");
const todoList = document.getElementById("todo-list");
const searchInput = document.getElementById("search-input");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const suggestionsList = document.getElementById("suggestions-list");

// Retrieve todos from localStorage
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Load todos on page load
document.addEventListener('DOMContentLoaded', () => {
    todos.forEach(todo => renderTodoItem(todo));
    toggleDarkMode();
});

// Add new todo
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTodo = {
        text: input.value.trim(),
        priority: prioritySelect.value,
        completed: false,
        timestamp: new Date().toLocaleString()
    };
    
    if (newTodo.text !== "") {
        todos.push(newTodo);
        renderTodoItem(newTodo);
        saveTodos();
        input.value = "";  // Clear input field
    } else {
        alert("Task cannot be empty!");
    }
});

// Render a todo item
function renderTodoItem(todo) {
    const todoEl = document.createElement("li");
    todoEl.classList.add("todo-item");
    if (todo.completed) todoEl.classList.add("completed");

    const contentEl = document.createElement("span");
    contentEl.textContent = `${todo.text} [${todo.priority}]`;

    const timestampEl = document.createElement("small");
    timestampEl.textContent = `Added on: ${todo.timestamp}`;

    todoEl.appendChild(contentEl);
    todoEl.appendChild(timestampEl);

    // Toggle completion
    todoEl.addEventListener("click", () => {
        todo.completed = !todo.completed;
        todoEl.classList.toggle("completed");
        saveTodos();
    });

    // Edit task on double-click
    contentEl.addEventListener("dblclick", () => editTodo(todo, contentEl));

    // Delete task on right-click
    todoEl.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to delete this task?")) {
            todoEl.remove();
            todos = todos.filter(t => t !== todo);
            saveTodos();
        }
    });

    todoList.appendChild(todoEl);
}

// Edit todo task
function editTodo(todo, contentEl) {
    const newTodo = prompt("Edit your todo:", contentEl.innerText);
    if (newTodo !== null && newTodo.trim() !== "") {
        todo.text = newTodo.trim();
        contentEl.innerText = `${newTodo.trim()} [${todo.priority}]`;
        saveTodos();
    }
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    saveDarkModePreference();
});

function toggleDarkMode() {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

function saveDarkModePreference() {
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

// Search functionality with suggestions
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const suggestions = todos.filter(todo => todo.text.toLowerCase().includes(query));

    // Show suggestions
    if (query) {
        suggestionsList.innerHTML = '';
        suggestions.forEach(todo => {
            const suggestionItem = document.createElement("li");
            suggestionItem.textContent = todo.text;
            suggestionItem.addEventListener("click", () => {
                searchInput.value = todo.text;
                suggestionsList.style.display = 'none';
            });
            suggestionsList.appendChild(suggestionItem);
        });
        suggestionsList.style.display = 'block';
    } else {
        suggestionsList.style.display = 'none';
    }
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest('.search-input') && !e.target.closest('.suggestions')) {
        suggestionsList.style.display = 'none';
    }
});
