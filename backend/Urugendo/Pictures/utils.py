import uuid
from .supabase_client import supabase

def upload_image_to_supabase(image_file, bucket_name, user_id, delete_old=False):
    """
    Upload an image to Supabase storage and optionally delete old images after successful upload.

    Args:
        image_file: Django InMemoryUploadedFile
        bucket_name: str, Supabase bucket name
        user_id: str, user identifier for folder
        delete_old: bool, whether to delete previous images after upload

    Returns:
        public_url (str): URL of the uploaded image
    """
    # Generate unique image ID and path
    image_id = str(uuid.uuid4())
    file_ext = image_file.name.split('.')[-1]
    file_path = f"{user_id}/{image_id}.{file_ext}"

    # Upload new image
    bytes_data = image_file.read()
    supabase.storage.from_(bucket_name).upload(file_path, bytes_data)

    public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)

    # Delete old images if requested
    if delete_old:
        try:
            existing_files = supabase.storage.from_(bucket_name).list(user_id)
            # Remove any file that is not the newly uploaded one
            for file in existing_files:
                existing_file_path = f"{user_id}/{file['name']}"
                if existing_file_path != file_path:
                    supabase.storage.from_(bucket_name).remove([existing_file_path])
        except Exception as e:
            # Not fatal, just log
            print(f"Could not delete previous images: {e}")

    return public_url