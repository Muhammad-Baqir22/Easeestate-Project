import sqlite3
from flask import Blueprint, render_template, request, session, url_for, redirect , g
from app.db import get_db

bp = Blueprint('chat', __name__, url_prefix='/chat')

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect("real_estate.db")  
        g.db.row_factory = sqlite3.Row
    return g.db

@bp.route('/chatroom/<int:property_id>/<int:receiver_id>', methods=['GET', 'POST'])
def chatroom(property_id, receiver_id):
    db = get_db()

    # Check if user is logged in
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))

    # Insert new message if POST
    if request.method == 'POST':
        message = request.form['message']
        db.execute(
            "INSERT INTO messages (sender_id, receiver_id, property_id, message) VALUES (?, ?, ?, ?)",
            (session['user_id'], receiver_id, property_id, message)
        )
        db.commit()
        return redirect(url_for('chat.chatroom', property_id=property_id, receiver_id=receiver_id))

    # Fetch property info
    property_data = db.execute(
        "SELECT * FROM properties WHERE id = ?",
        (property_id,)
    ).fetchone()

    if property_data is None:
        return "Property not found", 404

    # Convert row to dict and add alias for owner_id
    property_data = dict(property_data)
    property_data['owner_id'] = property_data['user_id']

    # Fetch chat messages
    messages = db.execute('''
        SELECT m.*, u.username AS sender_name 
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.property_id = ? AND (
            (m.sender_id = ? AND m.receiver_id = ?) OR 
            (m.sender_id = ? AND m.receiver_id = ?)
        )
        ORDER BY m.timestamp ASC
    ''', (property_id, session['user_id'], receiver_id, receiver_id, session['user_id'])).fetchall()

    return render_template(
        'chat.html',
        messages=messages,
        receiver_id=receiver_id,
        property_id=property_id,
        owner_id=property_data['owner_id'],
        property=property_data
    )

@bp.route('/send_message', methods=['POST'])
def send_message():
    if 'user_id' not in session:
        return {'status': 'error', 'message': 'Login required'}, 403

    data = request.get_json()
    db = get_db()
    db.execute(
        "INSERT INTO messages (sender_id, receiver_id, property_id, message) VALUES (?, ?, ?, ?)",
        (session['user_id'], data['receiver_id'], data['property_id'], data['message'])
    )
    db.commit()
    return {'status': 'ok'}

@bp.route('/inbox')
def inbox():
    user_id = session.get('user_id')
    if not user_id:
        return redirect(url_for('auth.login'))

    db = get_db()
    query = """
        SELECT m1.*, u.username AS sender_name, p.title AS property_title
        FROM messages m1
        INNER JOIN (
            SELECT sender_id, property_id, MAX(timestamp) AS latest
            FROM messages
            WHERE receiver_id = ?
            GROUP BY sender_id, property_id
        ) m2 ON m1.sender_id = m2.sender_id 
              AND m1.property_id = m2.property_id
              AND m1.timestamp = m2.latest
        JOIN users u ON m1.sender_id = u.id
        JOIN properties p ON m1.property_id = p.id
        ORDER BY m1.timestamp DESC
    """
    messages = db.execute(query, (user_id,)).fetchall()
    
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return render_template('inbox.html', messages=messages, user = user)


