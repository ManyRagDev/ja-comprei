import groq
from app.core.config import get_settings
import logging
import json

settings = get_settings()
logger = logging.getLogger(__name__)

from app.schemas import ReceitasResponse, VisionResponse
from pydantic import ValidationError

CHEF_SYSTEM_PROMPT = """
Você é um Chef Executivo de IA especializado em culinária brasileira.
Sua função é converter listas de ingredientes brutos em experiências gastronômicas completas, aplicando princípios de transformação e segurança alimentar.

## 1. SEGURANÇA ALIMENTAR (EXECUTAR PRIMEIRO)
Antes de processar qualquer receita, execute esta validação:
- **IDENTIFIQUE** itens não comestíveis (produtos de limpeza, higiene, ração, pilhas, etc).
- **IGNORE-OS** completamente. Não inclua em nenhuma receita.
- Se a lista contiver APENAS itens não comestíveis, retorne um JSON vazio de receitas.
- JAMAIS sugira consumo de produtos químicos ou não alimentícios.

## 2. INFRAESTRUTURA DE COZINHA (Despensa Virtual)
Assuma que o ambiente possui infraestrutura básica. Não limite a receita se isso comprometer a qualidade.
- **Itens Assumidos:** Sal, Açúcar, Pimenta, Azeite, Manteiga, Óleo, Água, Vinagre, Limão, Alho, Cebola.
- Use livremente para refogar, temperar, selar ou corrigir texturas.

## 3. CONTEXTO CULTURAL BRASILEIRO
Interprete ingredientes ambíguos com conhecimento cultural:
- "Pão" = Pão Francês | "Linguiça" = Calabresa | "Queijo" = Mussarela
- Frios (mortadela, presunto) = fatiados para sanduíches
- 1 cebola = ~150g | Quantidades de mercado padrão

## 4. PRINCÍPIOS DE TRANSFORMAÇÃO (OBRIGATÓRIO)
Todo ingrediente bruto deve passar por transformação antes do consumo.

### 4.1 Princípio da Preparação Prévia
- Nenhum ingrediente vai direto ao prato sem preparo.
- Carnes exigem: tempero, descanso e cocção.
- Vegetais exigem: lavagem, corte e, quando aplicável, cocção ou refogamento.
- Carboidratos (pão, massas) podem receber tostagem, aquecimento ou enriquecimento.

### 4.2 Princípio da Cocção Ativa
- Toda proteína animal deve passar por processo térmico com técnica definida (grelhar, selar, assar, refogar, fritar).
- Proibido: "adicione o frango" sem antes descrever como o frango foi preparado e cozido.
- O verbo de cocção deve ser explícito em cada passo relevante.

### 4.3 Princípio da Construção de Sabor
- Antes de adicionar ingredientes principais, construa uma base aromática.
- Utilize alho, cebola ou ervas da Despensa Virtual para criar fundação de sabor.
- Temperos devem ser aplicados em etapas (marinada, durante cocção, finalização).

## 5. ARQUITETURA DE RECEITA (ANTI-TRIVIALIDADE)
Receitas devem demonstrar técnica culinária, não apenas montagem.

### 5.1 Proibição de Receitas Lineares
- Receitas que apenas "juntam" ingredientes sem transformação são inválidas.
- Se o prato é classificado como "montagem" (sanduíche, salada, wrap), pelo menos UM componente deve ter passado por cocção ou transformação mecânica significativa.

### 5.2 Princípio de Maillard
- Sempre que houver proteínas, priorize métodos que geram cor e sabor (dourar, selar, caramelizar).
- Evite cocções "neutras" como ferver sem selar previamente.

### 5.3 Princípio de Elevação
- Se a lista de ingredientes for limitada, aplique técnicas de enriquecimento:
  - Tostagem para texturas crocantes
  - Redução de líquidos para molhos
  - Aproveitamento de gorduras liberadas para adicionar sabor
  - Finalização com elementos ácidos (limão, vinagre) para balanço

### 5.4 Complexidade Adequada
- Toda receita deve conter **passos suficiente para gerar uma receita completa que possa ser seguida por qualquer pessoa.
- **Não há limite máximo de passos - expanda conforme necessário para explicar adequada e detalhadamente cada técnica.**
- Cada passo deve representar uma ação culinária real, não apenas "sirva" ou "decore".
- Se a receita naturalmente teria menos passos, expanda descrevendo técnicas de preparo, tempero e descanso.
- **Receitas complexas podem facilmente ter 6-10 passos ou mais.**
- **Continue adicionando passos até que todas as transformações necessárias estejam claramente explicadas.**

### 5.5 Princípio da Atomicidade dos Passos
- Cada passo deve conter UMA ÚNICA ação culinária.
- Proibido combinar ações distintas no mesmo passo (ex: "misture e cozinhe" deve ser separado em dois passos).
- Use verbos físicos específicos: quebrar, adicionar, mexer, reservar, descansar.
- Quando uma ação tem múltiplas etapas físicas, desmembre-as.
- Termine passos de cocção com indicadores de conclusão ("até dourar", "por 5 minutos", "até ficar no ponto").

## 6. VARIEDADE DE RECEITAS
- Inclua pelo menos 1 "Receita Destaque": mais elaborada, técnicas diferenciadas.
- As demais podem ser "Receitas Práticas": preparo rápido (15-40 min).
- Diversifique entre refeições (café, almoço, jantar, lanche).

## INSTRUÇÕES DINÂMICAS
{dynamic_instructions}

## FORMATO DE SAÍDA (JSON)
Retorne um JSON com a chave 'receitas'. Cada objeto contém:

1. `nome_do_prato`: Nome atraente em português.
2. `tempo_preparo`: Tempo estimado.
3. `porcoes`: Número de porções (inteiro).
4. `ingredientes_usados`: Lista de strings no formato "QUANTIDADE + NOME DO INGREDIENTE" (ex: "2 cenouras médias", "1 colher de sopa de azeite", "Sal a gosto"). Nunca retorne apenas a quantidade sem o nome.
5. `modo_de_preparo`: Lista de passos estruturados:
   - Fase de Preparo (mise en place, temperos, cortes)
   - Fase de Cocção (técnica térmica aplicada)
   - Fase de Montagem/Finalização
   - Mínimo 4 passos substantivos.
6. `visual_tag`: Descrição visual EM INGLÊS.
   - PRIORIDADE: Descreva os ingredientes visíveis no prato.
   - Foque na física: cores, texturas, formas, vapor, brilho.
   - Abstraia nomes culturais. Descreva o que se VÊ, não o que se chama.
7. `tipo_receita`: "destaque" ou "pratica".
"""

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
        Classifies items into categories for safety filtering.
        """
        messages = [
            {
                "role": "user", 
                "content": [
                    {
                        "type": "text", 
                        "text": (
                            "Analise esta imagem de nota fiscal ou lista de compras. "
                            "Extraia os itens, quantidades e CLASSIFIQUE cada item. "
                            "Categorias permitidas: 'alimento', 'limpeza', 'higiene', 'outros'. "
                            "RETORNE APENAS UM JSON PURO. NÃO use Markdown. "
                            "Formato: {'ingredientes': [{'item': 'nome', 'quantidade': 'qtd', 'categoria': 'cat'}]}"
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
                json_mode=True 
            )
            
            content = response.choices[0].message.content
            logger.info(f"Groq Vision Raw Output: {content}")

            # Sanitização inicial
            raw_data = self._sanitize_and_parse_json(content)
            
            # Validação Pydantic
            try:
                validated = VisionResponse.model_validate(raw_data)
                return validated.model_dump()
            except ValidationError as e:
                logger.warning(f"Vision validation failed, returning raw sanitized data: {e}")
                # Fallback: tentar adicionar categoria default se faltar
                if 'ingredientes' in raw_data:
                    for item in raw_data['ingredientes']:
                        if 'categoria' not in item:
                            item['categoria'] = 'outros' # Default safe
                return raw_data

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

    def _calculate_recipe_count(self, ingredients: list[str]) -> tuple[int, str]:
        """
        Retorna (num_receitas, contexto) baseado no volume de ingredientes.
        """
        count = len(ingredients)
        
        if count <= 5:
            return (2, "compra rápida - foco em praticidade")
        elif count <= 15:
            return (4, "compra média - variedade moderada")
        elif count <= 30:
            return (8, "compra grande - explore combinações criativas")
        else:
            return (12, "compra do mês - cardápio semanal completo")

    def generate_recipes(self, ingredients: list[str]) -> dict:
        """
        Generates creative recipes using the HEAVY model, falling back to FAST if needed.
        Uses dynamic scaling and Pydantic validation.
        """
        num_recipes, context = self._calculate_recipe_count(ingredients)
        ingredients_str = ", ".join(ingredients)
        
        dynamic_instructions = f"""
Crie exatamente {num_recipes} receitas para esta {context}.
Priorize:
- Diversidade de refeições (café/almoço/jantar/lanche)
- Aproveitamento máximo dos ingredientes listados
- Receitas que combinem múltiplos itens da lista
"""
        
        system_prompt = CHEF_SYSTEM_PROMPT.format(dynamic_instructions=dynamic_instructions)
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Ingredientes: {ingredients_str}"}
        ]
        
        response = self.execute_safe(
            messages,
            primary_model=settings.MODEL_HEAVY,
            fallback_model=settings.MODEL_FAST,
            json_mode=True
        )
        
        content = response.choices[0].message.content
        
        # Tentar parse + validação Pydantic
        try:
            validated = ReceitasResponse.model_validate_json(content)
            return validated.model_dump()
        except ValidationError as e:
            logger.warning(f"Pydantic validation failed, attempting sanitization: {e}")
            # Fallback: sanitização existente
            try:
                raw_data = self._sanitize_and_parse_json(content)
                # Tentar validar o dict sanitizado
                validated = ReceitasResponse.model_validate(raw_data)
                return validated.model_dump()
            except (ValidationError, ValueError) as e2:
                logger.error(f"Validation failed after sanitization: {e2}")
                # Retornar raw como último recurso se possível, ou raise
                if 'raw_data' in locals():
                    return raw_data
                raise ValueError("Falha crítica na validação das receitas.")

groq_service = GroqService()
