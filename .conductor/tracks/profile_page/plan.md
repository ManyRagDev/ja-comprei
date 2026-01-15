# Implementação da Página de Perfil

## Goal Description
Criar a página de Perfil (`/perfil`) para exibir informações do usuário logado e fornecer a funcionalidade de Logout. A página deve seguir a identidade visual do app (Dark/Light mode).

## User Review Required
> [!NOTE]
> Inicialmente, exibiremos apenas dados básicos (Email) e estatísticas simuladas ou simples, focando na funcionalidade de Logout.

## Proposed Changes

### [ProfilePage.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/pages/ProfilePage.jsx)
- **Novo Componente:**
    - Header com título "Meu Perfil".
    - Card de Informações do Usuário (Avatar placeholder + Email).
    - Seção de Estatísticas (Placeholder: "Receitas Salvas", "Listas").
    - Seção de Ações: Botão de Logout.
- **Lógica:**
    - Consumir `user` do `RecipeContext`.
    - Implementar `handleLogout` chamando `supabase.auth.signOut()`.

### [App.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/App.jsx)
- Adicionar rota `/perfil` apontando para `ProfilePage`.

### [RecipeContext.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/context/RecipeContext.jsx)
- Verificar se já exporta função de logout ou se precisa acessar supabase direto. (Verificado: precisa chamar supabase direto ou criar helper).

## Verification Plan
### Manual Verification
- Acessar `/perfil` via Menu Inferior.
- Verificar exibição do email correto.
- Clicar em "Sair" e verificar redirecionamento para Login/Home.
