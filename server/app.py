from flask import request, jsonify
from config import app, db
from models import Task, User


@app.route('/', methods=['GET',])
def index():
    try:
        tasks = Task.query.all()
        if not tasks:
            return jsonify({'message': 'There are no tasks currently. Create one now!'}), 404
        task_list = [{
            'id': task.id, 
            'content': task.content,
            'created_at': task.created_at.strftime("%Y/%m/%d %H:%M"), 
            'creator_id': task.creator_id, 
            'creator': task.creator.username, 
            "status": task.status
             } for task in tasks]
        return jsonify(task_list), 200
    except Exception as e:
        return jsonify({'message': f'Failed to fetch the tasks. Error: {str(e)}'}), 400


@app.route('/task/<int:id>', methods=['GET',])
def get_task(id):
    try:
        task = db.session.get(Task, id) #如果没查到返回 None
        if task is None:
            return jsonify({'message': 'Task Not Found'}), 404
        return jsonify({
            'id': task.id,
            'content': task.content,
            'status': task.status,
            'created_at': task.created_at.strftime("%Y/%m/%d %H:%M:%S"),
            'creator_id': task.creator_id,
            'creator': task.creator.username
        }), 200
    except Exception as e:
        return jsonify({'message': f'Failed to fetch the task. Error: {str(e)}'}), 400

# Get all the tasks that are created by the user
# Fetch data by creator_id
@app.route('/user/<int:id>', methods=['GET',])
def get_user(id):
    try:
        creator = db.session.get(User, id) #如果没查到返回 None
        if creator is None:
            return jsonify({'message': 'User Not Found'}), 404
        tasks = Task.query.filter_by(creator_id=id).all() # 如果没查到返回一个空列表而不是 None
        if not tasks:
            return jsonify({
            "creator": {
                "id": id,
                "name": creator.username
                },
            "tasks": []
            }), 200
        
        task_list = [{
            'id': task.id, 
            'content': task.content,
            'created_at': task.created_at.strftime("%Y/%m/%d %H:%M"), 
            'status': task.status,
             } for task in tasks]
        return jsonify({
            "creator": {
                "id": id,
                "name": creator.username
                },
            "tasks": task_list
            }), 200
    except Exception as e:
        return jsonify({'message': f'Failed to fetch the tasks. Error: {str(e)}'}), 400

@app.route('/add', methods=['POST',])
def add_task():
    data = request.get_json()
    username = data.get('username')
    content = data.get('content')
    # print(f'Content: {content}\nUsername: {username}')

    if not username or not content:
        return jsonify({'message': 'Input must not be empty'}), 400
    
    # 根据名字查找 id。如果名字不在数据库中，则增加此名字
    creator = User.query.filter_by(username=username.strip()).first() # 如果没查到则返回空值
    if not creator:
        creator = User(username=username.strip())
        try:
            db.session.add(creator)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({'message': f'Failed to create the new user. Error: {str(e)}'}), 400
    
    task = Task(content=content.strip(), creator_id=creator.id)
    try:
        db.session.add(task)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to add the task. Error: {str(e)}'}), 400
    return jsonify({"message": "Task created successfully"}), 201


@app.route('/edit/<int:id>', methods=['PATCH',])
def edit_task(id):
    # 根据id查询task表
    task = db.session.get(Task, id) #是一个对象
    # print(task)
    if task is None: #如果没查到
        return jsonify({'message': 'Task Not Found'}), 404
    
    data = request.get_json()
    # 暂时只允许修改内容和状态，不允许修改creator
    task.content = data.get('content', task.content)
    task.status = data.get('status', task.status)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Edit Task Failed. Error: {str(e)}'}), 400
    return jsonify({'message': 'Task succesfully Updated'}), 200


@app.route('/delete/<int:id>', methods=['DELETE',])
def delete_task(id):
    task = db.session.get(Task, id)
    # print(task)
    if task is None:
        return jsonify({'message': 'Task Not Found'}), 404
    try:
        db.session.delete(task)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Failed to delete the task. Error: {str(e)}'}), 400
    return jsonify({'message': 'Task Successfully Deleted'}), 200


@app.route('/users', methods=['GET',])
def get_users():
    query = request.args.get('q', default='')
    if not query:
        return jsonify({'message': 'No user specified'}), 400
    try:
        users = User.query.filter(User.username.ilike(f"{query}%")).all()
        if not users:
            return jsonify({'message': 'No users found'}), 404
        user_list = [user.username for user in users]
        return jsonify(user_list), 200
    except Exception as e:
        return jsonify({'message': f'Failed to fetch users. Error: {str(e)}'}), 400



if __name__ == '__main__':
    app.run()
