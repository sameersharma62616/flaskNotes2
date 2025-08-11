from datetime import datetime
from bson import ObjectId

def create_note_doc(page_id, user_id, sno, title, description, date, image_url):
    return {
        "page_id": ObjectId(page_id),
        "user_id": ObjectId(user_id),
        "sno": sno,
        "title": title,
        "description": description,
        "image": image_url,
        "date": date,
        "created_at": datetime.utcnow()
    }