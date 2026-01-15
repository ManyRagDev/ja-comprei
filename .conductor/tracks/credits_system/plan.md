# Sistema de Créditos e God Mode

## Goal Description
Implementar um sistema de limitação de uso da IA baseado em créditos (1 Geração = 1 Crédito) para controlar custos, mantendo acesso ilimitado ("God Mode") para administradores (`dev@jacomprei.com`).

## User Review Required
> [!IMPORTANT]
> A lógica de desconto será implementada no Frontend (`recipeService.js`). Isso não é totalmente seguro contra usuários maliciosos avançados, mas atende ao requisito atual. Para segurança total, isso deve ser movido para o Backend (Python) ou PostgreSQL Functions (RPC) no futuro.

## Proposed Changes

### [Database Migration (Supabase)](file:///c:/Users/emanu/Documents/Projetos/Já comprei/.conductor/tracks/credits_system/migration.sql)
- **Tabela `profiles`**: Adicionar colunas:
    - `credits_balance` (int, default 3)
    - `subscription_tier` (text, limit 'free', 'pro', 'admin', default 'free')
- **Nova Tabela `credit_transactions`**:
    - `id` (uuid, pk)
    - `user_id` (uuid, fk profiles)
    - `amount` (int, transaction value e.g. -1)
    - `description` (text)
    - `created_at` (timestamp)
- **Policies**: Configurar RLS para permitir que o próprio usuário leia e "gaste" seus créditos (update).

### [recipeService.js](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/services/recipeService.js)
- **Implementar `checkCredits(userId)`**:
    - Buscar perfil.
    - Se `subscription_tier` == 'admin', retornar `{ allowed: true, isAdmin: true }`.
    - Se `credits_balance` > 0, retornar `{ allowed: true, isAdmin: false }`.
    - Senão, retornar `{ allowed: false }`.
- **Implementar `deductCredit(userId)`**:
    - Verificar novamente se é admin (se sim, abortar).
    - Decrementar 1 de `credits_balance`.
    - Inserir log em `credit_transactions`.

### Integrations
- **[App.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/App.jsx)** e **[SavedListDetailsPage.jsx](file:///c:/Users/emanu/Documents/Projetos/Já comprei/frontend-ja-comprei/src/pages/SavedListDetailsPage.jsx)**:
    - Adicionar verificação antes de `api.sugerirReceitas`.
    - Adicionar desconto após sucesso.

## Verification Plan
### Manual Verification
1.  **Cenário Admin:**
    - Logar com `dev@jacomprei.com`.
    - Tentar gerar receita.
    - Verificar que saldo NÃO mudou e NENHUM log foi criado.
2.  **Cenário Free (Com Crédito):**
    - Alterar banco manualmente: tier='free', saldo=1.
    - Gerar receita.
    - Verificar saldo=0 e log criado.
3.  **Cenário Free (Sem Crédito):**
    - Tentar gerar receita.
    - Verificar bloqueio (Alert/Erro).
