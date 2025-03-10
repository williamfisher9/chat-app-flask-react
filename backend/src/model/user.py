from src.extensions.extensions import db
import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email_address = db.Column(db.String, nullable=False, unique=True)
    user_id = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    avatar = db.Column(db.String, nullable=False)
    user_verified = db.Column(db.Boolean, default=False)
    password_reset_token = db.Column(db.String, nullable=True)
    user_verification_token = db.Column(db.String, nullable=True)
    creation_date = db.Column(db.DateTime, default=datetime.datetime.now)
    password_last_update_date = db.Column(db.DateTime, default=datetime.datetime.now)

    def __init__(self, email_address, password, first_name, last_name):
        self.email_address = email_address
        self.password = password
        self.first_name = first_name
        self.last_name = last_name

    def to_dict(self):
        return {
            "email_address": self.email_address,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "user_id": self.user_id,
            "avatar": self.avatar,
            "user_verified": self.user_verified,
            "creation_date": self.creation_date
        }