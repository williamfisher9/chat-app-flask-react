import datetime

from src.extensions.extensions import db

class ChatHistoryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    message = db.Column(db.String, nullable=False)
    sid = db.Column(db.String, nullable=False)
    full_name = db.Column(db.String, nullable=False)
    avatar = db.Column(db.String, nullable=False)
    from_user = db.Column(db.String, nullable=False)
    to_user = db.Column(db.String, nullable=False)
    message_creation_date = db.Column(db.DateTime, default=datetime.datetime.now)

    def __init__(self, username, message, sid, full_name, from_user, to_user):
        self.username = username
        self.message = message
        self.sid = sid
        self.full_name = full_name
        self.from_user = from_user
        self.to_user = to_user

    def to_dict(self):
        return {
            "username": self.username,
            "message": self.message,
            "sid": self.sid,
            "avatar": self.avatar,
            "full_name": self.full_name,
            "from_user": self.from_user,
            "to_user": self.to_user,
            "message_creation_date": self.message_creation_date
        }