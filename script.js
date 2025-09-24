// DOM Elements
const taskInput = document.getElementById('taskInput');
const taskTime = document.getElementById('taskTime');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearAll = document.getElementById('clearAll');

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks(tasks);

// Add task
addBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const timeValue = taskTime.value;
    if(taskText) {
        tasks.push({ text: taskText, time: timeValue, completed: false });
        saveAndRender();
        taskInput.value = '';
        taskTime.value = '';
    }
});

// Enter key adds task
taskInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') addBtn.click();
});

// Save to localStorage and render
function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks);
}

// Render tasks
function renderTasks(tasksToRender) {
    taskList.innerHTML = '';
    tasksToRender.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if(task.completed) li.classList.add('completed');

        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleComplete(${index})">
            <div class="task-details">
                <span class="task-text">${task.text}</span>
                <span class="task-time">${task.time ? "⏰ " + task.time : ""}</span>
            </div>
            <div>
                <button class="edit" onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Toggle complete
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

// Edit task
function editTask(index) {
    const newText = prompt('Edit task:', tasks[index].text);
    const newTime = prompt('Edit time (HH:MM):', tasks[index].time || "");
    if(newText !== null && newText.trim() !== '') {
        tasks[index].text = newText.trim();
        if(newTime !== null) tasks[index].time = newTime;
        saveAndRender();
    }
}

// Filter tasks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        if(filter === 'all') renderTasks(tasks);
        else if(filter === 'completed') renderTasks(tasks.filter(t => t.completed));
        else if(filter === 'pending') renderTasks(tasks.filter(t => !t.completed));
    });
});

// Clear all tasks
clearAll.addEventListener('click', () => {
    if(confirm('Are you sure you want to clear all tasks?')) {
        tasks = [];
        saveAndRender();
    }
});
