from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

bcrypt = Bcrypt()
db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()