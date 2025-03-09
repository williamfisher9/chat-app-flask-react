import jwt

from src.extensions.extensions import socketio, db
from flask import request
from flask_socketio import emit

from src.model.chat_history_item import ChatHistoryItem
from src.model.user import User
from src.utils.utils import verify_token

# store connected users
# key is socketid and value is username and avatar url
users = {}

connected_users={}

def initialize_sockets():
    # socketio will emit events to all connected users
    # events like connection, diconnection, changing username

    @socketio.on("authenticate")
    def handle_authenticate_user(msg):
        emit("set_username", {"username": "test123"}, broadcast=True)


    # handling connect event
    @socketio.on("connect")
    def handle_connect():
        user = User.query.filter_by(user_id=request.headers["username"]).first()

        username = request.headers["username"]
        full_name = f"{user.last_name}, {user.first_name}"
        #gender = random.choice(["girl", "boy"])
        avatar_url = f"https://avatar.iran.liara.run/username?username={user.first_name}+{user.last_name}"
        #users[request.sid] = {"username": username, "avatar": avatar_url, "sid": request.sid}
        connected_users[username] = {"id": user.id,
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
        for k, v in connected_users.items():
            print(k)
            print(v)
            if v["sid"] == request.sid:
                username = k

        connected_users.pop(username, None)
        #connected_users.pop(request.sid, None)

        emit("user_left", {"users": connected_users}, broadcast=True)

        #if user:
         #   emit("user_left", {"username": user["username"]}, broadcast=True)

    @socketio.on("send_message")
    def handle_send_message(msg):
        #print(request.args.get('token'))
        #print(verify_token(request.args.get('token')))
        user = connected_users.get(msg["username"])
        chat_history_item = ChatHistoryItem(msg["username"], msg["message"], msg["sid"], user["full_name"], msg["from_user"], msg["to_user"])
        chat_history_item.avatar = user["avatar"]
        db.session.add(chat_history_item)
        db.session.commit()
        if user:
            emit("new_message",
                 {"username": user["username"],
                  "full_name": user["full_name"],
                  "avatar": user["avatar"],
                  "message": msg["message"],
                  "sid": msg["sid"],
                  "from_user": msg["from_user"],
                  "to_user": msg["to_user"]},
                  broadcast=True
                 )

    @socketio.on("update_username")
    def handle_update_username(data):
        old_username = users[request.sid]["username"]
        new_username = data["username"]
        users[request.sid]["username"] = new_username

        emit("username_updated", {"old_username": old_username, "new_username": new_username}, broadcast=True)