from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from bson import ObjectId
from extensions import mongo
from utils.helpers import serialize_doc
from utils.cloudinary_helper import upload_image
from models.user_model import create_user_doc

def signup():
    form = request.form
    name = form.get("name")
    email = form.get("email", "").lower()
    mobile = form.get("mobile")
    password = form.get("password")
    profile_pic = request.files.get("profile_pic")

    if not (email and password and name):
        return jsonify({"msg":"name, email and password are required"}), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"msg":"Email already registered"}), 400

    profile_url = None
    if profile_pic:
        profile_url = upload_image(profile_pic, "notes_app/profiles")

    hashed = generate_password_hash(password)

    # Corrected call with keywords (recommended)
    user_doc = create_user_doc(
        name=name,
        email=email,
        mobile=mobile,
        password_hash=hashed,
        profile_pic_url=profile_url
    )

    res = mongo.db.users.insert_one(user_doc)
    user_id = str(res.inserted_id)

    token = create_access_token(identity=user_id, expires_delta=timedelta(days=7))
    user_doc["_id"] = user_id
    user_doc.pop("password", None)
    return jsonify({"token": token, "user": serialize_doc(user_doc)}), 201
    form = request.form
    name = form.get("name")
    email = form.get("email", "").lower()
    mobile = form.get("mobile")
    password = form.get("password")
    profile_pic = request.files.get("profile_pic")

    if not (email and password and name):
        return jsonify({"msg":"name, email and password are required"}), 400

    if mongo.db.users.find_one({"email": email}):
        return jsonify({"msg":"Email already registered"}), 400

    profile_url = None
    if profile_pic:
        profile_url = upload_image(profile_pic, "notes_app/profiles")

    hashed = generate_password_hash(password)
    user_doc = create_user_doc(name, email, mobile, profile_url, hashed)
    res = mongo.db.users.insert_one(user_doc)
    user_id = str(res.inserted_id)

    token = create_access_token(identity=user_id, expires_delta=timedelta(days=7))
    user_doc["_id"] = user_id
    user_doc.pop("password")
    return jsonify({"token": token, "user": serialize_doc(user_doc)}), 201

def login():
    data = request.get_json()
    email = data.get("email", "").lower()
    password = data.get("password")

    user = mongo.db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"msg":"Invalid credentials"}), 401

    token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(days=7))
    user_out = serialize_doc(user)
    user_out.pop("password", None)
    return jsonify({"token": token, "user": user_out}), 200

@jwt_required()
def me():
    uid = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(uid)})
    if not user:
        return jsonify({"msg":"User not found"}), 404
    out = serialize_doc(user)
    out.pop("password", None)
    return jsonify(out), 200


@jwt_required()
def update_profile():
    uid = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(uid)})
    if not user:
        return jsonify({"msg": "User not found"}), 404

    form = request.form
    name = form.get("name")
    email = form.get("email", "").lower()
    mobile = form.get("mobile")
    password = form.get("password")  # new password if updating
    profile_pic = request.files.get("profile_pic")

    update_data = {}

    print(f"Update Profile Request from user {uid}: name={name}, email={email}, mobile={mobile}, password={'***' if password else None}, profile_pic={'Yes' if profile_pic else 'No'}")

    if name:
        update_data["name"] = name
    if email and email != user["email"]:
        if mongo.db.users.find_one({"email": email, "_id": {"$ne": ObjectId(uid)}}):
            print("Email already in use by another user")
            return jsonify({"msg": "Email already in use"}), 400
        update_data["email"] = email
    if mobile:
        update_data["mobile"] = mobile
    if password:
        hashed = generate_password_hash(password)
        update_data["password"] = hashed
    if profile_pic:
        profile_url = upload_image(profile_pic, "notes_app/profiles")
        update_data["profile_url"] = profile_url

    if not update_data:
        print("No fields to update")
        return jsonify({"msg": "No update fields provided"}), 400

    try:
        mongo.db.users.update_one({"_id": ObjectId(uid)}, {"$set": update_data})
        print("Profile updated successfully")
    except Exception as e:
        print(f"Error updating profile: {e}")
        return jsonify({"msg": "Server error during update"}), 500

    updated_user = mongo.db.users.find_one({"_id": ObjectId(uid)})
    user_out = serialize_doc(updated_user)
    user_out.pop("password", None)
    return jsonify(user_out), 200