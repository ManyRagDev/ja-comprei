# Plano de Implementação: Integração Pollinations (Vision + Image Gen)

**Objetivo:** Adicionar a camada visual ao backend usando a API Pollinations. Isso inclui:
1.  **OCR:** Extrair texto de imagens de notas fiscais usando `POST /v1/chat/completions` (Vision).
2.  **Geração de Imagens de Receitas:** Gerar capas para receitas usando `GET /image/{prompt}` e injetar a URL no payload JSON.

---

## Escopo

### O que está incluso:
- Novo serviço `pollinations_service.py` com métodos para Vision e Image Gen.
- Novo orquestrador `ai_orchestrator.py` que combina Pollinations + Groq.
- Modificação da rota `/sugerir-receitas` para retornar receitas com `image_url`.
- Modificação da rota `/analisar-nota` para usar Vision em vez de decode de texto.

### O que NÃO está incluso:
- Geração de Vídeo (apenas imagem).
- Alterações no `groq_service.py` (mantido inalterado).

---

## Endpoints Pollinations Relevantes (api.json)

### 1. Vision (OCR)
- **Endpoint:** `POST https://gen.pollinations.ai/v1/chat/completions`
- **Model:** `openai` (ou `gemini` para maior contexto)
- **Body Example:**
```json
{
  "model": "openai",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Extraia todos os itens e valores desta nota fiscal." },
        { "type": "image_url", "image_url": { "url": "data:image/jpeg;base64,{BASE64_DATA}" } }
      ]
    }
  ]
}
```

### 2. Image Generation
- **Endpoint:** `GET https://gen.pollinations.ai/image/{prompt}`
- **Params:**
    - `model=flux` (Default: zimage, use `flux` para fotorealismo)
    - `width=800`
    - `height=600`
    - `nologo=true` (remove watermark)
- **Response:** Binary image (JPEG/PNG). **Para uso no frontend, basta passar a URL construída.**

---

## Passos de Implementação

- [ ] **1. Criar `app/services/pollinations_service.py`**
    - Classe `PollinationsService`.
    - Método `extract_text_from_image(image_buffer: bytes) -> str`:
        - Converte buffer para Base64.
        - Envia para `/v1/chat/completions` com Vision.
        - Retorna o texto extraído.
    - Método `get_image_url(prompt: str, width=800, height=600) -> str`:
        - Constrói a URL `https://gen.pollinations.ai/image/{encoded_prompt}?model=flux&width={w}&height={h}&nologo=true`.
        - Retorna a string da URL (não faz request, a URL é válida diretamente).

- [ ] **2. Criar `app/services/ai_orchestrator.py`**
    - Importa `groq_service` e `pollinations_service`.
    - Método `process_receipt_image(image_buffer: bytes) -> dict`:
        - Chama `pollinations.extract_text_from_image(image_buffer)` -> raw_text.
        - Chama `groq.parse_ingredients(raw_text)` -> JSON estruturado.
        - Retorna o JSON.
    - Método `generate_recipes_with_images(ingredients: list[str]) -> dict`:
        - Chama `groq.generate_recipes(ingredients)` -> `{ "receitas": [...] }`.
        - Itera sobre cada receita:
            - Gera prompt: `"Foto profissional de comida: {nome_do_prato}, iluminação natural, prato branco"`.
            - Chama `pollinations.get_image_url(prompt)` -> URL.
            - Injeta `receita["image_url"] = url`.
        - Retorna o objeto enriquecido.

- [ ] **3. Modificar `app/routers/recipe_router.py`**
    - Importar `ai_orchestrator`.
    - Rota `/sugerir-receitas`: Chamar `ai_orchestrator.generate_recipes_with_images(lista_nomes)`.
    - Rota `/analisar-nota`: Chamar `ai_orchestrator.process_receipt_image(content)` (em vez do fallback atual).

- [ ] **4. Adicionar `POLLINATIONS_API_KEY` (Opcional)**
    - Adicionar ao `.env` se necessário (endpoints públicos podem funcionar sem key).
    - Carregar em `app/core/config.py`.

- [ ] **5. Atualizar `.conductor/tech-stack.md`**
    - Adicionar `Pollinations API (Vision, Image Gen)` ao Backend.

---

## Verificação

### Manual
1.  Enviar uma imagem de nota fiscal para `/analisar-nota`.
2.  **Esperado:** JSON com ingredientes extraídos.
3.  Chamar `/sugerir-receitas` com ingredientes.
4.  **Esperado:** JSON com 3 receitas, cada uma contendo `image_url` válida.
5.  Abrir uma `image_url` no navegador.
6.  **Esperado:** Imagem fotorealista do prato gerada.

