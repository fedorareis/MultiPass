# all the imports
import sqlite3
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
    cur = g.db.execute('SELECT name, hostDomain, pass, type, note FROM pswds WHERE passGroup = ?', '1')
    pswds = cur.fetchall()
    return render_template('show_passwords.html', pswds=pswds)
    #print cur.fetchall()

@app.route('/add', methods=['POST'])
def add_entry():
    if not session.get('logged_in'):
        abort(401)
    #g.db.execute('insert into entries (title, text) values (?, ?)',
    #             [request.form['title'], request.form['text']])
    #g.db.commit()
    print request.form 
    flash('New entry was successfully posted')
    return redirect(url_for('display_pass'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        cur = g.db.execute('SELECT pass FROM login WHERE email = ?', [request.form['username']])
        pswd = cur.fetchone()
        if(pswd != None):
            if request.form['password'] != pswd[0]:
                error = {'error': 'Invalid password'}
            else:
                session['logged_in'] = True
                flash('You were logged in')
                print "logged in"
                return url_for('display_pass')
        else:
            error = {'error': 'Invalid username'}
        print error
        return jsonify(error)
    return render_template('login.html', error=error)

@app.route('/login/get', methods=['POST'])
def get_salt():
    error = None
    if request.method == 'POST':
        cur = g.db.execute('SELECT salt FROM login WHERE email = ?', [request.form['username']])
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
    flash('You were logged out')
    return redirect(url_for('home'))
    
@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        cur = g.db.execute('SELECT * FROM login WHERE email = ?', [request.form["email"]])
        check = cur.fetchone()
        if(check != None):
            error = {'error': 'There is already a registered user with that email.'}
            return jsonify(error)
        else:
            g.db.execute('INSERT INTO login VALUES (?, ?, ?, ?, ?)',
                         [request.form["first_name"], request.form["last_name"], request.form["email"], request.form["password"], request.form["salt"]])
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
            flash('You were logged in')
            return url_for('display_pass')
    return render_template('home.html', error=error)
    
if __name__ == '__main__':
    app.run()