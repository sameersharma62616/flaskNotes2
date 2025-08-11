from datetime import datetime

def create_user_doc(name, email, mobile, profile_pic_url, hashed_password):
    return {
        "name": name,
        "email": email,
        "mobile": mobile,
        "profile_pic": profile_pic_url,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }