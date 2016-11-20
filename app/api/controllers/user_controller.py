from flask import  Response
import json

from .. import bp
from ..models.user_model import User

@bp.route('/user/', methods=['GET'])
def get_user():
    users_json = json.dumps([user.to_dict() for user in User.query.all()])
    response = {
        "response"  : users_json,
        "status"    : 200,
        "mimetype"  : 'application/json'
    }
    return Response(**response)

@bp.route('/user/<username>', methods=['POST'])
def post_user(username):
    user = User(username)
    if not user.exists():
        user.create()
        message = "User {0} created.".format(username)
        response = Response(response=message, status = 201)
    else:
        message = "User {0} already exists.".format(username)
        response = Response(response=message, status = 409)
    return response

@bp.route('/user/<username>', methods=['DELETE'])
def delete_user(username):
    user = User(username)
    if user.exists():
        user.delete()
        message = "Successful delete of user {0}".format(username)
        response = Response(response=message,status=200)
    else:
        message = "User {0} could not be found.".format(username)
        response = Response(response=message,status=404)

    return response