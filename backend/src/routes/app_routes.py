from flask import Blueprint, request
from flask_socketio import emit

from src.extensions.extensions import db, bcrypt, socketio
from src.messages.response_message import ResponseMessage
from src.model.user import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

import uuid

user_blueprint = Blueprint("user_blueprint", url_prefix="/api/v1/users", import_name=__name__)

@user_blueprint.route("/signup", methods=['POST'])
def register_user():
    data = request.get_json()
    user = User(data["email_address"], bcrypt.generate_password_hash(data["password"]), data["first_name"], data["last_name"])

    user.user_id = f"user_{str(uuid.uuid4()).replace('-', '')}"

    db.session.add(user)
    db.session.commit()

    response_message = ResponseMessage("Created successfully", 201)
    return response_message.create_response_message(), 201

@user_blueprint.route("/signin", methods=['POST'])
def login_user():
    data = request.get_json()

    user = User.query.filter_by(email_address=data["email_address"]).first()

    if not user:
        response_message = ResponseMessage("Username was not found", 404)
        return response_message.create_response_message(), 404

    if not bcrypt.check_password_hash(user.password, data["password"]):
        response_message = ResponseMessage("Invalid username/password", 400)
        return response_message.create_response_message(), 400

    response_message = ResponseMessage({"token": create_access_token(user.email_address),
                                        "email_address": user.email_address,
                                        "user_id": user.user_id}, 200)
    return response_message.create_response_message(), 200

@user_blueprint.route("home", methods=['GET'])
@jwt_required()
def get_user_home():
    user_identity = get_jwt_identity()
    return user_identity, 200

@user_blueprint.route("validate-jwt-token", methods=['GET'])
@jwt_required()
def validate_jwt_token():
    response_message = ResponseMessage("Invalid username/password", 200)
    return response_message.create_response_message(), 200





"""
@user_blueprint.route("/send", methods=['POST'])
@jwt_required()
def send_message_to_others():
    msg = request.get_json()
    print(msg)

    print(request.headers)
    print(msg)
    print()
    socketio.emit("new_message",
         {"username": "ttttttttttttt",
          "avatar": "aaaaaaaaaaaaa",
          "message": "123",
          "sid": "msg"},
         )



    response_message = ResponseMessage("Created successfully", 201)
    return response_message.create_response_message(), 201



"""