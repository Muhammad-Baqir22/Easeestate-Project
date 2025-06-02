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
    user_id = session['user_id']
    properties = db.execute("SELECT * FROM properties WHERE property_type = 'sale'").fetchall()

    # Attach images to each property
    enriched = []
    for prop in properties:
        images = db.execute("SELECT filename FROM property_images WHERE property_id = ?", (prop['id'],)).fetchall()
        enriched.append({**prop, 'images': [img['filename'] for img in images]})
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return render_template('buy.html', properties=enriched, user = user)

@bp.route('/rent')
def rent():
    db = get_db()
    user_id = session['user_id']
    props = db.execute("SELECT * FROM properties WHERE property_type = 'rent'").fetchall()

    enriched_props = []
    for prop in props:
        images = db.execute(
            "SELECT filename FROM property_images WHERE property_id = ?", (prop['id'],)
        ).fetchall()
        enriched_props.append({**prop, 'images': [img['filename'] for img in images]})
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return render_template('rent.html', properties=enriched_props, user = user)


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
    if 'user_id' not in session:
        flash("You must be logged in to add a property.")
        return redirect(url_for('auth.login'))
    db = get_db()
    user_id = session['user_id']
    if request.method == 'POST':
        
        title = request.form['title']
        description = request.form['description']
        location = request.form['location']
        colony = request.form['colony']
        size = request.form['size']
        price = request.form['price']
        images = request.files.getlist('images')
        category = request.form['property-type']

        # Save property data first
        db.execute(""" 
            INSERT INTO properties (user_id, title, description, location, colony, size, price, property_type, category) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'rent', ?) 
            """, (session['user_id'], title, description, location, colony, size, price, category))
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
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return render_template('add_rent.html', user=user)


@bp.route('/property/<int:id>')
def detail(id):
    db = get_db()

    prop = db.execute("SELECT * FROM properties WHERE id = ?", (id,)).fetchone()
    if prop is None:
        return "Property not found", 404

    prop = dict(prop)
    prop['owner_id'] = prop['user_id']

    images = db.execute(
        "SELECT filename FROM property_images WHERE property_id = ?", 
        (id,)
    ).fetchall()
    prop['images'] = [img['filename'] for img in images] or ['default-property.png']

    return render_template('buyDetails.html', property=prop,images=prop['images'] ,user=session.get('user'))


@bp.route('/myproperties')
def myproperties():
    user_id = session.get('user_id')
    if not user_id:
        flash('Please log in to view your properties.')
        return redirect(url_for('auth.login'))

    db = get_db()
    props = db.execute(
        "SELECT * FROM properties WHERE user_id = ?", (user_id,)
    ).fetchall()

    enriched_props = []
    for prop in props:
        images = db.execute(
            "SELECT filename FROM property_images WHERE property_id = ?", 
            (prop['id'],)
        ).fetchall()

        # Extract filenames from query result
        image_filenames = [img['filename'] for img in images]

        # Use first image or fallback to default
        main_image = image_filenames[0] if image_filenames else 'default-property.png'

        enriched_props.append({
            **prop,  # all original property fields
            'image': main_image  # add the main image key
        })

    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return render_template('myproperty.html', properties=enriched_props , user = user)



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
    db = get_db()
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    
    location = request.args.get('location', '').strip()
    colony = request.args.get('colony', '').strip()
    size = request.args.get('size', '').strip()
    prop_category = request.args.get('type', '').strip()  # e.g., house, flat
    purpose = request.args.get('property_type', '').strip().lower()  # sale or rent

    query = "SELECT * FROM properties WHERE 1=1"
    params = []

    if purpose:
        query += " AND LOWER(property_type) = ?"  # Matches sale/rent
        params.append(purpose)

    if location:
        query += " AND LOWER(location) LIKE ?"
        params.append(f"%{location.lower()}%")

    if colony:
        query += " AND LOWER(colony) LIKE ?"
        params.append(f"%{colony.lower()}%")

    if size:
        query += " AND LOWER(size) LIKE ?"
        params.append(f"%{size.lower()}%")

    if prop_category:
        query += " AND LOWER(category) LIKE ?"  # Matches house, flat, etc.
        params.append(f"%{prop_category.lower()}%")

    results = db.execute(query, params).fetchall()

    enriched_results = []
    for prop in results:
        images = db.execute(
            "SELECT filename FROM property_images WHERE property_id = ?", 
            (prop['id'],)
        ).fetchall()

        image_filenames = [img['filename'] for img in images] or ['default-property.png']
        enriched_results.append({**prop, 'images': image_filenames})

    # Dynamically determine template based on property_type (sale or rent)
    return render_template('rent.html' if purpose == 'rent' else 'buy.html', properties=enriched_results)




@bp.route('/search/advanced', methods=['GET'])
def advanced_search():
    db = get_db()

    city = request.args.get('city', '').strip()
    colony = request.args.get('colony', '').strip()
    sizes = request.args.getlist('size')
    types = request.args.getlist('type')
    min_price = request.args.get('min-price', type=float)
    max_price = request.args.get('max-price', type=float)
    purpose = request.args.get('property_type', 'sale').lower()  # 'sale' or 'rent'
    print(f"Purpose: {purpose}")

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
        query += " AND (" + " OR ".join(["LOWER(category) LIKE ?"] * len(types)) + ")"
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
    enriched_results = []
    for prop in results:
        images = db.execute(
            "SELECT filename FROM property_images WHERE property_id = ?", 
            (prop['id'],)
        ).fetchall()

        image_filenames = [img['filename'] for img in images] or ['default-property.png']
        enriched_results.append({**prop, 'images': image_filenames})

    return render_template('buy.html' if purpose == 'sale' else 'rent.html', properties=enriched_results)

@bp.route('/search/advanced/rent', methods=['GET'])
def advanced_rent_search():
    db = get_db()

    city = request.args.get('city', '').strip()
    colony = request.args.get('colony', '').strip()
    sizes = request.args.getlist('size')
    types = request.args.getlist('type')
    min_price = request.args.get('min-price', type=float)
    max_price = request.args.get('max-price', type=float)
    purpose = request.args.get('property_type', 'rent').lower()  # Default to 'rent'
    print(f"Purpose: {purpose}")

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
        query += " AND (" + " OR ".join(["LOWER(category) LIKE ?"] * len(types)) + ")"
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
    enriched_results = []
    for prop in results:
        images = db.execute(
            "SELECT filename FROM property_images WHERE property_id = ?", 
            (prop['id'],)
        ).fetchall()

        image_filenames = [img['filename'] for img in images] or ['default-property.png']
        enriched_results.append({**prop, 'images': image_filenames})

    return render_template('buy.html' if purpose == 'sale' else 'rent.html', properties=enriched_results)



@bp.route('/post_sale', methods=['GET', 'POST'])
def post_sale():
    if 'user_id' not in session:
        flash("You must be logged in to post a property for sale.")
        return redirect(url_for('auth.login'))

    db = get_db()
    user_id = session['user_id']

    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        location = request.form['location']
        colony = request.form['colony']
        size = request.form['size']
        price = request.form['price']
        images = request.files.getlist('images')
        category = request.form['property-type']

        db.execute(""" 
            INSERT INTO properties (user_id, title, description, location, colony, size, price, property_type, category) 
            VALUES (?, ?, ?, ?, ?, ?, ?, 'sale', ?) 
        """, (user_id, title, description, location, colony, size, price, category))
        db.commit()

        prop_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]

        for img in images:
            if img and allowed_file(img.filename):
                filename = secure_filename(img.filename)
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                img.save(filepath)
                db.execute("INSERT INTO property_images (property_id, filename) VALUES (?, ?)", (prop_id, filename))

        db.commit()
        return redirect(url_for('properties.sale'))

    # GET request: load user data
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return render_template('sell.html', user=user)




@bp.route('/property/<int:property_id>')
def property_details(property_id):
    db = get_db()
    # Fetch the main property
    prop = db.execute("SELECT * FROM properties WHERE id = ?", (property_id,)).fetchone()
    if not prop:
        return "Property not found", 404

    # Fetch property images
    images = db.execute(
        "SELECT filename FROM property_images WHERE property_id = ?", 
        (property_id,)
    ).fetchall()
    image_filenames = [img['filename'] for img in images] or ['default-property.png']

    # Enrich the main property
    enriched_property = {**prop, 'images': image_filenames}

    # Fetch similar properties by location and similar size (±10%)
    size = prop['size']
    location = prop['location']
    similar_properties = db.execute("""
        SELECT * FROM properties 
        WHERE id != ? 
        AND location = ? 
        AND size  ?
        LIMIT 4
    """, (property_id, location, size )).fetchall()

    # Attach one image to each similar property
    similar_props = []
    for sprop in similar_properties:
        s_img = db.execute(
            "SELECT filename FROM property_images WHERE property_id = ? LIMIT 1",
            (sprop['id'],)
        ).fetchone()
        s_image = s_img['filename'] if s_img else 'default-property.png'
        similar_props.append({**sprop, 'image': s_image})
        print("SIMILAR PROPERTIES:", similar_props)

    # Determine template
    purpose = (prop['property_type'] or '').strip().lower()
    template = 'rentDetails.html' if purpose == 'rent' else 'buyDetails.html'
    
    user = None
    if 'user_id' in session:
        user_id = session['user_id']
        user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()

    return render_template(template, 
                           property=enriched_property,
                           images=image_filenames,
                           similar_properties=similar_props , user = user)



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
    db = get_db()
    user_id = session.get('user_id')

    user = None
    if user_id:
        user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()

    return render_template('aboutus.html', user=user)




@bp.route('/agents')
def agents():
    db = get_db() 
    user_id = session['user_id']
    
    if user_id:
        user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    
    return render_template('agent.html', user = user)


@bp.route('/home', endpoint='home')
def home():
    db = get_db()
    user_id = session.get('user_id')

    user = None
    if user_id:
        user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()

    return render_template('home.html', user=user)


@bp.route('/privacy')
def privacy():
    return render_template('privacy.html')


@bp.route('/contact')
def contact():
    return render_template('contact.html')

@bp.route('/terms')
def terms():
    return render_template('terms.html')

@bp.route('/blogs', methods=['GET', 'POST'])
def blogs():
    db = get_db()
    user_id = session.get('user_id')
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        author = request.form.get('author')
        image = request.files.get('image')

        if not title or not content or not author:
            flash('All fields are required!', 'error')
            return redirect(url_for('properties.blogs'))

        # Save image if provided
        image_filename = None
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            upload_folder = current_app.config['UPLOAD_FOLDER']
            filepath = os.path.join(upload_folder, filename)
            image.save(filepath)
            image_filename = filename

        # Insert blog into database
        db.execute(
            "INSERT INTO blogs (title, content, author, image_filename) VALUES (?, ?, ?, ?)",
            (title, content, author, image_filename)
        )
        db.commit()
        flash('Blog posted successfully!', 'success')
        return redirect(url_for('properties.blogs'))

    # GET: Fetch all blogs to display
    blogs = db.execute(
        "SELECT id, title, content, author, image_filename FROM blogs ORDER BY id DESC"
    ).fetchall()
    
    if user_id:
        user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()

    return render_template('blogs.html', blogs=blogs , user = user)



