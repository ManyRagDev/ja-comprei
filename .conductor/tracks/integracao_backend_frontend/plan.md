# Track: Integração Frontend-Backend & UI Revamp

**Objetivo:**
Integrar o Frontend React com o Backend FastAPI (Groq), implementando a UI baseada nos mockups fornecidos e conectando o fluxo de "Sugestão de Receitas".

**Contexto:**
Temos um backend funcional com rotas `/sugerir-receitas` (Groq) e `/transcribe` (Whisper). O frontend atual usa dados mockados. Precisamos substituir os mocks por chamadas reais e atualizar o visual para corresponder aos designs "Premium" dos arquivos em `mockups/`.

**Mockups Disponíveis:**
1.  `landing_page`
2.  `scanner` (Câmera)
3.  `analisando` (Loading/Processamento)
4.  `lista_de_compras` (Ingredientes detectados)
5.  `sugestoes` (Lista de Receitas sugeridas)
6.  `receita` (Detalhe da Receita)

## User Review Required
> [!IMPORTANT]
> A implementação da UI será "Pixel Perfect" baseada nos HTMLs dos mockups, mas adaptada para components React reutilizáveis.
> O fluxo de "Voz" será deixado para uma fase posterior, conforme solicitado (Prioridade: Receitas).

## Proposed Changes

### Frontend (React)

#### [NEW] [api.ts](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/services/api.ts)
*   Criar instância base do `fetch` ou wrapper.
*   Configurar `baseURL` via variável de ambiente `VITE_API_URL`.
*   Método `sugerirReceitas(ingredientes: string[])`.

#### [MODIFY] [App.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/App.jsx)
*   Adicionar gerenciamento de estado para integração com API.
*   Atualizar fluxo de navegação para seguir a sequência dos mockups:
    *   Landing -> Scanner -> Analisando -> Lista de Compras (Edição) -> Sugestões -> Receita.

#### [MODIFY] [Components]
Refatorar ou criar componentes baseados no HTML dos mockups:
*   `Scanner.jsx`: Implementar visual da câmera com botão de captura.
*   `Ingredients.jsx` -> `ShoppingList.jsx`: Tela de conferência de ingredientes (Mockup: `lista_de_compras`).
*   `Loading.jsx` -> `Analyzing.jsx`: Tela de transição (Mockup: `analisando`).
*   `Recipes.jsx` -> `Suggestions.jsx`: Lista de cards horizontal/vertical (Mockup: `sugestoes`).
*   `RecipeDetail.jsx`: Tela rica com imagem e passos (Mockup: `receita`).

### Backend (FastAPI)
*   Assegurar que o CORS permite chamadas do localhost do Vite.

## Verification Plan

### Automated Tests
*   Não há testes E2E configurados.
*   Validar via `console.log` no browser e Network Tab.

### Manual Verification
1.  **Fluxo de Receitas:**
    *   Entrar na Landing Page.
    *   Clicar em "Experimentar".
    *   (Simular) Escanear/Enviar uma lista de ingredientes ou usar input manual (se houver no mockup).
    *   Verificar tela de "Analisando".
    *   Conferir lista de ingredientes retornada (Mockada ou Real se tiver OCR, se não, input manual).
    *   Clicar em "Gerar Receitas".
    *   Verificar se o request vai para `/sugerir-receitas`.
    *   Validar renderização dos cards com dados da IA.
