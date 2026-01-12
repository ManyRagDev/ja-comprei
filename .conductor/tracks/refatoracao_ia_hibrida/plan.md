# Track: Refatoração do Serviço de IA (Arquitetura Híbrida Groq - Python)

**Objetivo:**
Refatorar o backend FastAPI (`backend-ja-comprei`) para implementar uma arquitetura de serviços modular, introduzindo o `GroqService` com estratégia de múltiplos modelos ("Router"). O objetivo é otimizar o consumo de cotas da API Groq, evitar Rate Limit (429) e suportar transcrição de áudio (Whisper), substituindo ou complementando a implementação atual do Gemini onde aplicável.

**Contexto:**
O backend atual reside em um único arquivo `main.py` usando Gemini. Precisamos profissionalizar a arquitetura e introduzir a Groq com controle de custos/limites.
Hierarquia de Modelos (Groq):
1.  **Raciocínio Complexo (Receitas):** `llama-3.3-70b-versatile` (Limite: 1K RPD).
2.  **Processamento Rápido (OCR Parsing/Chat Simples):** `llama-3.1-8b-instant` (Limite: 14.4K RPD).
3.  **Áudio (Voz):** `whisper-large-v3-turbo` (Limite: 2K RPD).
4.  **Fallback/Safety:** `llama-3.1-8b-instant` assume se o 70b falhar.

**Plano de Implementação (Tasks):**

## Estruturação do Projeto (Refactor Inicial)
A primeira fase foca em reorganizar o código existente de "Single File Script" para "Modular App".

#### [NEW] [config.py](file:///c:/Users/emanu/Documents/Projetos/J%C3%A1%20comprei/backend-ja-comprei/app/config.py)
*   Centralizar variáveis de ambiente (Pydantic Settings).
*   Definir Constantes de Modelos (ENUMs).

#### [NEW] [groq_service.py](file:///c:/Users/emanu/Documents/Projetos/J%C3%A1%20comprei/backend-ja-comprei/app/services/groq_service.py)
*   Implementar classe `GroqClient`.
*   Método `_make_request_with_fallback`: Tenta modelo primário -> Captura 429 -> Tenta modelo secundário.
*   Método `generate_recipes`: Usa modelo Heavy.
*   Método `parse_ingredients`: Usa modelo Fast.
*   Método `transcribe_audio`: Usa modelo Whisper.

#### [NEW] [voice.py](file:///c:/Users/emanu/Documents/Projetos/J%C3%A1%20comprei/backend-ja-comprei/app/routers/voice.py)
*   Endpoint `POST /transcribe`: Recebe `UploadFile`, valida formato, chama `GroqService.transcribe_audio`.

#### [MODIFY] [main.py](file:///c:/Users/emanu/Documents/Projetos/J%C3%A1%20comprei/backend-ja-comprei/main.py)
*   Remover lógica de negócio direta.
*   Importar e incluir Routers (`recipes`, `voice`).
*   Configurar DI (Dependency Injection) para os serviços.

## Detalhamento das Atividades "Alta Entropia"
(Estas atividades serão rastreadas no `task.md`)

1.  **Setup do Ambiente Python**: Instalar `groq`, `python-multipart` (para upload).
2.  **Criação da Estrutura de Pastas**: `app/`, `app/services`, `app/routers`, `app/core`.
3.  **Implementação do Fallback**: Criar decorador ou wrapper que captura `groq.RateLimitError` e re-tenta com modelo leve.
4.  **Migração de Lógica**: Mover a lógica de "Sugerir Receitas" do `main.py` atual para `app/services/recipe_service.py` (ou dentro do `groq_service`).
5.  **Teste de Carga Simulado**: Criar script para forçar 429 (opcional/manual) e validar troca de modelo.

**Critérios de Aceite:**
*   Estrutura de pastas modular criada.
*   Endpoint de transcrição de áudio funcional (`/transcribe`).
*   Endpoint de sugestão de receitas portado para usar Groq (com fallback).
*   Logs explícitos mostrando qual modelo atendeu cada requisição.