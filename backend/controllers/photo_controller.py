from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mongo
import cloudinary.uploader
from bson import ObjectId

@jwt_required()
def upload_photos():
    user_id = get_jwt_identity()  # JWT se current user ID lo

    if 'photos' not in request.files:
        return jsonify({"error": "No photos provided"}), 400

    uploaded_files = request.files.getlist('photos')
    photo_urls = []

    for file in uploaded_files:
        result = cloudinary.uploader.upload(file)
        photo_doc = {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "userId": user_id  # userId save
        }
        inserted = mongo.db.photos.insert_one(photo_doc)
        photo_doc["_id"] = str(inserted.inserted_id)
        photo_urls.append(photo_doc)

    return jsonify({"message": "Photos uploaded successfully", "photos": photo_urls}), 201


@jwt_required()
def list_photos():
    user_id = get_jwt_identity()
    photos = list(mongo.db.photos.find(
        {"userId": user_id},  # sirf current user ke photos
        {"_id": 1, "url": 1, "public_id": 1}
    ))
    for p in photos:
        p["_id"] = str(p["_id"])
    return jsonify(photos), 200


@jwt_required()
def delete_photo(photo_id):
    user_id = get_jwt_identity()
    photo = mongo.db.photos.find_one({"_id": ObjectId(photo_id), "userId": user_id})
    if not photo:
        return jsonify({"error": "Photo not found or not authorized"}), 404

    cloudinary.uploader.destroy(photo["public_id"])
    mongo.db.photos.delete_one({"_id": ObjectId(photo_id)})
    return jsonify({"message": "Photo deleted successfully"}), 200