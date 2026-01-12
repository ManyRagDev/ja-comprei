# Product: Já Comprei

## Visão Geral
Aplicação inteligente para gerenciamento de compras domésticas e culinária, utilizando IA para sugerir receitas, transcrever listas de compras por voz e analisar notas fiscais.

## Funcionalidades Principais
1.  **Lista de Compras Inteligente:** Adição rápida de itens, categorização automática.
2.  **Sugestão de Receitas:** IA analisa os ingredientes disponíveis e sugere receitas criativas (Chef Brasileiro).
3.  **Entrada por Voz:** Transcrição de áudio para listas ou comandos (Whisper).
4.  **Scanner de Notas:** Leitura de notas fiscais com feedback visual e animação dedicada.
5.  **Interface Moderna:** Design responsivo (Mobile-First) com suporte total a Light/Dark Mode.
6.  **Dashboard:** Hub centralizado para acesso rápido a todos os serviços.
7.  **Privacidade:** Controle rigoroso de câmera (ativa apenas na tela de Scanner com indicador visual).
8.  **Experiência Visual Imersiva:** Geração de imagens de pratos coerentes com as receitas (Pollinations AI) e telas de espera interativas com dicas culinárias.

## Público Alvo
Pessoas responsáveis pelas compras da casa e cozinha, buscando otimizar tempo e reduzir desperdício.

---

## Backlog (Funcionalidades Futuras)

### Receitas Persistentes por Usuário
As receitas geradas serão associadas ao ID do usuário autenticado, permitindo:
- URL única por receita (ex: `/receita/:userId/:receitaId`).
- Histórico pessoal de receitas salvas.
- Possibilidade de favoritar e organizar em coleções.

### Receitas Públicas/Privadas e Compartilhamento
Configuração de visibilidade por receita:
- **Privada (padrão):** Apenas o criador pode acessar.
- **Pública:** URL acessível por qualquer pessoa, sem autenticação.
- **Link Secreto:** URL única não-indexada, compartilhável diretamente.

**Considerações Técnicas (Análise Preliminar):**
- Campo `visibility` na tabela de receitas: `private | public | unlisted`.
- Middleware de autorização no backend para verificar permissões.
- No frontend, botão "Compartilhar" que copia a URL ou abre modal de configuração.
