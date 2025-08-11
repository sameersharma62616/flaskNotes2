from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from extensions import mongo
from utils.helpers import serialize_doc
from utils.cloudinary_helper import upload_image
from models.note_model import create_note_doc

@jwt_required()
def create_note(page_id):
    uid = get_jwt_identity()
    page = mongo.db.pages.find_one({"_id": ObjectId(page_id)})
    if not page or str(page["user_id"]) != uid:
        return jsonify({"msg": "Page not found or unauthorized"}), 404

    sno = request.form.get("sno")
    title = request.form.get("title")
    description = request.form.get("description")
    date_str = request.form.get("date")
    image_file = request.files.get("image")

    img_url = None
    if image_file:
        img_url = upload_image(image_file, f"notes_app/notes/{uid}")

    note_date = None
    if date_str:
        try:
            note_date = datetime.fromisoformat(date_str)
        except:
            return jsonify({"msg": "Invalid date format"}), 400

    note = create_note_doc(
        page_id=page_id,
        user_id=uid,
        sno=int(sno) if sno else None,
        title=title,
        description=description,
        date=note_date,
        image_url=img_url
    )

    res = mongo.db.notes.insert_one(note)
    note["_id"] = str(res.inserted_id)
    note["page_id"] = str(note["page_id"])
    note["user_id"] = str(note["user_id"])
    if note["date"]:
        note["date"] = note["date"].isoformat()

    return jsonify(note), 201

@jwt_required()
def list_notes(page_id):
    uid = get_jwt_identity()
    page = mongo.db.pages.find_one({"_id": ObjectId(page_id)})
    if not page or str(page["user_id"]) != uid:
        return jsonify({"msg": "Page not found or unauthorized"}), 404

    docs = mongo.db.notes.find({"page_id": ObjectId(page_id)}).sort("sno", 1)
    return jsonify([serialize_doc(n) for n in docs]), 200

@jwt_required()
def delete_note(note_id):
    uid = get_jwt_identity()
    note = mongo.db.notes.find_one({"_id": ObjectId(note_id)})
    if not note or str(note["user_id"]) != uid:
        return jsonify({"msg": "Note not found or unauthorized"}), 404

    mongo.db.notes.delete_one({"_id": ObjectId(note_id)})
    return jsonify({"msg": "Note deleted"}), 200



@jwt_required()
def update_note(page_id, note_id):
    uid = get_jwt_identity()
    note = mongo.db.notes.find_one({"_id": ObjectId(note_id)})
    if not note:
        return jsonify({"msg": "Note not found"}), 404

    # Optional: check if user owns the page/note (security)
    page = mongo.db.pages.find_one({"_id": ObjectId(page_id)})
    if not page or str(page["user_id"]) != uid:
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.form.to_dict()
    update_data = {}
    # Update fields only if provided
    for field in ["sno", "title", "description", "date"]:
        if field in data and data[field]:
            update_data[field] = data[field]

    # Handle image update if file uploaded
    if "image" in request.files:
        image_file = request.files["image"]
        # upload_image is your cloudinary helper
        image_url = upload_image(image_file, "notes_app/notes")
        update_data["image"] = image_url

    if update_data:
        mongo.db.notes.update_one({"_id": ObjectId(note_id)}, {"$set": update_data})

    updated_note = mongo.db.notes.find_one({"_id": ObjectId(note_id)})
    return jsonify(serialize_doc(updated_note)), 200