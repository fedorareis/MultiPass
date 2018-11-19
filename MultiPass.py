# all the imports
import sqlite3
import json
from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash, jsonify

# configuration
DATABASE = 'user.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = SECRET_KEY

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

@app.before_request
def before_request():
    g.db = connect_db()
    # TODO: setup a row_factory to return data as a json object

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

@app.route("/")
def home():
    if session.get('logged_in'):
        return redirect(url_for('display_pass'))
    return render_template('home.html')


@app.route("/passwords/")
def display_pass():
    """Get the passwords for the user and render the page with them"""

    # Check if the user is logged in, if not send them to the home page
    if not session.get('logged_in'):
        return redirect(url_for('home'))

    cur = g.db.execute("""SELECT p.`name`, p.`hostDomain`, p.`pass`, t.`name`, p.`note`, p.`passGroup`
                          FROM `pswds` AS p
                          LEFT JOIN `type` t ON t.`ID` = p.`type`
                          INNER JOIN `users` u ON u.`passGroup` = p.`passGroup`
                          WHERE u.`name` = ?
                          ORDER BY p.`passGroup` ASC""",
                        [session['username']])
    pswds = cur.fetchall()
    num = len(pswds)
    return render_template('show_passwords.html', pswds=json.dumps(pswds), keys=json.dumps(session["group"]), count=num)

@app.route('/add/', methods=['GET', 'POST'])
def add_pass():
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    if request.method == 'POST':
        cur = g.db.execute('SELECT MAX(ID) FROM pswds')
        num = cur.fetchone()
        num = num[0]
        if(num == None):
            num = 0
        else:
            num += 1
        cur = g.db.execute('SELECT ID FROM type WHERE name = ?',
                           [request.json["type"]])
        pType = cur.fetchone()
        if(pType != None):
            pType = pType[0]
        g.db.execute('INSERT INTO pswds VALUES (?, ?, ?, ?, ?, ?, ?)',
                     [num, request.json["name"], request.json["domain"],
                     request.json["pass"], request.json["group"],
                     pType, request.json["note"]])
        g.db.commit()
        flash('Password Added')
        return url_for('display_pass')
    else:
        cur = g.db.execute('SELECT name FROM type')
        types = cur.fetchall()
        cur = g.db.execute('SELECT passGroup FROM users WHERE name = ?',
                               [session['username']])
        groups = cur.fetchall()
        cur = g.db.execute('SELECT salt FROM users WHERE name = ?',
                           [session['username']])
        salt = cur.fetchone()
        flash('New entry was successfully posted')
        return render_template('add.html', types=types, groups=groups, salt=json.dumps(salt[0]))

@app.route('/add/get/', methods=['POST'])
def get_user():
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    groupKey = session['group'][request.json['group']]
    return json.dumps(groupKey)

@app.route('/login/', methods=['GET', 'POST'])
def login():
    if session.get('logged_in'):
        return redirect(url_for('display_pass'))
    error = None
    if request.method == 'POST':
        cur = g.db.execute('SELECT pass FROM login WHERE email = ?',
                           [request.json['username']])
        pswd = cur.fetchone()
        if(pswd != None):
            if request.json['password'] != pswd[0]:
                error = {'error': 'Invalid password'}
            else:
                cur = g.db.execute('SELECT passGroup FROM users WHERE name = ? ORDER BY passGroup ASC',
                               [request.json['username']])
                # Array of all the passGroups that the user belongs to.
                groupNum = cur.fetchall()
                session['logged_in'] = True
                session['username'] = request.json["username"]
                # Array of all the group keys for the user
                groups = request.json["groups"]
                # Map of all the complete keys
                keys = {}
                # an actual counter to iterate through the groupNums
                counter = 0
                # Loops through the keys and assigns them to the map with their groupNum.
                for group in groups:
                    keys[groupNum[counter][0]] = group
                    counter += 1
                session['group'] = keys
                flash('You were logged in')
                return redirect(url_for('display_pass')), 302
        else:
            error = {'error': 'Invalid username'}
        return jsonify(error)
    return render_template('login.html', error=error)

@app.route('/login/get/', methods=['POST'])
def get_salt():
    error = None
    if request.method == 'POST':
        username = request.json['username']
        cur = g.db.execute('SELECT salt FROM login WHERE email = ?',
                           [username])
        salt = cur.fetchone()
        if(salt != None):
            cur = g.db.execute('SELECT pvKey, gKey, salt FROM users WHERE name = ? ORDER BY passGroup ASC',
                               [username])
            data = cur.fetchall()
            return json.dumps({'salt': salt[0], 'data': data})
        else:
            error = {'error': 'Invalid username'}
            return jsonify(error)
    return render_template('login.html', error=error)

@app.route('/logout/')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    #session.pop('group', None)
    flash('You were logged out')
    return redirect(url_for('home'))

@app.route('/share/', methods=['GET', 'POST'])
def share():
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    if request.method == 'POST':
        cur = g.db.execute('SELECT passGroup FROM users WHERE name = ?',
                           [request.json["username"]])
        groups = cur.fetchone()
        cur = g.db.execute('SELECT pvKey, pubKey, salt FROM users WHERE passGroup = ?',
                           [groups[0]])
        data = cur.fetchone()
        g.db.execute('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)',
                     [request.json["username"], data[0], data[1],
                      request.json["group"], request.json["GKey"],
                      data[2]])
        g.db.commit()
        return url_for('display_pass')
    else:
        cur = g.db.execute('SELECT email FROM login WHERE NOT (email = ?)',
                           [session['username']])
        users = cur.fetchall()
        cur = g.db.execute('SELECT passGroup FROM users WHERE name = ?',
                           [session['username']])
        groups = cur.fetchall()
        cur = g.db.execute('SELECT salt FROM users WHERE name = ?',
                           [session['username']])
        salt = cur.fetchone()
        return render_template('share.html', users=users, groups=groups, salt=json.dumps(salt[0]))

@app.route('/share/get/', methods=['POST'])
def transfer():
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    if request.method == 'POST':
        cur = g.db.execute('SELECT gKey, pvKey FROM users WHERE name = ? AND passGroup = ?',
                           [session['username'], request.json["group"]])
        data = cur.fetchone()
        cur = g.db.execute('SELECT pubKey FROM users WHERE name = ?',
                           [request.json["username"]])
        data += cur.fetchone()
        return json.dumps(data)
    abort(405)


@app.route('/register/', methods=['GET', 'POST'])
def register():
    if session.get('logged_in'):
        return redirect(url_for('display_pass'))
    error = None
    if request.method == 'POST':
        # Check if a user is already registered with the email
        cur = g.db.execute('SELECT * FROM login WHERE email = ?',
                           [request.json["email"]])
        check = cur.fetchone()
        if(check != None):
            error = {'error': 'There is already a registered user with that email.'}
            return jsonify(error)
        else:
            # Add the user to the login table
            g.db.execute('INSERT INTO login VALUES (?, ?, ?, ?, ?)',
                         [request.json["first_name"], request.json["last_name"],
                         request.json["email"], request.json["password"],
                         str(request.json["salt"])])

            # Assign the user the next available password group
            cur = g.db.execute('SELECT MAX(passGroup) FROM users')
            num = cur.fetchone()
            num = num[0]
            if(num == None):
                num = 0
            else:
                num += 1

            # Add user the the users table
            g.db.execute('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)',
                         [request.json["email"], request.json["pKey"],
                         request.json["pubKey"], num, request.json["gKey"],
                         str(request.json["salt"])])
            g.db.commit()
            # an actual counter to iterate through the groupNums
            groupNum = num
            session['group'] = {groupNum: request.json["key"]}
            session['logged_in'] = True
            session['username'] = request.json["email"]
            return redirect(url_for('display_pass'))
    abort(405)
