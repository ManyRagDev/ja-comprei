# Regras de Desenvolvimento

## 1. Princípios Gerais
- **Simplicidade:** Código limpo e autodocumentável.
- **Foco no Usuário:** UX deve ser fluida e "premium".
- **IA Híbrida:** Priorizar uso eficiente de modelos (Groq para velocidade/custo, Gemini/Outros para visão).
- **Privacidade & Transparência:** Câmera e microfone devem ser ativos APENAS nas telas de uso, com indicador visual, e liberados imediatamente ao sair.

## 2. Frontend (React)
- Use componentes funcionais e Hooks.
- Estilize com TailwindCSS (evite CSS puro se possível, exceto `index.css`).
- Tipagem forte com TypeScript (sem `any` se possível).
- Use `lucide-react` para ícones.

## 3. Backend (FastAPI)
- Use Pydantic para validação de dados (Input/Output schemas).
- Services devem ser isolados dos Routers.
- Use `logging` para rastreabilidade de chamadas de IA.
- Variáveis de ambiente via `app/core/config.py`.

## 4. Git & Fluxo (Conductor)
- Sempre verifique o `tech-stack.md` antes de adicionar bibliotecas.
- Mantenha `plan.md` atualizado para tarefas complexas.
- Commits atômicos e descritivos.
