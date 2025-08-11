import cloudinary.uploader

def upload_image(file, folder):
    res = cloudinary.uploader.upload(file, folder=folder)
    return res.get("secure_url")