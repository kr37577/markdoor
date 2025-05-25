document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTitleInput = document.getElementById('task-title');
    const taskDescriptionInput = document.getElementById('task-description');
    const taskList = document.getElementById('task-list');
    const filterStatusSelect = document.getElementById('filter-status');
    const cancelEditButton = document.getElementById('cancel-edit-button');


    const API_BASE_URL = 'http://127.0.0.1:8000/tasks';



    const showAlert = (message, type = 'info') => {
        alert(message);
        console.log(`Notification (${type}): ${message}`);
    };


    

    // Function to get task and display it in the task list
    async function fetchTasks(filter = 'all') {
        let url = `${API_BASE_URL}/`;
        if (filter === 'active') {
            url += '?completed=false';
        } else if (filter === 'completed') {
            url += '?completed=true';
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching tasks: ${response.statusText}`);
            }
            const tasks = await response.json();
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

            const editButton = document.createElement('button');
            editButton.textContent = '編集';
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => handleEditTask(task));


            const deleteButton = document.createElement('button');
            deleteButton.textContent = '削除';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => deleteTask(task.id));


            taskActions.appendChild(completeCheckbox);
            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);
            


            listItem.appendChild(taskInfo);
            listItem.appendChild(taskActions);
            taskList.appendChild(listItem);
        });
    }


    // Function to toggle task completion status
    async function toggleTaskCompletion(taskId, completed) {
        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: completed }),
            });

            if (!response.ok) {
                errorData = await response.json().catch(() => ({detail: 'Unknown error'}));
                throw new Error(`Error updating task: ${errorData.detail || response.statusText}`);
            }

            fetchTasks(filterStatusSelect.value); // Refresh the task list
        } catch (error) {
            console.error('Error updating task:', error);
            showAlert('タスクのステータス更新に失敗しました。後でもう一度試してください。', 'error');
        }
    }

    // Function to delete a task
    async function deleteTask(taskId) {
        if (!confirm('本当にこのタスクを削除しますか？')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}/`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({detail: 'Unknown error'}));
                throw new Error(`Error deleting task: ${errorData.detail || response.statusText}`);
            }

            showAlert('タスクが削除されました。', 'success');
            fetchTasks(filterStatusSelect.value); // Refresh the task list
        } catch (error) {
            console.error('Error deleting task:', error);
            showAlert('タスクの削除に失敗しました。後でもう一度試してください。', 'error');
        }
    }


    // Function to handle task editing
    function handleEditTask(task) {
        taskTitleInput.value = task.title;
        taskDescriptionInput.value = task.description || '';

        const submitButton = document.getElementById('add-task-button');
        submitButton.textContent = 'タスクを更新';
        submitButton.dataset.editingTaskId = task.id;

        // Show cancel button
        cancelEditButton.style.display = 'inline-block';

        taskForm.scrollIntoView({ behavior: 'smooth' });
    }


    // Function to update a task
    async function updateTask(taskId, title, description) {
        try {
            const response = await fetch(`${API_BASE_URL}/${taskId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({detail: 'Unknown error'}));
                throw new Error(`Error updating task: ${errorData.detail || response.statusText}`);
            }

            showAlert('タスクが更新されました。', 'success');
            taskForm.reset();
            fetchTasks(filterStatusSelect.value); // Refresh the task list
        } catch (error) {
            console.error('Error updating task:', error);
            showAlert('タスクの更新に失敗しました。後でもう一度試してください。', 'error');
        }
    }
    
    // Function to reset the form to add mode
    function resetFormToAddMode() {
        const submitButton = document.getElementById('add-task-button');
        submitButton.textContent = 'タスクを追加';
        delete submitButton.dataset.editingTaskId;
        cancelEditButton.style.display = 'none';
        taskForm.reset();
    }
    cancelEditButton.addEventListener('click', resetFormToAddMode);
    filterStatusSelect.addEventListener('change', () => {
        fetchTasks(filterStatusSelect.value);
    });

    // Function to add a new task
    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const submitButton = document.getElementById('add-task-button');
        const editingTaskId = submitButton.dataset.editingTaskId;

        if (!title) {
            showAlert('タスクのタイトルを入力してください。', 'warning');
            return;
        }

        try {
            if (editingTaskId) {
                // Update existing task
                await updateTask(editingTaskId, title, description);
                resetFormToAddMode();
            } else {
                // Create new task
                const response = await fetch(`${API_BASE_URL}` + '/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ title, description }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({detail: 'Unknown error'}));
                    throw new Error(`Error creating task: ${errorData.detail || response.statusText}`);
                }

                const newTask = await response.json();
                showAlert('タスクが作成されました。', 'success');
                taskForm.reset();
            }
            
            fetchTasks(filterStatusSelect.value); // Refresh the task list
        } catch (error) {
            console.error('Error with task operation:', error);
            if (!editingTaskId) {
                showAlert('タスクの作成に失敗しました。後でもう一度試してください。', 'error');
            }
        }
    });


    function initializeApp() {
        fetchTasks(); 
    }

    initializeApp();
});