from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail

bcrypt = Bcrypt()
db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
socketio = SocketIO()
mail = Mail()