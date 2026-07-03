import sqlite3
from flask import g, current_app

DATABASE = 'real_estate.db'


def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(
            DATABASE,
            timeout=20,           # wait up to 20s instead of failing immediately
            check_same_thread=False,
        )
        g.db.row_factory = sqlite3.Row
        g.db.execute('PRAGMA journal_mode=WAL')   # WAL allows concurrent reads + one write
        g.db.execute('PRAGMA foreign_keys=ON')
    return g.db


def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_db():
    with sqlite3.connect(DATABASE, timeout=20) as db:
        db.execute('PRAGMA journal_mode=WAL')
        with open('app/models.sql') as f:
            db.executescript(f.read())
        db.commit()


def init_app(app):
    app.teardown_appcontext(close_db)
