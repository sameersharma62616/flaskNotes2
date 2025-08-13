from flask import Blueprint
from controllers import photo_controller

photo_bp = Blueprint("photos", __name__, url_prefix="/api/photos")

photo_bp.route("", methods=["POST"])(photo_controller.upload_photos)
photo_bp.route("", methods=["GET"])(photo_controller.list_photos)
photo_bp.route("/<photo_id>", methods=["DELETE"])(photo_controller.delete_photo)