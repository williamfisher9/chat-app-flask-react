from flask import Flask, request
from flask_socketio import SocketIO, emit
import random

from src.extensions.extensions import bcrypt, db, jwt
import json

from src.routes.app_routes import user_blueprint

app = Flask(__name__)
app.config.from_file("configs//configs.json", load=json.load)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

app.register_blueprint(user_blueprint)

socketio = SocketIO(app, cors_allowed_origins="*")


# store connected users
# key is socketid and value is username and avatar url
users = {}

# socketio will emit events to all connected users
# events like connection, diconnection, changing username

# handling connect event
@socketio.on("connect")
def handle_connect():
    print("connection request")
    username = f"User_{random.randint(1000, 9999)}"
    gender = random.choice(["girl", "boy"])
    avatar_url = f"https://avatar.iran.liara.run/public/{gender}?username={username}"
    users[request.sid] = {"username": username, "avatar": avatar_url}
    
    # notify all users
    emit("user_joined", {"username": username, "avatar": avatar_url}, broadcast=True)

    # notify all of username
    emit("set_username", {"username": username})
    
@socketio.on("disconnect")
def handle_disconnect():
    print("disconnected")
    user = users.pop(request.sid, None)
    if user:
        emit("user_left", {"username": user["username"]}, broadcast=True)
        
@socketio.on("send_message")
def handle_send_message(msg):
    print(msg)
    user = users.get(request.sid)
    if user:
        emit("new_message", 
             {"username": user["username"], 
              "avatar": user["avatar"], 
              "message": msg["message"], 
              "sid": msg["sid"]},
             broadcast=True             
             )
        
@socketio.on("update_username")
def handle_update_username(data):
    old_username = users[request.sid]["username"]
    new_username = data["username"]
    users[request.sid]["username"] = new_username
    
    emit("username_updated", {"old_username": old_username, "new_username": new_username}, broadcast=True)
    
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    socketio.run(app, allow_unsafe_werkzeug=True)