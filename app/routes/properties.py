from flask import Blueprint, render_template, request, redirect, session , url_for , current_app , send_from_directory , flash 
from app.db import get_db
from werkzeug.utils import secure_filename
import os
from app.utils import allowed_file


bp = Blueprint('properties', __name__)

@bp.route('/')
def index():
    db = get_db()
    props = db.execute("SELECT * FROM properties ORDER BY created_at DESC").fetchall()
    return render_template('index.html', properties=props)

@bp.route('/sale')
def sale():
    db = get_db()
    properties = db.execute("SELECT * FROM properties WHERE property_type = 'sale'").fetchall()

    # Attach images to each property
    enriched = []
    for prop in properties:
        images = db.execute("SELECT filename FROM property_images WHERE property_id = ?", (prop['id'],)).fetchall()
        enriched.append({**prop, 'images': [img['filename'] for img in images]})
    return render_template('buy.html', properties=enriched)

@bp.route('/rent')
def rent():
    db = get_db()
    props = db.execute("SELECT * FROM properties WHERE property_type = 'rent'").fetchall()

    enriched_props = []
    for prop in props:
        images = db.execute(
            "SELECT filename FROM property_images WHERE property_id = ?", (prop['id'],)
        ).fetchall()
        enriched_props.append({**prop, 'images': [img['filename'] for img in images]})

    return render_template('rent.html', properties=enriched_props)


@bp.route('/add', methods=['GET', 'POST'])
def add_sale():
    if request.method == 'POST':
        db = get_db()
        db.execute(
            "INSERT INTO properties (user_id, title, description, location, colony, size, price, property_type) VALUES (?, ?, ?, ?, ?, ?, ?, 'sale')",
            (
                session['user_id'],
                request.form['title'],
                request.form['description'],
                request.form['location'],
                request.form['colony'],
                request.form['size'],
                request.form['price']
            )
        )
        db.commit()
        return redirect('/sale')
    return render_template('sell.html')

@bp.route('/add_rent', methods=['GET', 'POST'])
def add_rent():
    if request.method == 'POST':
        db = get_db()
        title = request.form['title']
        description = request.form['description']
        location = request.form['location']
        colony = request.form['colony']
        size = request.form['size']
        price = request.form['price']
        images = request.files.getlist('images')

        # Save property data first
        db.execute("""
            INSERT INTO properties (user_id, title, description, location, colony, size, price, property_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'rent')
        """, (session['user_id'], title, description, location, colony, size, price))
        db.commit()

        prop_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]

        # Save each image
        for img in images:
            if img and allowed_file(img.filename):
                filename = secure_filename(img.filename)
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                img.save(filepath)

                db.execute("INSERT INTO property_images (property_id, filename) VALUES (?, ?)", (prop_id, filename))

        db.commit()
        return redirect(url_for('properties.rent'))

    return render_template('add_rent.html')


@bp.route('/property/<int:id>')
def detail(id):
    db = get_db()
    prop = db.execute("SELECT * FROM properties WHERE id = ?", (id,)).fetchone()

    if prop is None:
        return "Property not found", 404

    # Convert to dict
    prop = dict(prop)
    prop['owner_id'] = prop['user_id']

    return render_template('buyDetails.html', property=prop, user=session.get('user'))






@bp.route('/myproperties')
def myproperties():
    user_id = session.get('user_id')
    if not user_id:
        flash('Please log in to view your properties.')
        return redirect(url_for('auth.login'))  # Adjust 'auth.login' to your actual login route name

    db = get_db()
    props = db.execute(
        "SELECT * FROM properties WHERE user_id = ?", (user_id,)
    ).fetchall()
    
    return render_template('myproperty.html', properties=props)

@bp.route('/delete_property/<int:id>', methods=['POST'])
def delete_property(id):
    db = get_db()
    db.execute('DELETE FROM properties WHERE id = ? AND user_id = ?', (id, session['user_id']))
    db.commit()
    flash('Property deleted successfully.')
    return redirect(url_for('properties.myproperties'))


@bp.route('/update_property/<int:id>', methods=['GET', 'POST'])
def update_property(id):
    db = get_db()
    if request.method == 'POST':
        price = request.form['price']
        location = request.form['location']
        description = request.form['description']
        property_type = request.form.get('property-type')  # Note: Only gets one checkbox value
        property_size = request.form.get('size')

        db.execute("""
            UPDATE properties 
            SET price = ?, location = ?, description = ?, property_type = ?, size = ? 
            WHERE id = ? AND user_id = ?
        """, (price, location, description, property_type, property_size, id, session['user_id']))
        db.commit()
        flash('Property updated successfully!')
        return redirect(url_for('properties.myproperties'))

    # GET request: fetch property for editing
    prop = db.execute("SELECT * FROM properties WHERE id = ? AND user_id = ?", (id, session['user_id'])).fetchone()
    if prop is None:
        flash('Property not found or unauthorized access.')
        return redirect(url_for('properties.myproperties'))

    return render_template('update.html', property=prop)

@bp.route('/search', methods=['GET'])
def search():
    location = request.args.get('location', '').strip()  # Remove any extra spaces
    colony = request.args.get('colony', '').strip()  # Remove any extra spaces
    size = request.args.get('size', '').strip()  # Remove any extra spaces
    property_type = request.args.get('type', '').strip()  # Remove any extra spaces

    # Initialize the query with only the location filter
    db = get_db()
    query = """
        SELECT * FROM properties 
        WHERE LOWER(TRIM(location)) LIKE LOWER(TRIM(?))
    """
    params = [f"%{location}%"]

    # Test with location only, no other filters yet
    print("Testing location filter...")
    print("Query:", query)
    print("Params:", params)
    
    # Execute query and check results
    results = db.execute(query, params).fetchall()
    print(f"Results for location filter: {len(results)}")
    
    
    
    if results:
        return render_template('buy.html', properties=results)
    
    # If no results, progressively add more filters one by one
    if colony:
        query += " AND LOWER(TRIM(colony)) LIKE LOWER(TRIM(?))"
        params.append(f"%{colony}%")
        results = db.execute(query, params).fetchall()
        print(f"Results for location + colony filter: {len(results)}")
        if results:
            return render_template('buy.html', properties=results)
    
    if property_type:
        query += " AND LOWER(TRIM(property_type)) LIKE LOWER(TRIM(?))"
        params.append(f"%{property_type}%")
        results = db.execute(query, params).fetchall()
        print(f"Results for location + colony + property_type filter: {len(results)}")
        if results:
            return render_template('buy.html', properties=results)
    
    if size:
        query += " AND LOWER(TRIM(size)) LIKE LOWER(TRIM(?))"
        params.append(f"%{size}%")
        results = db.execute(query, params).fetchall()
        print(f"Results for all filters: {len(results)}")
        if results:
            return render_template('buy.html', properties=results)
    
    enriched_results = []
    for prop in results:
        images = db.execute("SELECT filename FROM property_images WHERE property_id = ?", (prop['id'],)).fetchall()
        
        # Ensure to format the image paths correctly
        image_filenames = [img['filename'] for img in images]
        
        # If there are no images, set a default image
        if not image_filenames:
            image_filenames = ['default-property.png']

        enriched_results.append({**prop, 'images': image_filenames})

    return render_template('buy.html', properties=results)







@bp.route('/search/advanced', methods=['GET'])
def advanced_search():
    db = get_db()

    city = request.args.get('city', '').strip()
    colony = request.args.get('colony', '').strip()
    sizes = request.args.getlist('size')
    types = request.args.getlist('type')
    min_price = request.args.get('min-price', type=float)
    max_price = request.args.get('max-price', type=float)
    purpose = request.args.get('purpose', 'sale').lower()  # 'sale' or 'rent'

    query = "SELECT * FROM properties WHERE LOWER(property_type) = ?"
    params = [purpose]

    if city:
        query += " AND LOWER(location) LIKE ?"
        params.append(f"%{city.lower()}%")

    if colony:
        query += " AND LOWER(colony) LIKE ?"
        params.append(f"%{colony.lower()}%")

    if sizes:
        query += " AND (" + " OR ".join(["LOWER(size) LIKE ?"] * len(sizes)) + ")"
        params.extend([f"%{s.lower()}%" for s in sizes])

    if types:
        query += " AND (" + " OR ".join(["LOWER(property_type) LIKE ?"] * len(types)) + ")"
        params.extend([f"%{t.lower()}%" for t in types])

    if min_price is not None:
        query += " AND price >= ?"
        params.append(min_price)

    if max_price is not None:
        query += " AND price <= ?"
        params.append(max_price)

    print("Final SQL Query:", query)
    print("With Parameters:", params)

    results = db.execute(query, params).fetchall()

    return render_template('buy.html' if purpose == 'sale' else 'rent.html', properties=results)




@bp.route('/post_sale', methods=['GET', 'POST'])
def post_sale():
    db = get_db()

    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        location = request.form['location']
        colony = request.form['colony']
        size = request.form['size']
        price = request.form['price']
        images = request.files.getlist('images')

        # Insert property
        db.execute(""" 
            INSERT INTO properties (user_id, title, description, location, colony, size, price, property_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'sale') 
        """, (session['user_id'], title, description, location, colony, size, price))
        db.commit()

        prop_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]

        # Save images
        for img in images:
            if img and allowed_file(img.filename):
                filename = secure_filename(img.filename)
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                img.save(filepath)

                db.execute("INSERT INTO property_images (property_id, filename) VALUES (?, ?)", (prop_id, filename))

        db.commit()

        return redirect(url_for('properties.sale'))

    # ➔ GET request: load user for template
    user = db.execute('SELECT * FROM users WHERE id = ?', (session['user_id'],)).fetchone()
    return render_template('sell.html', user=user)




@bp.route('/property/<int:property_id>')
def property_details(property_id):
    db = get_db()
    prop = db.execute("SELECT * FROM properties WHERE id = ?", (property_id,)).fetchone()
    images = db.execute("SELECT filename FROM property_images WHERE property_id = ?", (property_id,)).fetchall()

    if not prop:
        return "Property not found", 404

    image_filenames = [img['filename'] for img in images]

    return render_template('buyDetails.html', property=prop, images=image_filenames)

@bp.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(current_app.root_path, 'static', 'uploads'), filename)

@bp.route('/profile', methods=['GET', 'POST'])
def profile():
    db = get_db()
    user_id = session['user_id']

    if request.method == 'POST':
        full_name = request.form['username']
        email = request.form['email']
        phone = request.form['phone']
        address = request.form['address']
        profile_pic = request.files.get('profile-pic')

        # Update user info
        db.execute("""
            UPDATE users SET username = ?, email = ?, phone = ?, address = ? WHERE id = ?
        """, (full_name, email, phone, address, user_id))

        # Save profile picture if uploaded
        if profile_pic and allowed_file(profile_pic.filename):
            filename = secure_filename(profile_pic.filename)
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            profile_pic.save(filepath)
            db.execute("UPDATE users SET profile_image = ? WHERE id = ?", (filename, user_id))

        db.commit()
        flash('Profile updated successfully!')
        return redirect(url_for('properties.profile'))

    # GET request → load user details
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return render_template('profile.html', user=user)

@bp.route('/about')
def about():
    return render_template('aboutus.html')

@bp.route('/blogs')
def blogs():
    return render_template('blogs.html')

@bp.route('/agents')
def agents():
    return render_template('agent.html')


@bp.route('/home' , endpoint='home')
def home():
    return render_template('home.html')

@bp.route('/privacy')
def privacy():
    return render_template('privacy.html')


@bp.route('/contact')
def contact():
    return render_template('contact.html')

@bp.route('/terms')
def terms():
    return render_template('terms.html')



