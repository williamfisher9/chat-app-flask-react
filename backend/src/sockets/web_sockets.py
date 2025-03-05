from flask_jwt_extended import jwt_required, get_jwt_identity

from src.extensions.extensions import socketio
import random
from flask import request
from flask_socketio import emit
from flask_jwt_extended import verify_jwt_in_request

from src.model.user import User

# store connected users
# key is socketid and value is username and avatar url
users = {}

connected_users={}

def initialize_sockets():
    # socketio will emit events to all connected users
    # events like connection, diconnection, changing username

    @socketio.on("authenticate")
    def handle_authenticate_user(msg):
        print(msg)
        emit("set_username", {"username": "test123"}, broadcast=True)


    # handling connect event
    @socketio.on("connect")
    def handle_connect():
        #print(request.headers["authorization"])
        #print(request.headers["user"])

        user = User.query.filter_by(user_id=request.headers["username"]).first()

        print(user)

        username = request.headers["username"]
        full_name = f"{user.last_name}, {user.first_name}"
        gender = random.choice(["girl", "boy"])
        avatar_url = f"https://avatar.iran.liara.run/public/{gender}?username={username}"
        #users[request.sid] = {"username": username, "avatar": avatar_url, "sid": request.sid}
        connected_users[request.sid] = {"id": user.id,
                                        "username": username,
                                        "full_name": full_name,
                                        "avatar": avatar_url,
                                        "sid": request.sid}

        # notify all users
        emit("user_joined", {"users": connected_users}, broadcast=True)

        # notify all of username
        #emit("set_username", {"username": username})

    @socketio.on("disconnect")
    def handle_disconnect():
        print("disconnected")
        print(request.headers["username"])
        user = connected_users.pop(request.sid, None)

        emit("user_left", {"users": connected_users}, broadcast=True)

        #if user:
         #   emit("user_left", {"username": user["username"]}, broadcast=True)

    @socketio.on("send_message")
    def handle_send_message(msg):
        print(request.headers["authorization"])
        print(request.headers["username"])
        print(msg)

        user = connected_users.get(request.sid)
        if user:
            emit("new_message",
                 {"username": user["username"],
                  "full_name": user["full_name"],
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