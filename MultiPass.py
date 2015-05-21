# all the imports
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash

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
def hello():
    return render_template('layout.html')
    
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
        if request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('display_pass'))
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('display_pass'))
    
if __name__ == '__main__':
    app.run()