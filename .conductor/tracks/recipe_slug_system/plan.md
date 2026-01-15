# Sistema de URLs com Slug para Receitas

## Goal Description
Implementar sistema hybrid de URLs: receitas temporárias (em memória) acessíveis por índice, e receitas salvas acessíveis por slug único e compartilhável.

## Proposed Changes

### [Migration SQL](file:///c:/Users/emanu/Documents/Projetos/Já comprei/.conductor/tracks/recipe_slug_system/migration.sql)
- [x] Adicionar coluna `slug` (TEXT UNIQUE) na tabela `recipes`.

---

### [recipeService.js](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/services/recipeService.js)
- [x] **Criar função `generateSlug(title)`**: Converte título em slug URL-friendly com sufixo HHMMSS (hora de criação).
- [x] **Atualizar `saveRecipeToSupabase`**: Gerar e salvar slug junto com a receita.
- [x] **Criar `getRecipeBySlug(slug)`**: Busca receita salva por slug.

---

### [App.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/App.jsx)
- [x] Adicionar nova rota `/r/:slug` para receitas salvas (URL curta e limpa).
- [x] Manter rota `/receita/:index` para receitas temporárias.

---

### [SavedRecipeDetailPage.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/pages/SavedRecipeDetailPage.jsx)
- [x] **[NEW]** Página para renderizar receita salva buscada por slug do Supabase.

---

### [RecipeDetail.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/components/RecipeDetail.jsx)
- [x] Após salvar com sucesso, redirecionar para a URL permanente `/r/:slug`.

---

## Verification Plan
### Manual Verification
1. Gerar receita → Acessar `/receita/0` → Funciona (temporária).
2. Salvar receita → Verificar redirecionamento para `/r/nome-da-receita-abc12`.
3. Copiar URL `/r/...` → Abrir em aba anônima → Receita carrega do Supabase.
4. Tentar acessar `/r/slug-inexistente` → Exibir 404 ou mensagem amigável.
