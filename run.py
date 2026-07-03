from app import create_app

app = create_app()

if __name__ == "__main__":
    # use_reloader=False prevents Flask from spawning a second process
    # that competes with the first for the SQLite lock.
    app.run(debug=True, use_reloader=False)
