from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from extensions import mongo
from utils.helpers import serialize_doc
from models.page_model import create_page_doc


@jwt_required()
def create_page():
    uid = get_jwt_identity()
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"msg": "Page name is required"}), 400

    page = create_page_doc(name, uid)
    res = mongo.db.pages.insert_one(page)
    page["_id"] = str(res.inserted_id)
    page["user_id"] = str(page["user_id"])
    return jsonify(page), 201

@jwt_required()
def list_pages():
    uid = get_jwt_identity()
    docs = mongo.db.pages.find({"user_id": ObjectId(uid)}).sort("created_at", -1)
    return jsonify([serialize_doc(d) for d in docs]), 200

@jwt_required()
def delete_page(page_id):
    uid = get_jwt_identity()
    page = mongo.db.pages.find_one({"_id": ObjectId(page_id)})
    if not page or str(page["user_id"]) != uid:
        return jsonify({"msg": "Not found or unauthorized"}), 404

    mongo.db.notes.delete_many({"page_id": ObjectId(page_id)})
    mongo.db.pages.delete_one({"_id": ObjectId(page_id)})
    return jsonify({"msg": "Page and its notes deleted"}), 200


@jwt_required()
def update_page_name(page_id):
    uid = get_jwt_identity()
    data = request.get_json()
    new_name = data.get("name")

    if not new_name or new_name.strip() == "":
        return jsonify({"msg": "New page name is required"}), 400

    page = mongo.db.pages.find_one({"_id": ObjectId(page_id)})

    if not page or str(page["user_id"]) != uid:
        return jsonify({"msg": "Not found or unauthorized"}), 404

    mongo.db.pages.update_one(
        {"_id": ObjectId(page_id)},
        {"$set": {"name": new_name.strip()}}
    )

    return jsonify({"msg": "Page name updated successfully"}), 200