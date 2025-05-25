const { response } = require("express");

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskList = document.getElementById('task-list');
    const filterStatusSelect = document.getElementById('filter-status');


    const API_BASE_URL = 'http://127.0.0.1:8000/tasks';



    const showAlert = (message, type = 'info') => {
        alert(message);
        console.log(`Notification (${type}): ${message}`);
    };


    // Function to get task and display it in the task list
    async function fetchTasks(filter = 'all') {
        let url = f`${API_BASE_URL}/`;
        if (filter === 'active') {
            url += '?completed=false';
        } else if (filter === 'completed') {
            url += '?completed=true';
        }

        try {
            const reposense = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching tasks: ${response.statusText}`);
            }
            const tasks = await reposense.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showAlert('Failed to fetch tasks. Please try again later.', 'error');

    }};

    // Function to render tasks in the task list
    function renderTasks(tasks) {
        taskList.innerHTML = '';

        if (tasks.length === 0) {
            taskList.innerHTML = '<li>No tasks available.</li>';
            return;
        }

        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.dataset.taskId = task.id;
            if (task.completed) {
                listItem.classList.add('completed');
            }
            
            const taskInfo = document.createElement('div');
            taskInfo.classList.add('task-info');

            const titleElement = document.createElement('h3');
            titleElement.textContent = task.title;
            if (task.completed) {
                titleElement.classList.add('completed-title');
            }

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = task.description || '';

            const createdAtElement = document.createElement('small');
            createdAtElement.textContent = `Created at: ${new Date(task.created_at).toLocaleString()}`;

            taskInfo.appendChild(titleElement);
            taskInfo.appendChild(descriptionElement);
            taskInfo.appendChild(createdAtElement);

            const taskActions = document.createElement('div');
            taskActions.classList.add('task-actions');

            const completeCheckbox = document.createElement('input');
            completeCheckbox.type = 'checkbox';
            completeCheckbox.checked = task.completed;
            completeCheckbox.addEventListener('change', () => toggleTaskCompletion(task.id, completeCheckbox.checked));

        });
    }



    function initializeApp() {
        fetchTasks(); 
    }

    initializeApp();
});