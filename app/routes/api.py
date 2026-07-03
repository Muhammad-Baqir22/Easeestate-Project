from flask import Blueprint, request, session, jsonify, current_app, send_from_directory
from app.db import get_db
from app.utils import allowed_file
from werkzeug.utils import secure_filename
import os

bp = Blueprint('api', __name__, url_prefix='/api')


# ─── Auth ─────────────────────────────────────────────────────────────────────

@bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    db = get_db()
    try:
        db.execute(
            'INSERT INTO users (username, email, password, phone, address) VALUES (?, ?, ?, ?, ?)',
            (data['username'], data['email'], data['password'], data.get('phone', ''), data.get('address', ''))
        )
        db.commit()
        return jsonify({'status': 'ok', 'message': 'Registered successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400


@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    db = get_db()
    user = db.execute(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        (data['email'], data['password'])
    ).fetchone()
    if user:
        session['user_id'] = user['id']
        session['username'] = user['username']
        session.permanent = True
        return jsonify({
            'status': 'ok',
            'user': {'id': user['id'], 'username': user['username'], 'email': user['email']}
        })
    return jsonify({'status': 'error', 'message': 'Invalid email or password'}), 401


@bp.route('/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'status': 'ok'})


@bp.route('/auth/me', methods=['GET'])
def me():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'Not logged in'}), 401
    db = get_db()
    user = db.execute('SELECT id, username, email, phone, address, profile_image FROM users WHERE id = ?', (user_id,)).fetchone()
    if not user:
        return jsonify({'status': 'error', 'message': 'User not found'}), 404
    return jsonify({'status': 'ok', 'user': dict(user)})


# ─── Properties ───────────────────────────────────────────────────────────────

def enrich(props, db):
    result = []
    for prop in props:
        p = dict(prop)
        images = db.execute('SELECT filename FROM property_images WHERE property_id = ?', (p['id'],)).fetchall()
        p['images'] = [img['filename'] for img in images]
        result.append(p)
    return result


@bp.route('/properties', methods=['GET'])
def list_properties():
    prop_type = request.args.get('type', 'sale')
    db = get_db()
    props = db.execute("SELECT * FROM properties WHERE property_type = ? ORDER BY created_at DESC", (prop_type,)).fetchall()
    return jsonify({'status': 'ok', 'properties': enrich(props, db)})


@bp.route('/properties/<int:prop_id>', methods=['GET'])
def get_property(prop_id):
    db = get_db()
    prop = db.execute('SELECT * FROM properties WHERE id = ?', (prop_id,)).fetchone()
    if not prop:
        return jsonify({'status': 'error', 'message': 'Not found'}), 404
    p = dict(prop)
    p['owner_id'] = p['user_id']
    images = db.execute('SELECT filename FROM property_images WHERE property_id = ?', (prop_id,)).fetchall()
    p['images'] = [img['filename'] for img in images]

    messages = db.execute('''
        SELECT m.*, u.username as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.property_id = ?
        ORDER BY m.timestamp ASC
    ''', (prop_id,)).fetchall()
    p['messages'] = [dict(m) for m in messages]

    return jsonify({'status': 'ok', 'property': p})


@bp.route('/properties', methods=['POST'])
def create_property():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401

    db = get_db()
    title       = request.form.get('title')
    description = request.form.get('description')
    location    = request.form.get('location')
    colony      = request.form.get('colony')
    size        = request.form.get('size')
    price       = request.form.get('price')
    prop_type   = request.form.get('property_type', 'sale')
    category    = request.form.get('category', '')
    images      = request.files.getlist('images')

    db.execute('''
        INSERT INTO properties (user_id, title, description, location, colony, size, price, property_type, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, title, description, location, colony, size, price, prop_type, category))
    db.commit()

    prop_id = db.execute('SELECT last_insert_rowid()').fetchone()[0]

    for img in images:
        if img and allowed_file(img.filename):
            filename = secure_filename(img.filename)
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            img.save(filepath)
            db.execute('INSERT INTO property_images (property_id, filename) VALUES (?, ?)', (prop_id, filename))

    db.commit()
    return jsonify({'status': 'ok', 'property_id': prop_id})


@bp.route('/properties/<int:prop_id>', methods=['PUT'])
def update_property(prop_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401

    db = get_db()
    price = request.form.get('price')
    location = request.form.get('location')
    description = request.form.get('description')
    prop_type = request.form.get('property_type')
    size = request.form.get('size')

    db.execute('''
        UPDATE properties SET price = ?, location = ?, description = ?, property_type = ?, size = ?
        WHERE id = ? AND user_id = ?
    ''', (price, location, description, prop_type, size, prop_id, user_id))
    db.commit()
    return jsonify({'status': 'ok'})


@bp.route('/properties/<int:prop_id>', methods=['DELETE'])
def delete_property(prop_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
    db = get_db()
    db.execute('DELETE FROM properties WHERE id = ? AND user_id = ?', (prop_id, user_id))
    db.commit()
    return jsonify({'status': 'ok'})


@bp.route('/search', methods=['GET'])
def search():
    db = get_db()

    # sale/rent type
    prop_type = request.args.get('type', '').strip()

    # text filters
    city    = request.args.get('city', '').strip()
    location= request.args.get('location', '').strip()
    colony  = request.args.get('colony', '').strip()

    # multi-value filters — frontend sends repeated keys: size=5-marla&size=10-marla
    sizes      = [s for s in request.args.getlist('size')      if s.strip()]
    categories = [c for c in request.args.getlist('category')  if c.strip()]

    # price range — ignore empty strings
    min_price = request.args.get('min_price', '').strip()
    max_price = request.args.get('max_price', '').strip()
    min_price = float(min_price) if min_price else None
    max_price = float(max_price) if max_price else None

    query  = 'SELECT * FROM properties WHERE 1=1'
    params = []

    # always filter by sale/rent
    if prop_type in ('sale', 'rent'):
        query += ' AND LOWER(property_type) = ?'
        params.append(prop_type)

    # city / location (same column, prefer city when both present)
    search_loc = city or location
    if search_loc:
        query += ' AND LOWER(location) LIKE ?'
        params.append(f'%{search_loc.lower()}%')

    if colony:
        query += ' AND LOWER(colony) LIKE ?'
        params.append(f'%{colony.lower()}%')

    if sizes:
        placeholders = ', '.join(['?' ] * len(sizes))
        query += f' AND LOWER(size) IN ({placeholders})'
        params.extend([s.lower() for s in sizes])

    if categories:
        placeholders = ', '.join(['?'] * len(categories))
        query += f' AND LOWER(category) IN ({placeholders})'
        params.extend([c.lower() for c in categories])

    if min_price is not None:
        query += ' AND price >= ?'
        params.append(min_price)

    if max_price is not None:
        query += ' AND price <= ?'
        params.append(max_price)

    results = db.execute(query, params).fetchall()
    return jsonify({'status': 'ok', 'properties': enrich(results, db)})


# ─── Profile ──────────────────────────────────────────────────────────────────

@bp.route('/profile', methods=['GET'])
def get_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
    db = get_db()
    user = db.execute('SELECT id, username, email, phone, address, profile_image FROM users WHERE id = ?', (user_id,)).fetchone()
    return jsonify({'status': 'ok', 'user': dict(user)})


@bp.route('/profile', methods=['PUT'])
def update_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
    db = get_db()
    username = request.form.get('username')
    email = request.form.get('email')
    phone = request.form.get('phone')
    address = request.form.get('address')
    profile_pic = request.files.get('profile_pic')

    db.execute('UPDATE users SET username = ?, email = ?, phone = ?, address = ? WHERE id = ?',
               (username, email, phone, address, user_id))

    if profile_pic and allowed_file(profile_pic.filename):
        filename = secure_filename(profile_pic.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        profile_pic.save(filepath)
        db.execute('UPDATE users SET profile_image = ? WHERE id = ?', (filename, user_id))

    db.commit()
    return jsonify({'status': 'ok'})


@bp.route('/myproperties', methods=['GET'])
def my_properties():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
    db = get_db()
    props = db.execute('SELECT * FROM properties WHERE user_id = ? ORDER BY created_at DESC', (user_id,)).fetchall()
    return jsonify({'status': 'ok', 'properties': enrich(props, db)})


# ─── Chat ─────────────────────────────────────────────────────────────────────

@bp.route('/chat/send', methods=['POST'])
def send_message():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
    data = request.get_json()
    db = get_db()
    db.execute(
        'INSERT INTO messages (sender_id, receiver_id, property_id, message) VALUES (?, ?, ?, ?)',
        (user_id, data['receiver_id'], data['property_id'], data['message'])
    )
    db.commit()
    return jsonify({'status': 'ok'})


@bp.route('/chat/inbox', methods=['GET'])
def inbox():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
    db = get_db()
    conversations = db.execute('''
        SELECT m.*, u.username as sender_name, p.title as property_title
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        JOIN properties p ON m.property_id = p.id
        WHERE m.receiver_id = ?
        ORDER BY m.timestamp DESC
    ''', (user_id,)).fetchall()
    return jsonify({'status': 'ok', 'messages': [dict(c) for c in conversations]})


@bp.route('/chat/<int:property_id>/<int:receiver_id>', methods=['GET'])
def get_chat(property_id, receiver_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'status': 'error', 'message': 'Not authenticated'}), 401
    db = get_db()
    messages = db.execute('''
        SELECT m.*, u.username as sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.property_id = ?
          AND ((m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?))
        ORDER BY m.timestamp ASC
    ''', (property_id, user_id, receiver_id, receiver_id, user_id)).fetchall()
    return jsonify({'status': 'ok', 'messages': [dict(m) for m in messages]})


# ─── Static uploads ───────────────────────────────────────────────────────────

@bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(current_app.root_path, 'static', 'uploads'), filename)
