# Tasks: Integração Pollinations

## Serviços [x]
- [x] Criar `pollinations_service.py` (`extract_text_from_image`, `get_image_url`) <!-- id: 1 -->
- [x] Criar `ai_orchestrator.py` (`process_receipt_image`, `generate_recipes_with_images`) <!-- id: 2 -->

## Routers [x]
- [x] Modificar `/analisar-nota` para usar orchestrator (Vision) <!-- id: 3 -->
- [x] Modificar `/sugerir-receitas` para injetar `image_url` <!-- id: 4 -->

## Configuração [x]
- [x] (Opcional) Adicionar `POLLINATIONS_API_KEY` ao `.env` e `config.py` <!-- id: 5 -->
- [x] Atualizar `tech-stack.md` com Pollinations <!-- id: 6 -->

## Verificação [ ]
- [ ] Testar `/analisar-nota` com imagem real <!-- id: 7 -->
- [ ] Testar `/sugerir-receitas` e abrir `image_url` no navegador <!-- id: 8 -->
