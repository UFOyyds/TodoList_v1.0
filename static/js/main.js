document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const newTodoInput = document.getElementById('new-todo');
    const addTodoButton = document.getElementById('add-todo');

    // 初始待办事项
    const initialTodos = [
        '完成项目报告',
        '准备周会演示',
        '回复重要邮件'
    ];

    function createTodoElement(todoText) {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="todo-text">${todoText}</span>
            <button class="toggle-todo">切换</button>
            <button class="delete-todo">删除</button>
        `;
        return li;
    }

    function addTodo(todoText) {
        const todoElement = createTodoElement(todoText);
        todoList.appendChild(todoElement);
        todoElement.style.opacity = '0';
        setTimeout(() => {
            todoElement.style.transition = 'opacity 0.3s ease-in-out';
            todoElement.style.opacity = '1';
        }, 10);
    }

    function handleAddTodo() {
        const todoText = newTodoInput.value.trim();
        if (todoText) {
            addTodo(todoText);
            newTodoInput.value = '';
        }
    }

    addTodoButton.addEventListener('click', handleAddTodo);

    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    });

    todoList.addEventListener('click', (e) => {
        if (e.target.classList.contains('toggle-todo')) {
            const todoText = e.target.parentElement.querySelector('.todo-text');
            todoText.classList.toggle('completed');
        } else if (e.target.classList.contains('delete-todo')) {
            const li = e.target.parentElement;
            li.style.transition = 'opacity 0.3s ease-in-out';
            li.style.opacity = '0';
            setTimeout(() => {
                li.remove();
            }, 300);
        }
    });

    // 添加初始待办事项
    initialTodos.forEach(todo => addTodo(todo));
});
