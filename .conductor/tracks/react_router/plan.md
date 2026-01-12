# Plano de Implementação: React Router DOM

**Objetivo:** Implementar roteamento real na aplicação Frontend usando `react-router-dom`. Isso permitirá URLs amigáveis, navegação com histórico do navegador (botão voltar), e links compartilháveis.

---

## Escopo

### O que está incluso:
1.  Instalação da dependência `react-router-dom@6`.
2.  Criação de um arquivo de rotas centralizado.
3.  Refatoração do `App.jsx` para usar `Routes` e `Route`.
4.  Substituição de `setCurrentScreen()` por `useNavigate()`.
5.  Suporte a parâmetros dinâmicos (ex: `/receita/:id`).

### O que NÃO está incluso:
- Autenticação/proteção de rotas (feature futura).
- Server-Side Rendering (SSR).

---

## Mapeamento de Rotas

| Tela Atual          | Nova Rota              | Componente       |
|---------------------|------------------------|------------------|
| `landing`           | `/`                    | `LandingPage`    |
| `dashboard`         | `/dashboard`           | `Dashboard`      |
| `scanner`           | `/scanner`             | `Scanner`        |
| `scanning`          | `/scanning`            | `Scanning`       |
| `analyzing`         | `/analyzing`           | `Analyzing`      |
| `shopping-list`     | `/lista`               | `ShoppingList`   |
| `suggestions`       | `/sugestoes`           | `Suggestions`    |
| `detail`            | `/receita/:id`         | `RecipeDetail`   |

---

## Passos de Implementação

### Setup

- [ ] **1. Instalar `react-router-dom`**
    ```bash
    npm install react-router-dom
    ```

- [ ] **2. Atualizar `.conductor/tech-stack.md`**
    - Adicionar: `react-router-dom (v6.x) - Client-side routing`

---

### Refatoração do App.jsx

- [ ] **3. Importar dependências do React Router**
    ```javascript
    import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
    ```

- [ ] **4. Envolver a aplicação com `<BrowserRouter>`**
    - Pode ser no `main.jsx` ou no próprio `App.jsx`.

- [ ] **5. Substituir `switch(currentScreen)` por `<Routes>`**
    ```jsx
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
        {/* ... */}
    </Routes>
    ```

- [ ] **6. Criar componente `RouterApp.jsx`** (opcional, para organização)
    - Centralizar todas as rotas em um arquivo dedicado.

---

### Refatoração de Navegação

- [ ] **7. Substituir `setCurrentScreen()` por `navigate()`**
    - Em cada componente que usa `onBack` ou navegação:
      ```javascript
      const navigate = useNavigate();
      // Antes: onBack={() => setCurrentScreen('dashboard')}
      // Depois: onBack={() => navigate('/dashboard')}
      ```

- [ ] **8. Refatorar `Dashboard.jsx`**
    - `onNavigate` agora deve chamar `navigate('/rota')`.

- [ ] **9. Refatorar `Suggestions.jsx`**
    - `onSelectRecipe` agora deve navegar para `/receita/:id`.
    - Será necessário armazenar as receitas em um contexto global ou passar via state do router.

- [ ] **10. Refatorar `RecipeDetail.jsx`**
    - Usar `useParams()` para capturar o `:id` da receita.
    - Buscar a receita do contexto ou state.

---

### Gerenciamento de Estado Global (Receitas)

- [ ] **11. Criar `RecipeContext.jsx`** (Context API)
    - Armazenar as receitas geradas para que `RecipeDetail` possa acessá-las via ID.
    - Alternativa: Usar `useLocation().state` para passar dados entre rotas.

---

### Limpeza

- [ ] **12. Remover `currentScreen` e `setCurrentScreen` do App.jsx**
    - Não serão mais necessários após a migração.

- [ ] **13. Remover props `onBack` desnecessárias**
    - Substituir por `navigate(-1)` (voltar na história) ou rotas explícitas.

---

## Verificação

### Manual
1.  Acessar `http://localhost:5173/` — Deve carregar a Landing Page.
2.  Navegar para `/dashboard` — Dashboard deve aparecer.
3.  Clicar em "Sugerir Receitas" — URL deve mudar para `/sugestoes`.
4.  Clicar em uma receita — URL deve mudar para `/receita/123`.
5.  Usar o **botão Voltar do navegador** — Deve retornar à tela anterior corretamente.
6.  **F5 (Refresh)** em `/dashboard` — Deve permanecer no Dashboard (não voltar para landing).

---

## Fluxo de Navegação (Mermaid)

```mermaid
graph TD
    A[/ Landing] --> B[/dashboard Dashboard]
    B --> C[/scanner Scanner]
    C --> D[/scanning Scanning]
    D --> E[/lista ShoppingList]
    E --> F[/analyzing Analyzing]
    F --> G[/sugestoes Suggestions]
    G --> H[/receita/:id RecipeDetail]
    H --> G
    G --> E
```

