from src.extensions.extensions import db

class ChatHistoryItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    message = db.Column(db.String, nullable=False)
    sid = db.Column(db.String, nullable=False)
    full_name = db.Column(db.String, nullable=False)
    avatar = db.Column(db.String, nullable=False)

    def __init__(self, username, message, sid, full_name):
        self.username = username
        self.message = message
        self.sid = sid
        self.full_name = full_name

    def to_dict(self):
        return {
            "username": self.username,
            "message": self.message,
            "sid": self.sid,
            "avatar": self.avatar,
            "full_name": self.full_name
        }