# Plano de Implementação: Refatoração do Sistema de Temas (v2) [Concluído]

**Objetivo:** Garantir que a alternância de tema no `LandingPage.jsx` funcione de forma robusta e visualmente completa, afetando todos os componentes (Header, Hero, Features, CTA, Footer).

## Diagnóstico
A tentativa anterior falhou em aplicar as classes `dark:` de forma consistente ou a configuração do Tailwind v4 não está propagando a classe `.dark` corretamente para os componentes filhos.

## User Review Required
> [!IMPORTANT]
> Esta refatoração focará exclusivamente em fazer o **Toggle visual** funcionar.
> Assumiremos que a lógica `setTheme` e `useEffect` (adicionar classe ao `html`) está correta (verificada por logs). O foco será nas **classes utilitárias do Tailwind**.

## Proposed Changes

### 1. Refatoração Visual (Dark Variants)
#### [MODIFY] [LandingPage.jsx](file:///c:/Users/emanu/Documents/Projetos/Já%20comprei/frontend-ja-comprei/src/LandingPage.jsx)
- **Estratégia:** Varrer o arquivo e explicitar as cores para Light e Dark em *cada* elemento de texto e background.
- **Padrão de Cores:**
    - Background Escuro: `dark:bg-[#171b19]` (Principal), `dark:bg-[#1c221f]` (Cards/Drawer).
    - Texto Claro: `dark:text-[#FDFBF7]` (Títulos), `dark:text-gray-300` (Corpo).
    - Bordas: `dark:border-white/10`.
    - Ícones: Forçar `currentColor` ou classes específicas para contraste.

### 2. Isolar Lógica de Tema
#### [NEW] [ThemeContext.jsx](file:///c:/Users/emanu/Documents/Projetos/Já%20comprei/frontend-ja-comprei/src/context/ThemeContext.jsx)
- (Opcional, mas recomendado) Mover a lógica de toggle para um Contexto se o user aprovar, mas por enquanto vamos manter no `LandingPage` para agilidade, focando no visual. **Decisão:** Manter local por enquanto para "Ajuste Rápido".

## Verification Plan

### Teste Visual Completo
1.  **Header:** Fundo fica escuro? Texto "Já Comprei" fica branco?
2.  **Hero:** Título principal fica branco? Subtítulos legíveis?
3.  **Features (Cards):** Cards brancos viram cinza escuro (`#1c221f`)? Ícones mudam de cor se necessário?
4.  **CTA Section:** Fundo do container muda? Texto do título muda?
5.  **Footer:** Fundo escuro? Links de redes sociais visíveis (fundo semi-transparente)?
