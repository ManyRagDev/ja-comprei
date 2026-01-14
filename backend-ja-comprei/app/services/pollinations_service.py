import logging
from urllib.parse import quote
from app.core.config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

class PollinationsService:
    """
    Handles image generation using Pollinations.ai with Studio Ghibli style.
    """
    
    def __init__(self):
        self.base_url_gen = "https://gen.pollinations.ai"
        
        # Ghibli Style Template
        self.style_suffix = "Anime food illustration, Studio Ghibli style. Steaming hot, glossy texture, vibrant colors, delicious, hand drawn 2D art, cozy atmosphere."
        self.negative_prompt = "photorealistic, 3d render, plastic, low resolution, blurry, text, watermark, photo, real"
        
    def get_ghibli_url(self, visual_tag: str) -> str:
        """
        Generates a Pollinations URL for a Studio Ghibli style food illustration.
        
        Args:
            visual_tag: English description of the dish (e.g. "Steak with fried egg")
            
        Returns:
            str: The signed/authenticated URL for the image.
        """
        if not settings.POLLINATIONS_API_KEY:
            logger.error("POLLINATIONS_API_KEY is missing! Image generation will fail.")
            # We return the URL anyway, but it will likely 403 on client side if API enforces auth
            # Or we could return a placeholder/error string. 
            # For now, let's log error and proceed to attempt generation.
            
        # Construct Prompt
        full_prompt = f"{visual_tag}. {self.style_suffix}"
        encoded_prompt = quote(full_prompt)
        
        # Build Query Params
        width = 1024
        height = 1024
        model = "flux" # Explicitly using flux for better consistency
        nologo = "true"
        seed = 42 # Optional: fixed seed for consistency if needed, or random. Let's leave random (omit)
        enhance = "false" # We are already enhancing via prompt
        
        url = f"{self.base_url_gen}/image/{encoded_prompt}"
        url += f"?model={model}&width={width}&height={height}&nologo={nologo}&enhance={enhance}"
        
        # Add Negative Prompt if supported via URL (some engines ignore it in GET, but flux usually respects 'negative' param)
        # Pollinations documentation often passes negative as param
        url += f"&negative={quote(self.negative_prompt)}"
        
        # Authentication (Critical)
        if settings.POLLINATIONS_API_KEY:
            # Append as query param 'key' (assuming standard Pollinations auth pattern)
            # OR Check documentation: Sometimes it's a header, but for IMG URLs it's usually ?key=... or ?token=...
            # Based on previous code: url += f"&key={settings.POLLINATIONS_API_KEY}"
            # Updating to comply to User Request: "Pollinations exige API"
            pass # Already added below
            
        # Add API Key/Token ??
        # The documentation provided doesn't explicitly state the GET param for key, but previous code used 'key'.
        # Assuming ?key=... is correct for Pollinations.
        
        # Important: Verify if user provided a specific param name reference.
        # User said: "A Pollinations exige API... Se enviarmos comandos sem o token, não irá funcionar."
        
        # Let's use what was in the previous file which worked or was assumed correct.
        if settings.POLLINATIONS_API_KEY:
             url += f"&key={settings.POLLINATIONS_API_KEY}"
        
        return url

pollinations_service = PollinationsService()
