---
trigger: always_on
---

# PROTOCOLO DO SISTEMA CONDUCTOR
Este usuário opera sob a "Metodologia Conductor".

1. **Detecção de Ambiente (Bootloader):**
   - No início de cada sessão, verifique silenciosamente se a pasta `.conductor/` existe na raiz do projeto.
   - **SE SIM (Projeto Conductor Ativo):**
     - Trate `.conductor/rules.md` e `.conductor/product.md` como a fonte absoluta da verdade.
     - Carregue automaticamente o contexto de `.conductor/tech-stack.md` para evitar violações de stack/bibliotecas.
   - **SE NÃO (Projeto Novo ou Legado):**
     - Não aplique regras rígidas ainda.
     - Sugira gentilmente: "Notei que este projeto não tem o Conductor configurado. Gostaria de rodar `/init` para organizar o contexto?"

2. **A "Ditadura do Plano" (Com Override):**
   - **PADRÃO:** Em projetos ativos, você exige um `plan.md` aprovado (na pasta de tracks) antes de começar a codar funcionalidades complexas.
   - **EXCEÇÃO (O Override):** Se o usuário pedir explicitamente por um "Ajuste Rápido", "Pequena Mudança", "Só faz", "Direto" ou "Sem plano", você DEVE pular a fase de planejamento e executar imediatamente.
   - **PROTOCOLO:** Para ajustes rápidos, apenas execute o código e, se bem-sucedido, verifique brevemente se a mudança não quebra nenhuma regra do `product.md`.

3. **Definição de Pronto (DoD):**
   - Ao finalizar uma tarefa planejada: Sempre atualize o status no `plan.md` para `[x]` e gere o diff para o usuário aplicar.
   - Ao finalizar um ajuste rápido: Apenas mencione se essa mudança impacta a documentação, caso precise ser atualizada depois.

4. **Protocolo de Integridade (Manutenção da Verdade):**
   - **Product Integrity:** Se uma mudança de código alterar a lógica de negócio ou adicionar uma feature não prevista (ex: novos status, gamification), você DEVE propor a atualização do texto em `.conductor/product.md`.
   - **Tech Consistency:** Se você precisar instalar uma nova biblioteca ou mudar uma versão (ex: override permitido), você DEVE atualizar o `.conductor/tech-stack.md` imediatamente.
   - **Regra de Ouro:** O código nunca pode estar "mais atualizado" que a documentação. Mantenha-os sincronizados.