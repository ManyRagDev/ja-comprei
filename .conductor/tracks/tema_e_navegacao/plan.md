# Plano de Implementação: Tema & Navegação

**Objetivo:** Implementar controle de tema (Dark Default) e navegação responsiva (Drawer vs TopBar).

## User Review Required
> [!IMPORTANT]
> O "Dark Mode" será forçado como padrão inicial. Caso o usuário tenha preferência de sistema por "Light", isso será ignorado inicialmente em favor da configuração padrão do site, até que ele clique no Toggle.

## Proposed Changes

### 1. Configuração de Tema (Tailwind & CSS)
#### [MODIFY] [index.css](file:///c:/Users/emanu/Documents/Projetos/Já%20comprei/frontend-ja-comprei/src/index.css)
- Assegurar que as variáveis de cor tenham versões para Light e Dark.
- Atualmente já existe `dark:bg-...`, garantiremos que a classe `dark` seja aplicada ao `html` por padrão.

### 2. Componente de Landing Page
#### [MODIFY] [LandingPage.jsx](file:///c:/Users/emanu/Documents/Projetos/Já%20comprei/frontend-ja-comprei/src/LandingPage.jsx)
- **State:** Adicionar `theme` ('dark' | 'light') e `isMenuOpen` (boolean).
- **Effect:** Ao montar, adicionar a class `dark` ao elemento `html` (padrão solicitado).
- **Header:**
    - Adicionar botão Toggle (Sol/Lua) antes do menu.
    - Adicionar lista de links (`ul > li > a`) visível apenas em `md:flex`.
    - Esconder botão Hambúrguer em `md:hidden`.
- **Drawer (Novo Elemento):**
    - Criar um overlay fixo (`fixed inset-0`) visível apenas quando `isMenuOpen === true`.
    - Botão de fechar (X).
    - Lista de links vertical.

## Verification Plan

### Manual Verification
1.  **Carregamento:** Recarregar a página e confirmar que abre em modo Escuro.
2.  **Toggle:** Clicar no Sol -> Site fica Claro. Clicar na Lua -> Site fica Escuro.
3.  **Desktop:** Verificar Top Bar com links ("Como funciona", "Benefícios", "Preços", "Entrar"). Menu Hambúrguer deve sumir.
4.  **Mobile:** Verificar Menu Hambúrguer. Clicar deve abrir Drawer. Todos os links devem estar lá.
