from flask import Flask, request


from src.extensions.extensions import bcrypt, db, jwt, cors, socketio
import json

from src.routes.app_routes import user_blueprint
from src.sockets.web_sockets import initialize_sockets

app = Flask(__name__)
app.config.from_file("configs//configs.json", load=json.load)

db.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)
cors.init_app(app)
socketio.init_app(app, cors_allowed_origins="*")
app.register_blueprint(user_blueprint)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    initialize_sockets()

    socketio.run(app, allow_unsafe_werkzeug=True)