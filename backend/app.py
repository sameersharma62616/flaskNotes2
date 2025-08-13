# from flask import Flask
# from flask_cors import CORS
# from config import Config
# from extensions import init_extensions
# from routes.auth_routes import auth_bp
# from routes.page_routes import page_bp
# from routes.note_routes import note_bp, note_delete_bp


# def create_app():
#     app = Flask(__name__)
#     app.config.from_object(Config)
#     init_extensions(app)

#     CORS(app, supports_credentials=True, origins=[app.config["FRONTEND_URL"]])

#     app.register_blueprint(auth_bp)
#     app.register_blueprint(page_bp)
#     app.register_blueprint(note_bp)
#     app.register_blueprint(note_delete_bp)

#     return app


# # Ye line add karni jaruri hai for Gunicorn
# app = create_app()

# if __name__ == "__main__":
#     app.run(debug=True)



from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import init_extensions
from routes.auth_routes import auth_bp
from routes.page_routes import page_bp
from routes.note_routes import note_bp, note_delete_bp
from routes.photo_routes import photo_bp
from flask import send_from_directory

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    init_extensions(app)

    # CORS Setup - multiple origins allowed (local dev + live frontend)
    CORS(app, supports_credentials=True, origins=[
        "http://localhost:5173",
        "https://flasknotes2.netlify.app"
    ])

    app.register_blueprint(auth_bp)
    app.register_blueprint(page_bp)
    app.register_blueprint(note_bp)
    app.register_blueprint(note_delete_bp)
    app.register_blueprint(photo_bp)
    

    return app

# Gunicorn ke liye global app variable
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
