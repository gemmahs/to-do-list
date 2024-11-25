from config import db
from datetime import datetime
from sqlalchemy import CheckConstraint


# db.relationship: Defines the relationship on the parent side (User).
# 一个user对应多个tasks
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    tasks = db.relationship('Task', back_populates="creator", lazy='select')
    
    def __repr__(self):
        return f'<User {self.id} {self.username}>'


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False, default="unfinished")
    created_at = db.Column(db.DateTime, default=datetime.now)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    creator = db.relationship('User', back_populates="tasks")

    def __repr__(self):
        return f'<Task {self.id} {self.status} {self.creator.username}>'