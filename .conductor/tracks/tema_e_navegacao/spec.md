# Specification: Tema & Navegação

## Contexto
O usuário deseja refinar a experiência de navegação e visualização, definindo o modo Escuro como padrão (com opção de alternar para Claro) e melhorando a hierarquia de navegação em telas maiores.

## Requisitos de Produto
1.  **Tema Escuro por Padrão:**
    *   A aplicação deve iniciar com cores escuras (Dark Mode).
    *   **Toggle Switch:** Um botão (ícone Sol/Lua) deve permitir alternar para o tema Claro.
    *   **Persistência:** (Opcional por enquanto, mas ideal) Lembrar a escolha do usuário se possível, ou apenas manter o padrão pedido.

2.  **Navegação Desktop/Tablet (Top Bar):**
    *   Substituir o ícone de Hambúrguer por links textuais diretos.
    *   **Itens:** "Como funciona", "Benefícios", "Preços", "Entrar".
    *   **Estilo:** Links discretos, com hover effect (ex: cor Sage).

3.  **Navegação Mobile (Hamburger Drawer):**
    *   Manter botão Hambúrguer apenas em telas pequenas.
    *   **Ação:** Ao clicar, abrir uma "Gaveta" (Drawer) lateral ou overlay cobrindo a tela com os mesmos links do desktop.

## Requisitos Técnicos
*   **Tailwind CSS:** Utilizar a estratégia de classes (`dark` class no `html` ou `body`) para gerenciar os temas. Verificar se o setup atual (v4) já suporta isso nativamente ou se precisa de ajuste em `index.css`.
*   **Componentes:**
    *   Atualizar `LandingPage.jsx`.
    *   Criar componentes internos se necessário (ex: `NavLinks`, `ThemeToggle`) para evitar código espaguete, mas manter simples.
