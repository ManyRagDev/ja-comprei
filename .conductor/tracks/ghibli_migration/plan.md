# Migração de Identidade Visual (Estilo Ghibli)

## Objetivo
Pivotar a estratégia visual do projeto para usar 100% imagens geradas por IA no estilo "Studio Ghibli" (Anime Food), garantindo consistência total e removendo a dependência do Pexels.

---

## User Review Required

> [!IMPORTANT]
> **Pivô Estratégico:** Esta mudança REMOVE permanentemente a integração com Pexels e força o uso de IA para todas as imagens. Certifique-se de que a API do Pollinations está estável.

---

## Arquitetura e Fluxo

```mermaid
graph TD
    A[Groq (Chef)] -->|Gera JSON| B(Receita + visual_tag)
    B --> C[AI Orchestrator]
    C -->|visual_tag| D[Pollinations Service]
    D -->|Prompt Ghibli Template| E[Pollinations API (Flux)]
    E -->|URL Imagem| F[Receita Final]
```

---

## Proposed Changes

### 1. Limpeza (Deletions)

- **[DELETE]** `app/services/pexels_service.py`
- **[MODIFY]** `app/core/config.py`: Remover `PEXELS_API_KEY` e `IMAGE_PROVIDER`.

### 2. Backend Schemas & Prompts

#### [MODIFY] [schemas.py](file:///c:/Users/emanu/Documents/Projetos/Já comprei/backend-ja-comprei/app/schemas.py)
- Adicionar campo `visual_tag: str` (Obrigatório) no modelo `Receita`.

#### [MODIFY] [groq_service.py](file:///c:/Users/emanu/Documents/Projetos/Já comprei/backend-ja-comprei/app/services/groq_service.py)
- Atualizar `CHEF_SYSTEM_PROMPT` para instruir a criação da `visual_tag` em Inglês.
- Regra de tradução de termos culturais (ex: Moqueca -> Fish stew).

### 3. Serviço de Imagem (Refactor)

#### [MODIFY] [pollinations_service.py](file:///c:/Users/emanu/Documents/Projetos/Já comprei/backend-ja-comprei/app/services/pollinations_service.py)
- Atualizar método `get_image_url` (ou criar novo dedicado).
- Modelo: `flux`.
- Template Prompt Presets:
  ```python
  template = f"Anime food illustration, Studio Ghibli style. {visual_tag}. Steaming hot, glossy texture, vibrant colors, delicious, hand drawn 2D art, cozy atmosphere."
  negative = "photorealistic, 3d render, plastic, low resolution, blurry, text, watermark, photo, real."
  ```
- Dimensões: 1024x1024.

#### [MODIFY] [ai_orchestrator.py](file:///c:/Users/emanu/Documents/Projetos/Já comprei/backend-ja-comprei/app/services/ai_orchestrator.py)
- Remover lógica de `IMAGE_PROVIDER`.
- Remover import de `pexels_service`.
- Usar sempre `pollinations_service` passando a `visual_tag` vinda da receita.

### 4. Riscos e Dependências (Critical Path)

> [!WARNING]
> **Dependência Externa (Pollinations):** O serviço é gratuito e sem SLA garantido.
> - **Risco:** Latência alta ou downtime da API.
> - **Mitigação:** Monitorar erros e logs. Como é um projeto MVP/Portfolio, o risco é aceitável, mas deve ser documentado.
> - **Autenticação (CRÍTICO):** O Pollinations **EXIGE** uma chave de API válida para todas as requisições de geração de imagem. A variável `POLLINATIONS_API_KEY` torna-se obrigatória no `.env`. Falha ao fornecer o token resultará em erro 401/403.

### 5. Métricas de Sucesso

| Métrica | Meta | Verificação |
|---------|------|-------------|
| **Consistência Visual** | 100% das imagens estilo Ghibli | Inspeção visual de 5 receitas geradas |
| **Taxa de Falha** | < 5% de erros na geração da URL | Logs de erro no `pollinations_service` |
| **Tempo de Resposta** | < 3s para gerar URL (assíncrono) | Logs de performance |
| **Qualidade da Tag** | `visual_tag` sempre em Inglês | Inspeção do JSON no Banco/Logs |

---

## Verification Plan

### Scenarios & Usage Cases
- **Cenário 1: Prato Cultural (Moqueca)**
  - *Input:* "Moqueca"
  - *Expected Visual Tag:* "Fish stew in clay pot, shrimp, savory sauce..." (Inglês)
  - *Result:* Imagem estilo anime de ensopado em panela de barro.
- **Cenário 2: Ingredientes Simples (Ovo Frito)**
  - *Input:* "Ovo Frito"
  - *Expected Visual Tag:* "Fried egg, sunny side up, crispy edges..."
  - *Result:* Ilustração apetitosa de ovo frito brilhante.

### Automated Tests
1. **Script de Geração de Prompt:**
   - Criar script que simula uma chamada ao Pollinations com o novo template e verifica se a URL é gerada corretamente.

### Manual Verification
1. **Geração de Receita Completa:**
   - Rodar o backend (`uvicorn`).
   - Usar o scanner/endpoint de sugestão com ingredientes brasileiros (ex: arroz, feijão, bife).
   - Verificar logs do Groq para confirmar que `visual_tag` foi gerada em inglês (ex: "Rice beans steak...").
   - Abrir a URL da imagem gerada no navegador e confirmar o estilo Ghibli.

---

## Checklist

- [x] Remover `pexels_service.py` e limpar `config.py` e `tech-stack.md`
- [x] Atualizar `schemas.py` com `visual_tag`
- [x] Atualizar Prompt do Chef em `groq_service.py`
- [x] Atualizar `pollinations_service.py` com novo template Ghibli
- [x] Refatorar `ai_orchestrator.py` para fluxo direto
- [x] Verificar geração de imagens
