from flask import  Response, request
import json

from .. import bp
from ..models.link_model import Link

@bp.route('/links', methods=['GET'])
def get_links():
    links_json = json.dumps([link.to_dict() for link in Link.query.all()])
    response = {
        "response"  : links_json,
        "status"    : 200,
        "mimetype"  : 'application/json'
    }
    return Response(**response)

@bp.route('/link', methods=['POST'])
def post_link():
    link = Link(**request.get_json())

    if link.is_valid() and link.user:
        link.create()
        # TODO: consider returning a json instead of a string
        response = Response(response=str(link.id), status = 200)   
    else:
        message = "Link field validation failed."
        response = Response(response=message, status = 400)
    return response

@bp.route('/link/<id>', methods=['PUT'])
def put_link(id):
    link = Link(**request.get_json())
    link.id = int(id)

    is_valid_link = link.is_valid() and link.id

    if is_valid_link and link.exists():
        link.update()
        message = "Successful edit of link id {0}".format(id)
        response = Response(response=message,status=200)
    elif not is_valid_link:
        message = "Request body missing mandatory fields"
        response = Response(response=message,status=400)
    else:
        message = "Link id {0} could not be found.".format(id)
        response = Response(response=message,status=404)

    return response
         
@bp.route('/link/<id>', methods=['DELETE'])
def delete_link(id):
    link = Link(id=int(id))

    if link.exists():
        link.delete()
        message = "Successful delete of link id {0}".format(id)
        response = Response(response=message,status=200)
    else:
        message = "Link id {0} could not be found.".format(id)
        response = Response(response=message,status=404)

    return response