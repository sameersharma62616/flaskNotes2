from flask import Blueprint
from controllers import auth_controller
from controllers.auth_controller import update_profile
from flask_jwt_extended import jwt_required


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

auth_bp.route("/signup", methods=["POST"])(auth_controller.signup)
auth_bp.route("/login", methods=["POST"])(auth_controller.login)
auth_bp.route("/me", methods=["GET"])(auth_controller.me)
auth_bp.route("/profile", methods=["PATCH"])(update_profile)