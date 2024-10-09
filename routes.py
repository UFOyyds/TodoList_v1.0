from flask import render_template, request, jsonify
from app import app, db, socketio
from models import Todo

@app.route('/')
def index():
    todos = Todo.query.order_by(Todo.created_at.desc()).all()
    return render_template('index.html', todos=todos)

@app.route('/add_todo', methods=['POST'])
def add_todo():
    content = request.form.get('content')
    if content:
        new_todo = Todo(content=content)
        db.session.add(new_todo)
        db.session.commit()
        socketio.emit('new_todo', new_todo.to_dict())
        return jsonify(success=True, todo=new_todo.to_dict())
    return jsonify(success=False, error="Content is required"), 400

@app.route('/update_todo/<int:todo_id>', methods=['POST'])
def update_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    todo.completed = not todo.completed
    db.session.commit()
    socketio.emit('update_todo', todo.to_dict(), broadcast=True)
    return jsonify(success=True, todo=todo.to_dict())

@app.route('/delete_todo/<int:todo_id>', methods=['POST'])
def delete_todo(todo_id):
    todo = Todo.query.get_or_404(todo_id)
    db.session.delete(todo)
    db.session.commit()
    socketio.emit('delete_todo', {'id': todo_id}, broadcast=True)
    return jsonify(success=True)

@socketio.on('connect')
def handle_connect():
    todos = Todo.query.order_by(Todo.created_at.desc()).all()
    socketio.emit('init_todos', [todo.to_dict() for todo in todos])
