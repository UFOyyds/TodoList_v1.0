document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const newTodoInput = document.getElementById('new-todo');
    const addTodoButton = document.getElementById('add-todo');

    // 初始待办事项
    const initialTodos = [
        '完成刘大傻待办的草稿',
        '给Mix-Cursor-交流001群汇报展示',
        '滚到单位上晚班'
    ];

    let draggedItem = null;

    function createTodoElement(todoText) {
        const li = document.createElement('li');
        li.draggable = true;
        li.innerHTML = `
            <span class="todo-text">${todoText}</span>
            <button class="toggle-todo">完成</button>
            <button class="delete-todo">删除</button>
        `;
        li.addEventListener('dragstart', dragStart);
        li.addEventListener('dragend', dragEnd);
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
            if (todoText.classList.contains('completed')) {
                e.target.textContent = '恢复';
            } else {
                e.target.textContent = '完成';
            }
        } else if (e.target.classList.contains('delete-todo')) {
            const li = e.target.parentElement;
            li.style.transition = 'opacity 0.3s ease-in-out';
            li.style.opacity = '0';
            setTimeout(() => {
                li.remove();
            }, 300);
        }
    });

    // 拖拽相关函数
    function dragStart(e) {
        draggedItem = this;
        setTimeout(() => {
            this.style.opacity = '0.5';
        }, 0);
    }

    function dragEnd() {
        setTimeout(() => {
            this.style.opacity = '1';
            draggedItem = null;
        }, 0);
    }

    function dragOver(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(todoList, e.clientY);
        const currentElement = draggedItem;
        if (afterElement == null) {
            todoList.appendChild(draggedItem);
        } else {
            todoList.insertBefore(draggedItem, afterElement);
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    todoList.addEventListener('dragover', dragOver);

    // 添加初始待办事项
    initialTodos.forEach(todo => addTodo(todo));
});
