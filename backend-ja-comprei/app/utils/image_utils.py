import base64

def encode_image_to_base64(file_buffer: bytes, mime_type: str = "image/jpeg") -> str:
    """
    Encodes binary image data to a Base64 string suitable for data URIs.
    """
    base64_str = base64.b64encode(file_buffer).decode('utf-8')
    return f"data:{mime_type};base64,{base64_str}"
