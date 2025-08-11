from datetime import datetime
from bson import ObjectId

def create_page_doc(name, user_id):
    return {
        "name": name,
        "user_id": ObjectId(user_id),
        "created_at": datetime.utcnow()
    }