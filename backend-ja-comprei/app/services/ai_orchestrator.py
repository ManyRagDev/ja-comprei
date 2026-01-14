import logging
import json
from app.services.groq_service import groq_service
from app.services.pollinations_service import pollinations_service

logger = logging.getLogger(__name__)

class AIOrchestrator:
    """
    Orchestrates calls between Vision/Image Gen (Pollinations) and Text Logic/Reasoning (Groq).
    Now supports Pexels as alternative image provider.
    """

    async def process_receipt_image(self, image_buffer: bytes) -> dict:
        """
        Flow:
        1. Pollinations Vision -> Extract raw text from receipt image.
        2. Groq -> Parse raw text into structured JSON ingredients.
        """
        try:
            # Step 1: Encode Image
            # Need to import utils here or at top
            from app.utils.image_utils import encode_image_to_base64
            
            # Assuming bytes come as JPEG or detecting mimetype would be better, but defaulting to jpeg for base64 header
            base64_image = encode_image_to_base64(image_buffer)

            # Step 2: Vision (Groq Maverick)
            logger.info("Sending image to Groq Vision (Maverick)...")
            structured_data = groq_service.extract_text_vision(base64_image)
            
            logger.info(f"Groq Extraction Result: {json.dumps(structured_data, ensure_ascii=False)}")
            return structured_data

        except Exception as e:
            logger.error(f"Orchestrator Receipt Error: {e}")
            raise e

    async def generate_recipes_with_images(self, ingredients: list[str]) -> dict:
        """
        Flow:
        1. Groq -> Generate recipes JSON (with visual_tag).
        2. Pollinations -> Generate Ghibli Style Image URL for each recipe.
        3. Merge -> Return enriched JSON.
        """
        try:
            # Step 1: Generate Recipes (Groq returns sanitized JSON with 'visual_tag')
            recipes_data = groq_service.generate_recipes(ingredients) 
            # Expected format: { "receitas": [ {...}, ... ] }

            if "receitas" in recipes_data:
                for recipe in recipes_data["receitas"]:
                    dish_name = recipe.get("nome_do_prato", "Dish")
                    
                    # Step 2: Get Visual Tag (Prefer English tags from AI)
                    visual_tag = recipe.get("visual_tag")
                    if not visual_tag:
                         # Fallback if AI failed to generate tag: use dish name + generic elements
                         # Translate simple terms if possible or just use Portuguese name (Pollinations handles it somewhat)
                         logger.warning(f"Missing visual_tag for {dish_name}. Using fallback.")
                         visual_tag = f"{dish_name}, delicious food"
                    
                    # Step 3: Get Ghibli URL
                    image_url = pollinations_service.get_ghibli_url(visual_tag)
                    
                    # Step 4: Inject (using 'image_url' standard field)
                    recipe["image_url"] = image_url
                    # Large image is the same for AI gen (it's vector/high-res enough usually or same seed)
                    recipe["image_url_large"] = image_url 
            
            return recipes_data

        except Exception as e:
            logger.error(f"Orchestrator Recipe Error: {e}")
            raise e

ai_orchestrator = AIOrchestrator()

