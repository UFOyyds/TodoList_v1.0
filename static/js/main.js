const socket = io();

const todoList = document.getElementById('todo-list');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const content = todoInput.value.trim();
    if (content) {
        fetch('/add_todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `content=${encodeURIComponent(content)}`,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                todoInput.value = '';
                addTodoToList(data.todo);
            }
        });
    }
});

function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item flex items-center justify-between p-2 border-b ${todo.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', todo.id);
    li.innerHTML = `
        <span class="flex-grow">${todo.content}</span>
        <button class="toggle-todo px-2 py-1 bg-blue-500 text-white rounded mr-2">Toggle</button>
        <button class="delete-todo px-2 py-1 bg-red-500 text-white rounded">Delete</button>
    `;
    return li;
}

function addTodoToList(todo) {
    const todoElement = createTodoElement(todo);
    todoList.insertBefore(todoElement, todoList.firstChild);
}

function updateTodoInList(todo) {
    const todoElement = todoList.querySelector(`[data-id="${todo.id}"]`);
    if (todoElement) {
        todoElement.className = `todo-item flex items-center justify-between p-2 border-b ${todo.completed ? 'completed' : ''}`;
        todoElement.querySelector('span').textContent = todo.content;
    }
}

function removeTodoFromList(todoId) {
    const todoElement = todoList.querySelector(`[data-id="${todoId}"]`);
    if (todoElement) {
        todoElement.remove();
    }
}

todoList.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;

    const todoId = todoItem.getAttribute('data-id');

    if (e.target.classList.contains('toggle-todo')) {
        fetch(`/update_todo/${todoId}`, { method: 'POST' });
    } else if (e.target.classList.contains('delete-todo')) {
        fetch(`/delete_todo/${todoId}`, { method: 'POST' });
    }
});

socket.on('new_todo', (todo) => {
    addTodoToList(todo);
});

socket.on('update_todo', (todo) => {
    updateTodoInList(todo);
});

socket.on('delete_todo', (data) => {
    removeTodoFromList(data.id);
});

socket.on('init_todos', (todos) => {
    todoList.innerHTML = '';
    todos.forEach(todo => addTodoToList(todo));
});
