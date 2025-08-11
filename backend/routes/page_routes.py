from flask import Blueprint
from controllers import page_controller

page_bp = Blueprint("pages", __name__, url_prefix="/api/pages")

page_bp.route("", methods=["POST"])(page_controller.create_page)
page_bp.route("", methods=["GET"])(page_controller.list_pages)
page_bp.route("/<page_id>", methods=["DELETE"])(page_controller.delete_page)
page_bp.route("/<page_id>", methods=["PATCH"])(page_controller.update_page_name)