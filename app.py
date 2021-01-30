from flask import Flask, render_template, request, redirect, session
from flask_socketio import SocketIO, join_room, leave_room, emit

app = Flask(__name__)

app.debug = True
app.secret_key = 'secret'

local = (__name__ == '__main__')

socket = SocketIO(app, manage_session=False)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/temp')
def bar():
    lis = open('static/emojis.txt').readlines()
    return render_template('setting.html', session=session, emojis_names = lis)


@app.route('/enter/<room>')
def foo(room):   
    return render_template('enter.html', room=room)


@app.route('/add')  # add?user=Rayyan&room=Room
def enter():
    room = request.args.get('room','Ming')
    user = request.args.get('user','Someone')
    return redirect(f'/join/{user}/{room}')


@app.route('/join/<user>/<room>')
def link(user, room):
    session['username'] = user or 'Someone'
    session['room'] = room or 'Ming'
    return redirect('/chat')


@app.route('/chat', methods=['GET', 'POST'])
def chat():

    if request.method=='POST':  
        #Store the data in session
        session['username'] = request.form['username']
        session['room'] = request.form['room']

    elif request.method=='GET':        
        if 'username' not in session: return redirect('/')

    protcl = 'http' if local else 'https'

    return render_template('chat.html',
                           session = session,
                           protcl  = protcl,
                           )
    

@socket.on('join', namespace='/chat')
def join(message):
    room = session.get('room', 'Ming')
    user =  session.get('username', 'Someone') 
    join_room(room)
    emit('status', {'msg': user + ' joined the room.'}, room=room)


@socket.on('text', namespace='/chat')
def text(message):
    room = session.get('room')
    text = message['msg'].replace('\n','<br>')
    emit('message', {'msg': text, 'user':session.get('username')}, room=room)


@socket.on('left', namespace='/chat')
def left(message):
    room = session.get('room')
    username = session.get('username')
    
    leave_room(room)
    session.clear()
    emit('status', {'msg': username + ' left.'}, room=room)



if __name__=='__main__':
    socket.run(app, debug=True, port=9999)

    import webbrowser
    webbrowser.open('https://127.0.0.1:9999/')