import sqlite3 as sql

def insertUser(connection):
	c = connection.cursor()
	c.execute("INSERT INTO users VALUES(?, ?, ?, ?, ?)", ('Kyle', '1k23lhr12kj3h', 'lkj12l3kjrkl', 1, '32j1kh4kj2h3ir'))
	connection.commit()

def remove(connection):
	c = connection.cursor()
	c.execute("DELETE FROM users WHERE name='Kyle'")
	connection.commit()

con = sql.connect("user.db")

c = con.cursor()
remove(con)
insertUser(con)

c.execute("SELECT * FROM users")
print c.fetchone()
con.close()

