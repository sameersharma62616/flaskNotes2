from datetime import datetime
from bson import ObjectId

def create_user_doc(name, email, mobile, password_hash, profile_pic_url=None):
    return {
        "name": name,
        "email": email,
        "mobile": mobile,
        "password": password_hash,
        "profile_pic": profile_pic_url,
        "created_at": datetime.utcnow()
    }