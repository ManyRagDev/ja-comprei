# Walkthrough: Tema e Navegação

## Resumo
Implementamos o suporte a **Dark Mode por padrão**, com um toggle switch para alternar entre temas. Também substituímos o menu hambúrguer no desktop por uma barra de navegação completa e adicionamos um Drawer lateral para o mobile.

## O Que Foi Feito

### 1. Dark Mode (Padrão)
O site agora carrega inicialmente com fundo escuro (`#171b19`) e textos claros.
- **Toggle:** Um botão com ícone de Sol/Lua foi adicionado ao cabeçalho.
- **Funcionamento:** Alterna instantaneamente a classe `dark` no elemento `html`.

### 2. Navegação Desktop
Em telas médias e grandes (`md:`), o menu hambúrguer desaparece.
- **Links Novos:** "Como Funciona", "Benefícios", "Preços", "Entrar".
- **Estilo:** Links textuais com hover effect na cor Sage.

### 3. Navegação Mobile
Em telas pequenas, o menu hambúrguer permanece.
- **Drawer:** Ao clicar no hambúrguer, um menu lateral desliza da direita.
- **Conteúdo:** Contém os mesmos links de navegação e um botão CTA "Começar Agora".
- **Fechamento:** Pode ser fechado pelo botão "X" ou clicando fora (backdrop).

## Como Testar

### 1. Verificar Tema Padrão
1.  Recarregue a página (F5).
2.  Confirme se o fundo está escuro e o texto branco/cinza.

### 2. Testar Toggle
1.  Localize o ícone de **Sol** no cabeçalho (ao lado do menu ou links).
2.  Clique nele. O site deve ficar claro (fundo Cream).
3.  Clique na **Lua**. O site deve voltar a ficar escuro.

### 3. Testar Navegação
1.  **Desktop:** Abra a janela em tela cheia. Você deve ver os links no topo. O hambúrguer deve sumir.
2.  **Mobile:** Reduza a janela. Os links devem sumir e o Hambúrguer aparecer.
3.  Clique no Hambúrguer. O Drawer deve abrir.
4.  Clique no backdrop ou no X para fechar.
