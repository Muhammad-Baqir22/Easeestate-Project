from flask import Blueprint, render_template, request, redirect, session, url_for
from app.db import get_db

bp = Blueprint('auth', __name__, url_prefix='/auth')

# Hardcoded admin credentials
ADMIN_EMAIL = 'admin@example.com'
ADMIN_PASSWORD = 'admin123'

@bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        db = get_db()
        db.execute(
            'INSERT INTO users (username, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
            (
                request.form['username'],
                request.form['email'],
                request.form['password'],
                request.form['phone'],
                request.form['address']
            )
        )
        db.commit()
        return redirect(url_for('auth.login'))
    return render_template('signup.html')

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        # Check if admin
        if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
            session['admin'] = True
            return redirect(url_for('admin.dashboard'))  # Adjust this route name as needed

        # Check normal user in DB
        db = get_db()
        user = db.execute(
            'SELECT * FROM users WHERE email = ? AND password = ?',
            (email, password)
        ).fetchone()
        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            session.permanent = True
            return redirect(url_for('properties.home'))
        else:
            return render_template('login.html', error="Invalid email or password.")
    return render_template('login.html')

@bp.route('/logout')
def logout():
    session.clear()
    return redirect('/')
