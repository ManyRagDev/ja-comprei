# Plano de Implementação: Refinamento e Responsividade

**Objetivo:** Adaptar a interface atual (Mobile First) para oferecer uma experiência "Premium" também em telas maiores (Tablet/Desktop), removendo as restrições artificiais de largura e implementando layouts adaptativos.

## User Review Required
> [!IMPORTANT]
> A remoção do `max-w-md` no `App.jsx` alterará fundamentalmente a visualização em Desktop. O layout deixará de ser um "frame de celular" para ocupar a tela toda.

## Proposed Changes

### 1. Framework & Configuração
#### [MODIFY] [App.jsx](file:///c:/Users/emanu/Documents/Projetos/Já%20comprei/frontend-ja-comprei/src/App.jsx)
- **Mobile (Default):** Manter comportamento atual (sem mudanças visuais).
- **Tablet/Desktop (`md:`/`lg:`):** Remover limites de largura artificial (`max-w-md`).
- Introduzir container responsivo que se adapta:
    - Mobile: 100% width
    - Tablet: `max-w-3xl`
    - Desktop: `max-w-7xl`

### 2. Adaptação de Componentes
*Estratégia:* Usar prefixos utility do Tailwind (`md:`, `lg:`) para **adicionar** comportamento, nunca alterar o CSS base que já funciona para mobile.

#### [MODIFY] [LandingPage.jsx](file:///c:/Users/emanu/Documents/Projetos/Já%20comprei/frontend-ja-comprei/src/LandingPage.jsx)
- Revisar espaçamentos e fontes para telas ultra-wide, mantendo a identidade visual.

#### [MODIFY] [Scanner.jsx](file:///c:/Users/emanu/Documents/Projetos/Já%20comprei/frontend-ja-comprei/src/components/Scanner.jsx)
- **Mobile:** Tela cheia (comportamento atual).
- **Desktop:** Container centralizado (aspect ratio de celular) com fundo desfocado ou escurecido (“Cinema Mode”), para não esticar a webcam de forma não natural.

#### [MODIFY] [ShoppingList.jsx](file:///c:/Users/emanu/Documents/Projetos/Já%20comprei/frontend-ja-comprei/src/components/ShoppingList.jsx)
- **Mobile:** Lista vertical (atual).
- **Tablet:** Grid de 2 colunas.
- **Desktop:** Grid de 3 colunas. Manter estilo dos cards de ingredientes idêntico, apenas mudando o layout.

#### [MODIFY] [Suggestions.jsx](file:///c:/Users/emanu/Documents/Projetos/Já%20comprei/frontend-ja-comprei/src/components/Suggestions.jsx)
- **Mobile:** Lista vertical/Carrossel (atual).
- **Tablet:** Grid de 2 colunas.
- **Desktop:** Grid de 3 ou 4 colunas. Cards mantêm a mesma proporção e design interno.

#### [MODIFY] [RecipeDetail.jsx](file:///c:/Users/emanu/Documents/Projetos/Já%20comprei/frontend-ja-comprei/src/components/RecipeDetail.jsx)
- **Desktop:** Layout de duas colunas:
    - **Esquerda:** Imagem do prato (fixa/sticky).
    - **Direita:** Ingredientes e Modo de Preparo scrollável.

## Verification Plan

### Teste Visual Manual
- Usar DevTools do Chrome para simular:
    - Mobile (iPhone SE, iPhone 14 Pro)
    - Tablet (iPad Air)
    - Desktop (1920x1080)
- Verificar se elementos não "quebram" ou ficam esticados.
