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
    
def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()
        
@app.route("/")
def home():
    return render_template('home.html')
    
@app.route("/passwords")
def display_pass():
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    cur = g.db.execute('SELECT passGroup FROM users WHERE name = ?',
                       [session['username']])
    groups = cur.fetchall()
    cur = g.db.execute('SELECT name FROM type')
    types = cur.fetchall()
    pTypes = []
    for pType in types:
        pTypes += [pType[0]]
    pswds = []
    for group in groups:
        cur = g.db.execute('SELECT name, hostDomain, pass, type, note, passGroup FROM pswds WHERE passGroup = ?',
                           [group[0]])
        temp = cur.fetchall()
        print temp
        length = len(temp)
        edit = map(list, temp)
        while length > 0:
            length -= 1
            edit[length][3] = pTypes[edit[length][3]]
        temp = tuple(tuple(i) for i in edit)
        pswds += temp
    return render_template('show_passwords.html', pswds=pswds)

@app.route('/add', methods=['GET', 'POST'])
def add_pass():
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    if request.method == 'POST':
        print "POST"
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

@app.route('/add/get', methods=['POST'])
def get_user():
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    cur = g.db.execute('SELECT * FROM users WHERE name = ? AND passGroup = ?',
                       [session['username'], request.form['group']])
    data = cur.fetchone()
    return json.dumps(data)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        cur = g.db.execute('SELECT pass FROM login WHERE email = ?',
                           [request.form['username']])
        pswd = cur.fetchone()
        if(pswd != None):
            if request.form['password'] != pswd[0]:
                error = {'error': 'Invalid password'}
            else:
                session['logged_in'] = True
                session['username'] = request.form["username"]
                flash('You were logged in')
                return url_for('display_pass')
        else:
            error = {'error': 'Invalid username'}
        return jsonify(error)
    return render_template('login.html', error=error)

@app.route('/login/get', methods=['POST'])
def get_salt():
    error = None
    if request.method == 'POST':
        cur = g.db.execute('SELECT salt FROM login WHERE email = ?',
                           [request.form['username']])
        pswd = cur.fetchone()
        if(pswd != None):
            return pswd[0]
        else:
            error = {'error': 'Invalid username'}
            return jsonify(error)
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    session.pop('username', None)
    flash('You were logged out')
    return redirect(url_for('home'))
    
@app.route('/share', methods=['GET', 'POST'])
def share():
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    if request.method == 'POST':
        cur = g.db.execute('SELECT passGroup FROM users WHERE name = ?',
                           [request.form["username"]])
        groups = cur.fetchone()
        cur = g.db.execute('SELECT pvKey, pubKey, salt FROM users WHERE passGroup = ?',
                           [groups[0]])
        data = cur.fetchone()
        g.db.execute('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)',
                     [request.form["username"], data[0], data[1],
                      request.form["group"], request.form["GKey"],
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

@app.route('/share/get', methods=['POST'])
def transfer():
    if not session.get('logged_in'):
        return redirect(url_for('home'))
    if request.method == 'POST':
        cur = g.db.execute('SELECT gKey, pvKey FROM users WHERE name = ? AND passGroup = ?',
                           [session['username'], request.form["group"]])
        data = cur.fetchone()
        cur = g.db.execute('SELECT pubKey FROM users WHERE name = ?',
                           [request.form["username"]])
        data += cur.fetchone()
        return json.dumps(data)
    return jsonify(None)
        
    
@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        cur = g.db.execute('SELECT * FROM login WHERE email = ?',
                           [request.form["email"]])
        check = cur.fetchone()
        if(check != None):
            error = {'error': 'There is already a registered user with that email.'}
            return jsonify(error)
        else:
            g.db.execute('INSERT INTO login VALUES (?, ?, ?, ?, ?)',
                         [request.form["first_name"], request.form["last_name"],
                         request.form["email"], request.form["password"],
                         request.form["salt"]])
            cur = g.db.execute('SELECT MAX(passGroup) FROM users')
            num = cur.fetchone()
            num = num[0]
            if(num == None):
                num = 0
            else:
                num += 1
            g.db.execute('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)',
                         [request.form["email"], request.form["pKey"],
                         request.form["pubKey"], num, request.form["gKey"],
                         request.form["kSalt"]])
            g.db.commit()
            session['logged_in'] = True
            session['username'] = request.form["email"]
            flash('You were logged in')
            return url_for('display_pass')
    return render_template('home.html', error=error)
    
if __name__ == '__main__':
    app.run()