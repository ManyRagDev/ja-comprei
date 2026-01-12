# Plano de Implementação: Controle Automático de Câmera

**Objetivo:** Garantir que a câmera do dispositivo seja utilizada **exclusivamente** quando o usuário estiver na tela do Scanner. Ao navegar para qualquer outra tela, o stream de vídeo deve ser imediatamente liberado, respeitando a privacidade do usuário.

> [!IMPORTANT]
> Este controle é **fundamentalmente importante para transparência** com o usuário. A câmera não deve permanecer ativa "em background" sob nenhuma circunstância.

---

## Escopo

### O que está incluso:
- Garantir que o `useEffect` de `Scanner.jsx` libere corretamente todos os `MediaStreamTracks` ao desmontar.
- Verificar e tratar edge cases (ex: componente desmontado antes do stream ser obtido).
- Adicionar indicador visual (opcional) de que a câmera está ativa.
- Testar em múltiplos dispositivos (Desktop, Mobile Android, Mobile iOS).

### O que NÃO está incluso:
- Funcionalidades de gravação de vídeo (não aplicável).
- Acesso a câmera em outras telas (apenas Scanner).

---

## Análise do Estado Atual

O `Scanner.jsx` já possui lógica de cleanup:

```javascript
useEffect(() => {
    const getCamera = async () => { /* ... */ };
    getCamera();

    return () => {
        // Cleanup stream
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };
}, []);
```

**Potenciais problemas:**
1. Se o componente desmontar **antes** do `getUserMedia` resolver, o stream obtido não será parado (race condition).
2. Não há tratamento explícito para garantir que `stream` seja salvo em uma ref para cleanup seguro.

---

## Passos de Implementação

- [ ] **1. Refatorar `useEffect` para cleanup robusto**
    - Salvar a `stream` retornada pelo `getUserMedia` em uma `useRef` (`streamRef`).
    - Na função de cleanup, parar tracks de `streamRef.current` em vez de depender de `videoRef.current.srcObject`.
    - Usar uma flag `isMounted` para evitar atribuir stream a um componente já desmontado.

- [ ] **2. Adicionar indicador visual de câmera ativa (Opcional)**
    - Exibir um pequeno ícone/selo no Header enquanto a câmera estiver ativa (ex: "🔴 Câmera Ativa").
    - Isso aumenta a transparência com o usuário.

- [ ] **3. Testar em múltiplos cenários**
    - Navegar rapidamente para fora do Scanner antes da câmera inicializar.
    - Navegar para o Scanner e voltar imediatamente (stress test).
    - Verificar em Android (Chrome), iOS (Safari), Desktop (Chrome/Edge/Firefox).

---

## Verificação

### Automática (Console)
- Nenhum warning de "stream não liberado" ou leaks no DevTools.

### Manual
1. Abrir o app e ir para o Scanner.
2. Verificar se a câmera está ativa (LED/indicador do dispositivo).
3. Voltar para o Dashboard.
4. **Esperado:** O indicador de câmera do dispositivo deve **apagar imediatamente**.
5. Repetir rapidamente várias vezes (stress test).

### Mobile
1. Testar em dispositivo Android real (Chrome).
2. Testar em dispositivo iOS real (Safari).
3. Verificar se não há prompt de permissão repetido em navegações subsequentes.

