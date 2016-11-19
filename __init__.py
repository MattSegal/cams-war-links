from flask import Flask, render_template, Response, request
import json
import database as db
import config

app = Flask(__name__)
app.config.from_object('config.Config')
base_url = '/links' if app.config['DEBUG'] else ''


# Setup Database
con = db.connection.Connection(app.config)
link_repo = db.link.LinkRepository(con)
user_repo = db.user.UserRepository(con)

@app.teardown_appcontext
def disconnect(exception):
    con.disconnect()

# Web Page
@app.route(base_url+'/')
def  links():
    return render_template('links.html')

# Links
@app.route(base_url+'/api/links', methods=['GET'])
def links_get():
    links = link_repo.get_all()
    links_json = json.dumps(links)
    response = {
        "response"  : links_json,
        "status"    : 200,
        "mimetype"  : 'application/json'
    }
    return Response(**response)

@app.route(base_url+'/api/link', methods=['POST'])
def links_post():
    new_link = request.get_json()

    if link_repo.validate_create(new_link):
        link_id = link_repo.create(new_link)
        # TODO: consider returning a json instead of a string
        response = Response(response=str(link_id), status = 200)   
    else:
        message = "Link field validation failed."
        response = Response(response=message, status = 400)
    return response

@app.route(base_url+'/api/link/<id>', methods=['PUT'])
def links_put(id):
    link_id = int(id)

    link = request.get_json()
    link['id'] = link_id

    is_valid_link = link_repo.validate_update(link)
    link_exists   = link_repo.check_exists(link_id)

    if is_valid_link and link_exists:
        link_repo.update(link)
        message = "Successful edit of link id {0}".format(link_id)
        response = Response(response=message,status=200)
    elif not is_valid_link:
        message = "Request body missing mandatory fields"
        response = Response(response=message,status=400)
    else:
        message = "Link id {0} could not be found.".format(link_id)
        response = Response(response=message,status=404)

    return response

         
@app.route(base_url+'/api/link/<id>', methods=['DELETE'])
def links_delete(id):
    link_id = int(id)
    link_exists = link_repo.check_exists(link_id)

    if link_exists:
        link_repo.delete(link_id)
        message = "Successful delete of link id {0}".format(link_id)
        response = Response(response=message,status=200)
    else:
        message = "Link id {0} could not be found.".format(link_id)
        response = Response(response=message,status=404)

    return response

# User
@app.route(base_url+'/api/user/', methods=['GET'])
def user_get():
    users = user_repo.get_all()
    users_json = json.dumps(users)
    response = {
        "response"  : users_json,
        "status"    : 200,
        "mimetype"  : 'application/json'
    }
    return Response(**response)

@app.route(base_url+'/api/user/<username>', methods=['POST'])
def user_post(username):
    user_exists = user_repo.check_exists(username)
    if not user_exists:
        user_repo.create(username)
        message = "User {0} created.".format(username)
        response = Response(response=message, status = 201)
    else:
        message = "User {0} already exists.".format(username)
        response = Response(response=message, status = 409)
    return response

@app.route(base_url+'/api/user/<username>', methods=['DELETE'])
def user_delete(username):
    user_exists = user_repo.check_exists(username)

    if user_exists:
        user_repo.delete(username)
        message = "Successful delete of user {0}".format(username)
        response = Response(response=message,status=200)
    else:
        message = "User {0} could not be found.".format(username)
        response = Response(response=message,status=404)

    return response

if __name__ == "__main__":
    app.run(host= '0.0.0.0')
