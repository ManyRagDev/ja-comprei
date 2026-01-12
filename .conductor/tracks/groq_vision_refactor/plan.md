# Plano de Refatoração: Arquitetura Groq-First Vision

**Objetivo:** Migrar o fluxo de OCR para utilizar exclusivamente o modelo de visão da Groq (Maverick), mantendo o Pollinations apenas para geração de imagens (capas/thumbnails). Implementar um fluxo linear e robusto.

## Contexto
Atualmente, utilizamos o Pollinations para Vision/OCR. A nova arquitetura delega a "visão" e a "inteligência" de texto inteiramente para o Groq, simplificando o orquestrador e melhorando o controle sobre o payload e resposta.

## Referências
- **Modelo Vision:** `meta-llama/llama-4-maverick-17b-128e-instruct` (Configurado em `config.py`)
- **API Reference:** `backend-ja-comprei/docs/groq/API_reference.md`

## 1. Configuração e Utilitários
- [ ] **Validar Configuração:** Verificar se `MODEL_VISION` está correto em `config.py`.
- [ ] **Criar Util de Imagem:** Implementar `src/utils/image_utils.py` com `encode_image_to_base64`.

## 2. Refatoração de Serviços (Core)
- [ ] **GroqService (OCR):**
    - Implementar `extract_text_vision(image_base64)`.
    - Adicionar lógica de **Sanitização de Resposta** (Regex/Parser) para garantir JSON limpo, removendo "sujeira" (markdown, explanações) antes do parse.
- [ ] **PollinationsService (Limpeza):**
    - Remover método `extract_text_from_image`.
    - Manter apenas `get_image_url`.

## 3. Orquestração (Fluxo Linear)
- [ ] **AIOrchestrator:**
    - Refatorar `process_receipt_image` para o novo fluxo:
        1. `file_buffer` -> `image_utils.encode` -> `base64`.
        2. `base64` -> `groq_service.extract_text_vision` -> `JSON (Ingredientes)`.
        3. (Opcional) Parse intermediário se o Vision retornar texto puro (mas o ideal é pedir JSON direto no prompt do Vision).
    - Manter `generate_recipes_with_images` chamando Pollinations para thumbnails.

## 4. Testes e Validação
- [ ] **Teste Manual:** Subir imagem de nota fiscal.
- [ ] **Verificação de Logs:** Confirmar que o payload para o Groq contém a `image_url` data-uri correta e que a resposta é processada sem erros de JSON.

## Arquivos Impactados
- `backend-ja-comprei/app/core/config.py`
- `backend-ja-comprei/app/services/groq_service.py`
- `backend-ja-comprei/app/services/pollinations_service.py`
- `backend-ja-comprei/app/services/ai_orchestrator.py`
- `backend-ja-comprei/app/utils/image_utils.py` (Novo)
