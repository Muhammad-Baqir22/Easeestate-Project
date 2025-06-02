from flask import Blueprint, render_template, session, redirect, url_for, request
from app.db import get_db

bp = Blueprint('admin', __name__, url_prefix='/admin')

def admin_required(func):
    def wrapper(*args, **kwargs):
        if not session.get('admin'):
            return redirect(url_for('auth.login'))
        return func(*args, **kwargs)
    wrapper.__name__ = func.__name__
    return wrapper

@bp.route('/dashboard')
@admin_required
def dashboard():
    return render_template('admin.html')

@bp.route('/users')
@admin_required
def manage_users():
    db = get_db()
    users = db.execute('SELECT * FROM users').fetchall()
    return render_template('manage_users.html', users=users)

@bp.route('/properties')
@admin_required
def manage_properties():
    db = get_db()
    properties = db.execute('SELECT * FROM properties').fetchall()
    return render_template('manage_properties.html', properties=properties)

@bp.route('/blogs')
@admin_required
def manage_blogs():
    db = get_db()
    blogs = db.execute('SELECT * FROM blogs').fetchall()
    return render_template('manage_blogs.html', blogs=blogs)

@bp.route('/users/delete/<int:user_id>', methods=['POST'])
@admin_required
def delete_user(user_id):
    db = get_db()
    db.execute('DELETE FROM users WHERE id = ?', (user_id,))
    db.commit()
    return redirect(url_for('admin.manage_users'))

@bp.route('/properties/delete/<int:property_id>', methods=['POST'])
@admin_required
def delete_property(property_id):
    db = get_db()
    db.execute('DELETE FROM properties WHERE id = ?', (property_id,))
    db.commit()
    return redirect(url_for('admin.manage_properties'))

@bp.route('/blogs/delete/<int:blog_id>', methods=['POST'])
@admin_required
def delete_blog(blog_id):
    db = get_db()
    db.execute('DELETE FROM blogs WHERE id = ?', (blog_id,))
    db.commit()
    return redirect(url_for('admin.manage_blogs'))
