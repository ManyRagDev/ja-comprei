# Polimento de UI: Conflitos de Navegação

## Goal Description
Resolver problemas de sobreposição causados pela barra de navegação inferior (BottomNav) em diversas telas, garantindo que botões de ação e conteúdos vitais estejam sempre visíveis e clicáveis. Remover menus redundantes identificados pelo usuário.

## User Review Required
None

## Proposed Changes

## Proposed Changes

### [RecipeDetail.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/components/RecipeDetail.jsx)
- **Ação:** Remover o container do botão flutuante (`fixed bottom-6 right-6`).
- **Ação:** Mover o bloco do botão "Salvar Receita" para dentro do fluxo principal (`<div className="flex flex-col gap-5">...</div>`), logo após o "Modo de Preparo".
- **Estilo:** Alterar classes para centralizar e remover posicionamento fixo. Garantir `mb-8`.

### [Suggestions.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/components/Suggestions.jsx)
- **Ação:** Remover todo o bloco `<nav>` (linhas 101-121).
- **Ação:** Remover padding extra `pb-28` do main se não for mais necessário (manter `pb-24` padrão do layout ou similar).

## Verification Plan
### Manual Verification
1.  **Detalhes da Receita:**
    - Abrir uma receita salva ou sugerida.
    - Rolar até o fim.
    - O botão "Salvar" deve estar visível _acima_ da barra de navegação principal, sem sobreposição.
2.  **Sugestões:**
    - Gerar sugestões.
    - Verificar se o "menu extra" sumiu.
    - Verificar se o conteúdo é rolável até o fim sem cortes.

### [Scanner.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/components/Scanner.jsx)
- **Problema:** Verificar botões flutuantes.

## Verification Plan
### Manual Verification
- Acessar `/receita/:id` e verificar visibilidade dos botões.
- Acessar `/sugestoes` e verificar layout.
- Acessar `/scanner` e verificar layout.
