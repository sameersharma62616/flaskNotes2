from flask import Blueprint
from controllers import note_controller

note_bp = Blueprint("notes", __name__, url_prefix="/api/pages/<page_id>/notes")

note_bp.route("", methods=["POST"])(note_controller.create_note)
note_bp.route("", methods=["GET"])(note_controller.list_notes)

note_delete_bp = Blueprint("note_delete", __name__, url_prefix="/api/notes")
note_delete_bp.route("/<note_id>", methods=["DELETE"])(note_controller.delete_note)
note_bp.route("/<note_id>", methods=["PATCH"])(note_controller.update_note)