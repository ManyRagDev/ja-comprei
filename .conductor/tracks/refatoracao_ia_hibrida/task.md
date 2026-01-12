# Task: Refatoração IA Híbrida (Python/Groq)

## Setup e Estrutura [x]
- [x] Instalar dependências (`groq`, `python-multipart`, `pydantic-settings`) <!-- id: 0 -->
- [x] Criar estrutura de diretórios (`backend-ja-comprei/app/routers`, `backend-ja-comprei/app/services`, `backend-ja-comprei/app/core`) <!-- id: 1 -->
- [x] Criar arquivo `__init__.py` nos diretórios <!-- id: 2 -->

## Core & Configuração [x]
- [x] Implementar `app/core/config.py` com `pydantic-settings` para carregar `.env` <!-- id: 3 -->
- [x] Definir `AppConfig` com chaves de API e configuração de modelos (CONSTANTES) <!-- id: 4 -->

## Serviço Groq (Smart Client) [x]
- [x] Criar classe `GroqService` em `app/services/groq_service.py` <!-- id: 5 -->
- [x] Implementar método privado `_get_client` (Singleton ou via DI) <!-- id: 6 -->
- [x] Implementar lógica de `execute_safe(prompt, model_priority)` com try/except para `RateLimitError` <!-- id: 7 -->
- [x] Implementar fallback automático de `llama-3.3-70b` para `llama-3.1-8b` <!-- id: 8 -->

## Funcionalidades de IA [x]
- [x] Implementar `generate_recipes` usando `execute_safe` (Heavy Model) <!-- id: 9 -->
- [x] Implementar `parse_ingredients` usando `execute_safe` (Fast Model) <!-- id: 10 -->
- [x] Implementar `transcribe_audio` para usar Whisper <!-- id: 11 -->

## API & Rotas [x]
- [x] Criar `app/routers/voice_router.py` com endpoint `/transcribe` <!-- id: 12 -->
- [x] Migrar lógica de Receitas para `app/routers/recipe_router.py` <!-- id: 13 -->
- [x] Refatorar `main.py` para incluir os novos routers <!-- id: 14 -->
- [x] Remover código legado do `main.py` <!-- id: 15 -->

## Verificação [/]
- [x] Testar endpoint `/transcribe` com arquivo de áudio de exemplo <!-- id: 16 -->
- [x] Validar fallback forçando erro (mock ou variável de ambiente) <!-- id: 17 -->
