document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-text');
    const dueDateInput = document.getElementById('task-due-date');
    const addTaskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterBtn = document.getElementById('filter-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const noTaskMessage = document.getElementById('no-task-found');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = ''; // Clear the list
        
        let tasksToRender = tasks;
        if (currentFilter === 'active') {
            tasksToRender = tasks.filter(task =>!task.completed);
        }

        if (tasksToRender.length === 0) {
            noTaskMessage.style.display = 'block';
        } else {
            noTaskMessage.style.display = 'none';
            tasksToRender.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task-item';
                taskElement.dataset.id = task.id;

                taskElement.innerHTML = `
                    <div class="task-text">${task.text}</div>
                    <div class="task-due-date">${task.dueDate || 'No Date'}</div>
                    <div class="task-status">${task.completed? 'Completed' : 'Active'}</div>
                    <div class="actions-buttons">
                        <button class="action-btn delete-btn" data-id="${task.id}" aria-label="Delete task">&#x2715;</button>
                    </div>
                `;
                taskList.appendChild(taskElement);
            });
        }
    }

    function addTask(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;

        if (!taskText) {
            alert('Please enter a task!');
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            dueDate: dueDate,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        taskInput.value = '';
        dueDateInput.value = '';
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id!== id);
        saveTasks();
        renderTasks();
    }

    function deleteAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    }

    function toggleFilter() {
        currentFilter = currentFilter === 'all'? 'active' : 'all';
        filterBtn.textContent = currentFilter === 'all'? 'FILTER' : 'SHOW ALL';
        renderTasks();
    }

    // Event Listeners
    addTaskForm.addEventListener('submit', addTask);
    deleteAllBtn.addEventListener('click', deleteAllTasks);
    filterBtn.addEventListener('click', toggleFilter);

    taskList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const taskId = event.target.dataset.id;
            deleteTask(taskId);
        }
    });

    renderTasks();
});