# Author: Prof. MM Ghassemi <ghassem3@msu.edu>
from flask import current_app as app
from flask import render_template, redirect, request, session, url_for, copy_current_request_context
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room, rooms, disconnect
from .utils.database.database  import database
from werkzeug.datastructures   import ImmutableMultiDict
from pprint import pprint
import json
import random
import functools
from . import socketio
db = database()


#######################################################################################
# AUTHENTICATION RELATED
#######################################################################################
def login_required(func):
    @functools.wraps(func)
    def secure_function(*args, **kwargs):
        if "email" not in session:
            return redirect(url_for("login", next=request.url))
        return func(*args, **kwargs)
    return secure_function

def getUser():
	return db.reversibleEncrypt('decrypt', session['email']) if 'email' in session else 'Unknown'

@app.route('/login')
def login():
	return render_template('login.html', user=getUser(), attempt=db.attempts)

@app.route('/logout')
def logout():
	session.pop('email', default=None)
	return redirect('/')

@app.route('/processlogin', methods = ["POST","GET"])
def processlogin():
	form_fields = dict((key, request.form.getlist(key)[0]) for key in list(request.form.keys()))
	if db.authenticate(form_fields['email'], form_fields['password']) == {'success' : 1}:
		session['email'] = db.reversibleEncrypt('encrypt', form_fields['email']) 
		return json.dumps({'success':1})
	else:
		print(db.attempts)
		return json.dumps(db.attempts)

#######################################################################################
# CHATROOM RELATED
#######################################################################################
@app.route('/chat')
@login_required
def chat():
    # Renders the chat page only if the user is logged in.
    return render_template('chat.html', user=getUser())

@socketio.on('joined', namespace='/chat')
def joined(message):
    # Handler for when a user joins the chat room.
    join_room('main')  # User joins a specific chat room called 'main'.
    # Emit a status message to all users in the room about the user joining.
    if getUser() == "owner@email.com":
        emit('status', {'msg': getUser() + ' has entered the room.', 'style': 'width: 100%;color:blue;text-align: right'}, room='main')
    else:
        emit('status', {'msg': getUser() + ' has entered the room.', 'style': 'width: 100%;color:gray;text-align: left'}, room='main')

@socketio.on('msgsend', namespace='/chat')
def msgsend(message):
    # Handles the event when a message is sent in the chat.
    join_room('main')  # Ensures the user is in the 'main' room before sending a message.
    # Emits the message to all users in the room with appropriate styling based on the user role.
    if getUser() == "owner@email.com":
        emit('status', {'msg': message, 'style': 'width: 100%;color:blue;text-align: right'}, room='main')
    else:
        emit('status', {'msg': message, 'style': 'width: 100%;color:gray;text-align: left'}, room='main')

@socketio.on('leave', namespace='/chat')
def left(message):
    # Handler for when a user leaves the chat.
    # If the user is the owner, it will say it is, and if it is the guest it will also sat it is.
    if getUser() == "owner@email.com":
        emit('status', {'msg': getUser() + ' has left the room.', 'style': 'width: 100%;color:blue;text-align: right'}, room='main')
    else:
        emit('status', {'msg': getUser() + ' has left the room.', 'style': 'width: 100%;color:gray;text-align: left'}, room='main')


#######################################################################################
# OTHER
#######################################################################################
@app.route('/')
def root():
	return redirect('/home')

@app.route('/home')
def home():
	print(db.query('SELECT * FROM users'))
	x = random.choice(['I love cherries.','I have milatary experience.','I sleep 11 hours a day.'])
	return render_template('home.html', user=getUser(), fun_fact = x)

@app.route("/static/<path:path>")
def static_dir(path):
    return send_from_directory("static", path)

@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

@app.route('/resume')
def resume():
	resume_data = db.getResumeData()
	pprint(resume_data)
	return render_template('resume.html', resume_data = resume_data)


@app.route('/projects')
def project():
	return render_template('projects.html')

@app.route('/piano')
def piano():
	return render_template('piano.html')

@app.route('/processfeedback', methods=['POST'])
def process_feedback():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        comment = request.form['comment']

        # Insert feedback data into the database
        db.query("INSERT INTO feedback (name, email, comment) VALUES (%s, %s, %s)", (name, email, comment))

        # Redirect to the feedback page to display all feedback
        return redirect('/processfeedback')
	
@app.route('/processfeedback')
def show_feedback():
    # Fetch all feedback from the feedback table
    feedback_data = db.query("SELECT * FROM feedback")

    # Render the feedback page template with the fetched feedback data
    return render_template('processfeedback.html', feedback_data=feedback_data)