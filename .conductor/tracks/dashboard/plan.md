# Plano de Implementação: Dashboard da Área Logada [Concluído]

**Objetivo:** Criar a tela principal do usuário autenticado, um "Hub" de acesso rápido a todas as funcionalidades do app (Escanear Nota, Lista de Compras, Gerador de Receitas, etc.), com design moderno e responsivo.

> [!IMPORTANT]
> Neste momento, o login é **bypassed**: o botão "Entrar" na LandingPage redireciona diretamente para o Dashboard sem autenticação.

---

## Escopo

### O que está incluso:
- Componente `Dashboard.jsx` com layout de cards/ícones para cada serviço.
- Integração no fluxo `App.jsx` via nova rota/estado `'dashboard'`.
- Bypass: botão "Entrar" na `LandingPage.jsx` navega para `'dashboard'`.
- Suporte a Dark Mode e Responsividade (Mobile-First).

### O que NÃO está incluso:
- Tela de Login/Cadastro.
- Autenticação real (Supabase Auth, etc.).
- Lógica de sessão ou persistência de usuário.

---

## Proposta de UI

O Dashboard terá:
1.  **Header:** Saudação personalizada ("Olá, Chef!"), ícone do perfil (decorativo por ora) e toggle de tema.
2.  **Grid de Serviços (Cards):**
    - **Escanear Nota:** Ícone de câmera/recibo. Navega para `'scanner'`.
    - **Minhas Listas:** Ícone de lista. (Rota futura, pode exibir placeholder ou ir para `'shopping-list'`).
    - **Gerar Receitas:** Ícone de chef/livro. (Rota futura ou fluxo direto).
    - **Entrada por Voz:** Ícone de microfone. (Funcionalidade futura).
3.  **Rodapé (Opcional):** Links para Configurações, Ajuda.

---

## Passos de Implementação

- [ ] **1. Criar Componente `Dashboard.jsx`**
    - Local: `frontend-ja-comprei/src/components/Dashboard.jsx`
    - Implementar layout com Header, Grid de Cards de Serviço.
    - Utilizar variantes `dark:` para tema escuro.
    - Cada card deve ter um `onClick` que navegue para a tela correspondente via prop `onNavigate`.

- [ ] **2. Integrar Dashboard no `App.jsx`**
    - Adicionar estado `'dashboard'` no `switch` de `renderScreen`.
    - Passar função `onNavigate` para `Dashboard` para permitir navegação interna.

- [ ] **3. Implementar Bypass de Login**
    - Modificar `LandingPage.jsx`: o link/botão "Entrar" deve chamar `onNavigate('dashboard')` (ou prop similar).
    - Garantir que `App.jsx` passa a callback correta para `LandingPage`.

- [ ] **4. Polimento Visual e Responsividade**
    - Ajustar grid para `grid-cols-2` no mobile e `grid-cols-4` no desktop.
    - Adicionar micro-animações nos cards (hover scale, etc.).

---

## Verificação

### Manual
1.  Rodar `npm run dev` no frontend.
2.  Na Landing Page, clicar em "Entrar".
3.  **Esperado:** O Dashboard deve ser exibido com os cards de serviço.
4.  Clicar no card "Escanear Nota".
5.  **Esperado:** Redireciona para a tela do Scanner.
6.  Testar alternância de tema (Light/Dark) no Dashboard.
7.  Testar responsividade (redimensionar janela ou usar DevTools mobile).

