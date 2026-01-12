import groq
from app.core.config import get_settings
import logging
import json

settings = get_settings()
logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        self.client = groq.Groq(api_key=settings.GROQ_API_KEY)

    def _get_completion(self, messages, model, json_mode=False, **kwargs):
        params = {
            "messages": messages,
            "model": model,
            **kwargs
        }
        if json_mode:
            params["response_format"] = {"type": "json_object"}
            
        return self.client.chat.completions.create(**params)

    def execute_safe(self, messages: list, primary_model: str, fallback_model: str = None, json_mode=False, **kwargs):
        """
        Executes a chat completion request with automatic fallback on Rate Limit Error (429).
        """
        try:
            return self._get_completion(messages, primary_model, json_mode, **kwargs)
        except groq.RateLimitError as e:
            if fallback_model:
                logger.warning(f"Rate limit hit for {primary_model}. Switching to {fallback_model}. Error: {e}")
                return self._get_completion(messages, fallback_model, json_mode, **kwargs)
            else:
                logger.error(f"Rate limit hit for {primary_model} and no fallback provided.")
                raise e
        except Exception as e:
            logger.error(f"Groq API Error: {e}")
            raise e

    def transcribe_audio(self, file_buffer, filename="audio.m4a"):
        try:
            return self.client.audio.transcriptions.create(
                file=(filename, file_buffer),
                model=settings.MODEL_AUDIO,
                response_format="json"
            )
        except Exception as e:
            logger.error(f"Transcription Error: {e}")
            raise e

    def parse_ingredients(self, text: str):
        """
        Extracts structured ingredient data from raw text using the FAST model.
        """
        messages = [
            {"role": "system", "content": "You are an expert parser. Extract ingredients from the input text into a JSON object with key 'ingredientes' containing a list of objects with 'item' and 'quantidade'. Output pure JSON."},
            {"role": "user", "content": text}
        ]
        
        response = self.execute_safe(
            messages, 
            primary_model=settings.MODEL_FAST, 
            fallback_model=None, # Fast model is the baseline, no fallback needed usually
            json_mode=True
        )
        return json.loads(response.choices[0].message.content)

    def extract_text_vision(self, image_base64: str):
        """
        Uses Groq Vision (Maverick) to extract ingredients directly from an image.
        Enforces strict JSON output.
        """
        messages = [
            {
                "role": "user", 
                "content": [
                    {
                        "type": "text", 
                        "text": (
                            "Analise esta imagem de nota fiscal ou lista de compras. "
                            "Extraia os itens e quantidades. "
                            "RETORNE APENAS UM JSON PURO. NÃO use Markdown. NÃO use ```json```. NÃO escreva texto introdutório. "
                            "O formato deve ser exato: {'ingredientes': [{'item': 'nome', 'quantidade': 'qtd'}]}"
                        )
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_base64
                        }
                    }
                ]
            }
        ]

        try:
            response = self.execute_safe(
                messages,
                primary_model=settings.MODEL_VISION,
                json_mode=True # Force JSON mode if supported by the model/API logic
            )
            
            content = response.choices[0].message.content
            logger.info(f"Groq Vision Raw Output: {content}")

            return self._sanitize_and_parse_json(content)

        except Exception as e:
            logger.error(f"Groq Vision Error: {e}")
            raise e

    def _sanitize_and_parse_json(self, content: str):
        """
        Cleans the LLM output to extract just the JSON part, handling markdown fences and conversational text.
        """
        import re
        
        try:
            # 1. Try parsing directly
            return json.loads(content)
        except json.JSONDecodeError:
            pass

        # 2. Extract content between ```json ... ``` or just { ... }
        # Regex to find the first outer { ... } block
        json_match = re.search(r"(\{.*\})", content, re.DOTALL)
        
        if json_match:
            try:
                json_str = json_match.group(1)
                return json.loads(json_str)
            except json.JSONDecodeError:
                pass
        
        logger.error(f"Failed to parse JSON from content: {content}")
        raise ValueError("Falha ao extrair JSON da resposta do modelo.")

    def generate_recipes(self, ingredients: list[str]):
        """
        Generates creative recipes using the HEAVY model, falling back to FAST if needed.
        """
        ingredients_str = ", ".join(ingredients)
        messages = [
            {"role": "system", "content": "Você é um Chef Brasileiro Criativo. Crie 3 receitas detalhadas baseadas nos ingredientes fornecidos. Retorne um JSON com a chave 'receitas', onde cada receita tem 'nome_do_prato', 'tempo_preparo', 'ingredientes_usados' (lista), 'modo_de_preparo' (lista de strings, passo a passo) e 'descricao_imagem'. O campo 'descricao_imagem' deve ser uma frase descritiva visual da aparência final do prato para gerar uma foto profissional (ex: 'Prato de macarrão ao molho vermelho vibrante com manjericão fresco e queijo ralado, iluminação natural')."},
            {"role": "user", "content": f"Ingredientes: {ingredients_str}"}
        ]
        
        response = self.execute_safe(
            messages,
            primary_model=settings.MODEL_HEAVY,
            fallback_model=settings.MODEL_FAST,
            json_mode=True
        )
        return json.loads(response.choices[0].message.content)

groq_service = GroqService()
