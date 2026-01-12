# **Engenharia de Prompt e Arquitetura Cognitiva para Processamento Inteligente de Documentos Fiscais: Um Relatório Técnico Exaustivo**

## **1\. Introdução: A Mudança de Paradigma no Reconhecimento de Documentos**

A extração automatizada de dados de documentos físicos, historicamente dominada por sistemas de Reconhecimento Óptico de Caracteres (OCR) baseados em regras determinísticas e templates zonais, atravessa atualmente um momento de ruptura tecnológica fundamental. A emergência dos Grandes Modelos de Linguagem (LLMs) e, mais recentemente, dos Modelos de Linguagem Visual (VLMs), redefiniu o estado da arte para o processamento de documentos semi-estruturados, como notas de compra, recibos fiscais e faturas.1 Onde antes a engenharia de software tradicional exigia a criação de expressões regulares (Regex) complexas e frágeis para capturar padrões de texto, hoje a engenharia de prompt assume o papel central de orquestração cognitiva, instruindo redes neurais profundas a não apenas "ler" caracteres, mas a "compreender" a semântica, a estrutura espacial e o contexto de negócios inerente aos documentos fiscais.

Este relatório técnico analisa em profundidade os princípios de engenharia de prompt necessários para maximizar a precisão e mitigar alucinações em sistemas de Inteligência Artificial dedicados à leitura de notas de compra. A transição de sistemas de OCR legados para arquiteturas de Processamento Inteligente de Documentos (IDP) baseadas em IA generativa exige uma compreensão nuanceada de como esses modelos recebem inputs, como processam a geometria visual e como devem ser instruídos — desde os comandos basilares até as técnicas avançadas de raciocínio em cadeia (Chain-of-Thought) que constituem o diferencial de performance ("a cereja do bolo") em aplicações de missão crítica.3

A análise a seguir detalha não apenas os comandos textuais, mas a arquitetura lógica que deve sustentar o prompt, considerando as especificidades do cenário fiscal (com ênfase implícita em padrões brasileiros como Cupom Fiscal Eletrônico, SAT e NFC-e, dadas as referências contextuais de "nota de compra"), a variabilidade de layouts e a necessidade de validação matemática rigorosa para prevenir a geração de dados espúrios.6

## **2\. Arquitetura de Recepção de Inputs e Percepção Multimodal**

Para formular prompts eficazes, é imperativo compreender primeiramente a mecânica de entrada de dados da IA. A eficácia de um prompt é intrinsecamente dependente da modalidade de input que o modelo está arquitetado para processar. No ecossistema atual de IDP, distinguem-se duas abordagens arquiteturais predominantes, cada uma exigindo estratégias de prompt distintas para contornar suas limitações e alavancar suas capacidades.

### **2.1 Modalidade 1: Pipeline Híbrido (OCR Externo \+ LLM Textual)**

Nesta arquitetura, o processo de "visão" é desacoplado do processo de "compreensão". Uma engine de OCR dedicada (como Tesseract, Amazon Textract ou Google Document AI) processa a imagem bruta da nota de compra e extrai o texto, juntamente com coordenadas espaciais (bounding boxes). O prompt enviado ao LLM, portanto, não contém a imagem em si, mas uma representação textual serializada do documento.3

Neste cenário, a IA "recebe os inputs" como um fluxo de texto, frequentemente desprovido da riqueza visual original. O desafio crítico aqui é que a linearização do texto pelo OCR pode destruir a estrutura tabular ou colunar típica de uma nota fiscal. Se o OCR ler a nota linha por linha, da esquerda para a direita, colunas de "Descrição", "Quantidade" e "Preço" podem ser misturadas, criando um caos semântico que o prompt deve desemaranhar.

A engenharia de prompt para esta modalidade exige instruções que ajudem o modelo a reconstruir a estrutura original. Técnicas eficazes incluem a injeção de marcadores estruturais no texto extraído antes de enviá-lo ao LLM (por exemplo, convertendo a saída do OCR para Markdown ou XML) e instruir o modelo a considerar que erros de reconhecimento de caracteres (como confundir '5' com 'S' ou '0' com 'O') são prováveis e devem ser corrigidos pelo contexto semântico.8 O prompt atua aqui como um corretor e estruturador lógico, operando sobre um substrato textual ruidoso.

### **2.2 Modalidade 2: Modelos de Linguagem Visual (VLM \- Vision-Language Models)**

A abordagem mais moderna e recomendada para documentos complexos como notas de compra é o uso de VLMs (como GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro ou modelos especializados como Donut e Qwen-VL). Nestes sistemas, a IA recebe a imagem diretamente como input, sem a intermediação de um OCR tradicional de extração de texto.2

A recepção do input ocorre através da tokenização da imagem. O documento é dividido em "patches" visuais que são processados por um codificador de visão (Vision Encoder), permitindo que o modelo "veja" a nota fiscal holisticamente. Isso preserva informações cruciais que o OCR textual perde: a hierarquia visual (tamanho da fonte indicando cabeçalhos vs. rodapés), o alinhamento espacial (que define colunas de preços), logotipos de emissores e até mesmo a textura do papel (útil para detecção de fraude).

Para VLMs, a engenharia de prompt deve focar na *atenção visual*. Os comandos podem referenciar atributos visuais explicitamente, como "localize o valor total que está em negrito no canto inferior direito" ou "identifique o logotipo no topo para inferir o nome do estabelecimento se o texto estiver ilegível". A capacidade do modelo de ancorar suas respostas em características visuais torna o processo de extração significativamente mais robusto a variações de layout e ruído, como amassados ou manchas de impressão térmica comuns em cupons fiscais.13

### **Tabela 1: Comparativo de Estratégias de Prompt por Modalidade de Input**

| Característica | Pipeline Híbrido (OCR \+ LLM) | Modelo de Linguagem Visual (VLM) |
| :---- | :---- | :---- |
| **Input Recebido** | Texto bruto ou JSON com coordenadas. | Imagem (pixel patches) \+ Texto do Prompt. |
| **Foco do Prompt** | Reconstrução lógica, correção de erros de OCR ("typo correction"), inferência de estrutura perdida. | Ancoragem visual, navegação espacial, interpretação de layout e hierarquia gráfica. |
| **Tratamento de Tabelas** | Exige prompts complexos para separar colunas misturadas na leitura linear. | Naturalmente apto a "ver" colunas e linhas; prompts focam em extração direta. |
| **Resiliência a Ruído** | Baixa; se o OCR falha, o LLM alucina ou falha. | Alta; o modelo pode inferir texto parcialmente obstruído pelo contexto visual global. |
| **Comando Crítico** | "Corrija erros de leitura OCR baseados no contexto do item." | "Analise a imagem visualmente para distinguir cabeçalho, itens e rodapé." |

## **3\. Padrões do Documento: O Schema Mental para a IA**

A premissa de que a IA pode "adivinhar" a estrutura de qualquer documento sem orientação leva a resultados subótimos. Para maximizar a precisão, é fundamental informar à IA os padrões do documento que ela está prestes a processar. Isso estabelece um "Schema Mental" ou um prior de atenção que guia o modelo sobre onde buscar informações específicas e o que esperar em termos de formato de dados.15

No contexto específico de notas de compra (Cupom Fiscal, NFC-e, SAT), existem padrões rígidos que, quando explicitados no prompt, reduzem drasticamente o espaço de busca e a probabilidade de alucinação. A IA deve ser informada de que o documento segue uma anatomia funcional, tipicamente dividida em três macro-regiões: Cabeçalho, Corpo e Rodapé.

### **3.1 Cabeçalho: Identificação e Metadados**

O prompt deve instruir a IA a buscar no terço superior do documento as informações de identidade do emissor e da transação. Em notas brasileiras, isso inclui padrões específicos de formatação que servem como fortes âncoras de validação.6

* **Identificação do Emissor:** Razão Social e Nome Fantasia. O prompt deve alertar para a presença de logotipos que podem conter o nome fantasia, enquanto a razão social aparece em texto menor.  
* **CNPJ (Cadastro Nacional da Pessoa Jurídica):** Um padrão numérico de 14 dígitos, frequentemente formatado como XX.XXX.XXX/0001-XX. Informar este padrão (Regex) no prompt ajuda a IA a distinguir o CNPJ de outros números longos, como chaves de acesso ou telefones.  
* **Endereço:** Geralmente estruturado com Logradouro, Número, Bairro, Cidade e UF.  
* **Metadados Temporais:** Data e Hora de emissão. É crucial especificar o formato esperado no documento (geralmente DD/MM/AAAA no Brasil) para evitar confusão com o padrão americano (MM/DD/AAAA), o que geraria erros graves de interpretação contábil.17

### **3.2 Corpo: A Lista de Itens e a Complexidade Tabular**

A região central do documento contém a lista de itens adquiridos, que apresenta os maiores desafios de variabilidade. O prompt deve preparar a IA para lidar com:

* **Layouts Multilinha:** Em cupons estreitos (papel térmico de 50mm ou 80mm), é comum que a descrição do produto ocupe a primeira linha e os valores (Quantidade, Unitário, Total) ocupem a linha seguinte. Informar esse padrão ("Multi-line item pattern") impede que a IA trate a segunda linha como um produto separado ou perca a associação entre nome e preço.19  
* **Abreviações Crípticas:** Descrições de produtos em notas fiscais são frequentemente truncadas ou abreviadas agressivamente (ex: "BAT. FRITA", "REFRI", "MOLHO TOM."). O prompt deve instruir sobre como lidar com isso: deve-se expandir a abreviação (arriscar alucinação) ou extrair *verbatim* (literalmente)? Para fins de auditoria, a extração literal é preferível, delegando a expansão para um passo de pós-processamento ou inferência controlada.16  
* **Códigos e Classificações:** Códigos internos do produto ou códigos fiscais (NCM \- Nomenclatura Comum do Mercosul) podem aparecer adjacentes à descrição e não devem ser confundidos com quantidades ou preços.

### **3.3 Rodapé: Totais, Tributos e Pagamentos**

A região inferior é a mais crítica para a validação financeira. O prompt deve explicitar a distinção semântica entre diferentes tipos de valores monetários que coexistem nesta área.

* **Desambiguação de "Totais":** Uma nota fiscal contém múltiplos valores que parecem totais: "Subtotal", "Total de Itens", "Total de Descontos", "Valor Recebido", "Troco" e "Total a Pagar". O prompt deve conter instruções negativas claras (ex: "Não confunda o 'Total a Pagar' com o 'Valor Recebido' ou 'Troco'").22  
* **Tributação (Lei da Transparência):** No Brasil, é obrigatória a exibição da carga tributária aproximada (IBPT). A IA deve saber ignorar esses valores se o objetivo for extrair o valor da transação, ou capturá-los em campos específicos (tax\_amount), evitando somá-los inadvertidamente ao total da nota.  
* **Chave de Acesso:** Uma sequência numérica de 44 dígitos, fundamental para a validade fiscal eletrônica. O prompt deve tratar este campo como uma string de alta precisão, instruindo a IA a priorizar a leitura dos dígitos sobre qualquer outra interpretação textual.24

Ao informar esses padrões — a anatomia regional, os formatos de dados esperados (CNPJ, Datas, Moeda BRL) e as armadilhas comuns (multilinhas, abreviações) — transformamos o problema de extração de uma busca cega em uma tarefa de preenchimento estruturado, onde a IA sabe exatamente o que procurar e onde.15

## **4\. Engenharia de Prompt: Comandos Imprescindíveis (A Fundação)**

Os comandos classificados como imprescindíveis formam o alicerce operacional do sistema. Sem eles, a saída da IA tende a ser inconsistente, verbosa ou estruturalmente inutilizável para automação subsequente. Estes comandos garantem a interoperabilidade técnica entre o modelo probabilístico (LLM) e os sistemas determinísticos (banco de dados, ERP) que consumirão os dados extraídos.

### **4.1 Definição de Persona (Role Prompting)**

O primeiro comando essencial é a definição da persona. Isso ajusta os pesos latentes do modelo para o domínio específico de contabilidade e extração de dados, ativando o vocabulário e a lógica pertinentes.

* **Comando:** *"Atue como um especialista sênior em processamento de documentos fiscais (IDP) e auditoria contábil. Sua função é analisar imagens de notas fiscais e extrair dados estruturados com precisão absoluta, priorizando a fidelidade aos dados visuais sobre suposições."*  
* **Justificativa:** Estudos demonstram que o *Role Prompting* ancora o comportamento do modelo, reduzindo respostas genéricas e aumentando a atenção aos detalhes técnicos exigidos pela tarefa.25

### **4.2 Restrição de Formato de Saída (JSON Enforcing)**

LLMs são projetados para conversação, não para estruturação de dados. Sem restrições rígidas, eles tendem a adicionar preâmbulos ("Aqui está a análise da nota...") ou explicações finais. Para um sistema automatizado, qualquer texto fora do JSON é ruído que quebra o parser.

* **Comando:** *"A saída deve ser EXCLUSIVAMENTE um objeto JSON válido. Não inclua blocos de código markdown (\`\`\`json), frases introdutórias, explicações ou notas de rodapé. Comece a resposta com '{' e termine com '}'. Certifique-se de que o JSON esteja sintaticamente correto."*  
* **Justificativa:** A extração limpa é vital para integração direta via API. Modelos mais novos suportam "JSON Mode" nativo, mas o prompt deve reforçar essa restrição para garantir conformidade em casos de borda.26

### **4.3 Definição Estrita do Schema (Target Structure)**

A IA não deve adivinhar quais campos extrair. Um schema explícito define o contrato de dados.

* **Comando:** *"Extraia os dados preenchendo o seguinte schema JSON:*  
  * merchant\_name: String (Nome do estabelecimento).  
  * merchant\_cnpj: String (Apenas dígitos).  
  * date: String (Formato ISO 8601 YYYY-MM-DD).  
  * total\_amount: Number (Float com 2 casas decimais).  
  * items: Array de objetos contendo description, quantity, unit\_price, total\_price."  
* **Justificativa:** Fornecer as chaves e os tipos de dados esperados atua como um guia de atenção, forçando o modelo a buscar evidências visuais para cada campo solicitado.15

### **4.4 Instrução de Literalidade (Verbatim Extraction)**

Para evitar que a IA "corrija" nomes de produtos ou empresas baseada em seu conhecimento de treinamento (o que seria uma alucinação em um contexto de auditoria), a literalidade é mandatória.

* **Comando:** *"Para campos de texto como 'merchant\_name' e 'items.description', extraia o texto exatamente como aparece na imagem (verbatim), incluindo abreviações e grafias incomuns. Não expanda abreviações e não corrija erros ortográficos do documento original."*  
* **Justificativa:** Em auditoria, um erro no documento deve ser preservado nos dados extraídos. A correção silenciosa pela IA é indesejável e pode mascarar fraudes ou erros de emissão.31

## **5\. Estratégias de Refinamento e Robustez: Comandos "Muito Bons"**

Uma vez garantida a estrutura básica, os comandos "Muito Bons" elevam a qualidade dos dados, tratando nuances de normalização e ambiguidades que, de outra forma, exigiriam extenso código de pós-processamento.

### **5.1 Normalização de Dados na Fonte**

Delegar a normalização básica para a IA simplifica a lógica de ingestão de dados. O modelo é capaz de compreender formatos locais e convertê-los para padrões internacionais.

* **Comando:** *"Normalize todos os valores numéricos para o formato de ponto flutuante padrão (ponto como separador decimal). Converta o formato brasileiro 'R$ 1.250,00' para '1250.00'. Normalize todas as datas para o formato ISO 8601 (YYYY-MM-DD). Se o ano estiver abreviado ('23'), assuma o século atual ('2023')."*  
* **Justificativa:** Scripts de Regex para limpar moedas falham frequentemente com variações de espaçamento ("R$10" vs "R$ 10") ou erros de OCR ("l0,00"). LLMs resolvem essas variações semanticamente com maior robustez.17

### **5.2 Tratamento de Campos Nulos e Incerteza**

Instruir a IA sobre como lidar com a ausência de informação é tão importante quanto instruí-la sobre a presença.

* **Comando:** *"Se um campo solicitado não estiver visível, legível ou presente no documento, preencha com null. NÃO invente valores, não alucine dados baseados em probabilidade e não use valores padrão (como 0 ou 'N/A') a menos que especificado."*  
* **Justificativa:** Isso previne a "imputação de dados" onde o modelo tenta ser prestativo preenchendo lacunas com palpites, o que corrompe a integridade da base de dados.33

### **5.3 Categorização Contextual (Enrichment)**

Utilizar a capacidade de compreensão semântica do LLM para enriquecer os dados no momento da extração agrega valor imediato ao negócio.

* **Comando:** *"Para cada item extraído, infira uma categoria baseada na descrição e adicione ao campo category. Use a seguinte taxonomia simplificada:. Exemplo: 'Gasolina Aditivada' \-\> 'Transporte'."*  
* **Justificativa:** Isso transforma a extração de dados brutos em informação acionável para análise de despesas, poupando uma etapa subsequente de classificação.34

### **5.4 Gestão de Ruído e Artefatos Visuais**

Notas de compra são frequentemente digitalizadas em condições precárias. O prompt deve antecipar isso.

* **Comando:** *"Ignore anotações manuscritas (como assinaturas ou vistos) que estejam sobrepostas ao texto impresso, a menos que explicitamente solicitado. Se houver dobras ou sombras ocultando parte de um valor, marque o campo readability\_warning como true e extraia apenas o que for inequivocamente legível."*  
* **Justificativa:** Focar na camada de dados impressos ("machine-printed text") ajuda a filtrar ruídos irrelevantes introduzidos pelo manuseio humano do documento.36

## **6\. Técnicas Avançadas para Precisão Máxima: "A Cereja do Bolo"**

Para atingir níveis de precisão superiores a 99% e minimizar alucinações críticas (como inventar um valor total), aplicam-se técnicas avançadas de *Prompt Engineering* cognitivo. Estas estratégias forçam o modelo a engajar em processos de raciocínio mais profundos antes de gerar a resposta final.

### **6.1 Chain of Thought (CoT) para Validação Matemática**

LLMs são modelos probabilísticos de previsão de tokens e, nativamente, são propensos a erros aritméticos simples. A técnica "Chain of Thought" instrui o modelo a "pensar passo a passo", explicitando o cálculo intermediário. Isso ancora a resposta final em uma lógica dedutiva verificável.4

* **Comando (A Cereja do Bolo):** *"Antes de gerar o JSON final, execute um passo de validação interna (Raciocínio): 1\. Identifique e liste todos os valores individuais dos itens. 2\. Realize a soma matemática desses valores. 3\. Compare sua soma calculada com o valor impresso no campo 'Total' da nota. 4\. Se houver discrepância, verifique se existem descontos, taxas de serviço ou itens cancelados que justifiquem a diferença. 5\. Se a discrepância persistir, priorize o valor total impresso explicitamente no documento, mas adicione um alerta no campo validation\_warnings descrevendo o erro matemático encontrado."*  
* **Mecanismo:** Ao forçar o modelo a gerar os tokens do cálculo, o mecanismo de atenção é redirecionado para os dígitos específicos, aumentando a precisão da leitura ("Grounding") e reduzindo a alucinação de valores que não fecham a conta.39

### **6.2 Ancoragem Visual e Navegação Espacial**

Em VLMs, instruir o modelo a usar pontos de referência visuais ajuda na desambiguação de campos complexos em layouts densos.

* **Comando:** *"Utilize âncoras visuais para localizar dados. Para encontrar a Data, procure próximo ao cabeçalho ou rodapé por termos como 'Emissão'. Para o Total, busque o maior valor monetário localizado no quadrante inferior direito ou após a lista de itens, geralmente destacado em negrito. Para o CNPJ, procure próximo ao topo ou rodapé, associado a termos como 'CNPJ' ou 'Inscrição'."*  
* **Justificativa:** Isso mimetiza o comportamento de leitura humano, onde a visão periférica e a estrutura global guiam a foveação para os dados de interesse, aumentando a resiliência contra layouts não padronizados.2

### **6.3 Pontuação de Confiança (Confidence Scoring)**

Permitir que a IA expresse incerteza é fundamental para sistemas "Human-in-the-Loop".

* **Comando:** *"Para cada campo crítico (Total, Data, CNPJ), adicione um atributo confidence (0.0 a 1.0). Atribua uma pontuação baixa se o texto estiver borrado, cortado, ambíguo ou se houver conflito visual (ex: rasura). Se a confiança for inferior a 0.8, preencha o campo review\_needed como true."*  
* **Justificativa:** Permite rotear documentos problemáticos para revisão humana manual, garantindo que o sistema automatizado processe apenas o que tem certeza, mantendo a integridade dos dados downstream.23

### **6.4 Detecção de Fraude e Anomalias (Forensic Check)**

Com a ascensão de geradores de recibos falsos baseados em IA, a própria IA de extração deve atuar como auditora de integridade.41

* **Comando:** *"Analise a consistência visual do documento em busca de sinais de manipulação digital ou geração sintética. Verifique se: 1\. As fontes utilizadas são consistentes em todo o documento. 2\. O alinhamento das colunas é natural ou artificialmente perfeito. 3\. Existem anomalias de iluminação ou sombras que contradizem a geometria do papel (ex: papel amassado com texto reto). Se detectar indícios de falsificação, marque fraud\_risk como high e explique o motivo."*  
* **Justificativa:** Transforma o OCR de uma ferramenta passiva de entrada de dados em uma primeira linha de defesa ativa contra fraudes de despesas corporativas.43

### **Tabela 2: Resumo da Hierarquia de Comandos de Prompt**

| Categoria | Objetivo | Exemplos de Comandos | Impacto no Sistema |
| :---- | :---- | :---- | :---- |
| **Imprescindíveis** | Funcionalidade Básica | Role Definition, JSON Schema, Verbatim Extraction. | Garante que o sistema entregue dados estruturados legíveis por máquina. |
| **Muito Bons** | Qualidade de Dados | Normalização (BRL/ISO Dates), Null Handling, Categorização. | Reduz a necessidade de scripts de limpeza e enriquece o dado. |
| **Cereja do Bolo** | Alta Precisão e Segurança | Chain of Thought (Math Validation), Visual Anchoring, Fraud Detection, Confidence Scoring. | Mitiga alucinações críticas, detecta fraudes e habilita automação confiável. |

## **7\. Implementação Técnica e Fluxos de Agentes**

A engenharia de prompt não existe no vácuo; ela é o componente central de um pipeline técnico. Para maximizar a eficácia dos princípios descritos, recomenda-se uma arquitetura de "Agentes" ou fluxos iterativos, em vez de uma chamada única (one-shot).44

### **7.1 Loop de Auto-Correção (Reflexion Pattern)**

Uma implementação avançada envolve um fluxo onde o modelo avalia sua própria saída.

1. **Passo 1 (Extração):** O modelo extrai os dados usando o prompt padrão.  
2. **Passo 2 (Crítica):** Um segundo prompt recebe a imagem e o JSON extraído e pergunta: *"Verifique se todos os itens da imagem foram listados no JSON. Verifique se o CNPJ está correto. Há algum erro óbvio?"*  
3. Passo 3 (Correção): Se erros forem encontrados, o modelo gera um JSON corrigido.  
   Esse padrão, conhecido como Reflexion, demonstrou reduzir taxas de erro significativamente em tarefas complexas de extração, atuando como um "segundo par de olhos" virtual.47

### **7.2 Integração com Bases de Conhecimento (RAG \- Retrieval Augmented Generation)**

Para notas de compra corporativas, pode-se usar RAG para validar fornecedores. O prompt receberia, além da imagem, uma lista de CNPJs de fornecedores aprovados.

* Comando: "Compare o CNPJ extraído com a lista de fornecedores homologados fornecida no contexto. Se houver um match aproximado (erro de 1 ou 2 dígitos), corrija o CNPJ extraído para o valor da lista, assumindo erro de OCR, mas sinalize a correção."  
  Essa técnica ancora a extração em dados mestre confiáveis, reduzindo alucinações em identificadores críticos.36

## **8\. Considerações Finais**

A engenharia de prompt para OCR de notas de compra evoluiu de uma tarefa de reconhecimento de padrões para um desafio de orquestração cognitiva. Ao adotar uma abordagem holística que considera a modalidade de input (VLM vs. Pipeline Híbrido), explicita os padrões documentais (Schema Mental) e implementa uma hierarquia de comandos que vai da estruturação básica (JSON) até a validação lógica avançada (Chain of Thought), é possível construir sistemas de IDP com precisão comparável ou superior à humana.

A "cereja do bolo" reside não apenas em pedir para a IA ler, mas em capacitá-la para duvidar, verificar e raciocinar sobre o que vê. Em um cenário onde a automação fiscal exige rigor absoluto, transformar o LLM de um leitor passivo em um auditor ativo é o diferencial que separa uma prova de conceito de uma solução de nível corporativo pronta para produção. A aplicação rigorosa desses princípios resulta em um sistema resiliente, capaz de navegar a complexidade e a variabilidade do mundo real com robustez e confiabilidade.15

#### **Referências citadas**

1. IDP Explained: AI/ML for Smarter Enterprise Document Workflows \- Nanonets, acessado em janeiro 9, 2026, [https://nanonets.com/blog/intelligent-document-processing/](https://nanonets.com/blog/intelligent-document-processing/)  
2. Turn Complex Documents into Usable Data with VLM, NVIDIA Nemotron Parse 1.1, acessado em janeiro 9, 2026, [https://developer.nvidia.com/blog/turn-complex-documents-into-usable-data-with-vlm-nvidia-nemotron-parse-1-1/](https://developer.nvidia.com/blog/turn-complex-documents-into-usable-data-with-vlm-nvidia-nemotron-parse-1-1/)  
3. Evaluation of Prompt Engineering on the Performance of a Large Language Model in Document Information Extraction \- MDPI, acessado em janeiro 9, 2026, [https://www.mdpi.com/2079-9292/14/11/2145](https://www.mdpi.com/2079-9292/14/11/2145)  
4. Chain-of-Thought Prompting | Prompt Engineering Guide, acessado em janeiro 9, 2026, [https://www.promptingguide.ai/techniques/cot](https://www.promptingguide.ai/techniques/cot)  
5. What is chain of thought (CoT) prompting? \- IBM, acessado em janeiro 9, 2026, [https://www.ibm.com/think/topics/chain-of-thoughts](https://www.ibm.com/think/topics/chain-of-thoughts)  
6. Understanding Receipts for Brazilian Procurement \- Oracle Help Center, acessado em janeiro 9, 2026, [https://docs.oracle.com/en/applications/jd-edwards/localizations/9.2/eoabz/understanding-receipts-for-brazilian-procurement.html](https://docs.oracle.com/en/applications/jd-edwards/localizations/9.2/eoabz/understanding-receipts-for-brazilian-procurement.html)  
7. Entering and Reviewing Receipts for Procurement for Brazil \- Oracle Help Center, acessado em janeiro 9, 2026, [https://docs.oracle.com/en/applications/jd-edwards/localizations/9.2/eoabz/entering-and-reviewing-receipts-for-procurement-for-brazil.html](https://docs.oracle.com/en/applications/jd-edwards/localizations/9.2/eoabz/entering-and-reviewing-receipts-for-procurement-for-brazil.html)  
8. Enhancing Image Text Extraction with LLM and OCR | by James Chen | Medium, acessado em janeiro 9, 2026, [https://medium.com/@jameschen\_78678/enhancing-image-text-extraction-with-llm-and-ocr-8221cb555cc5](https://medium.com/@jameschen_78678/enhancing-image-text-extraction-with-llm-and-ocr-8221cb555cc5)  
9. LLMs for Structured Data Extraction from PDFs in 2026 \- Unstract, acessado em janeiro 9, 2026, [https://unstract.com/blog/comparing-approaches-for-using-llms-for-structured-data-extraction-from-pdfs/](https://unstract.com/blog/comparing-approaches-for-using-llms-for-structured-data-extraction-from-pdfs/)  
10. Hybrid OCR-LLM Framework for Enterprise-Scale Document Information Extraction Under Copy-heavy Task \- arXiv, acessado em janeiro 9, 2026, [https://arxiv.org/html/2510.10138v1](https://arxiv.org/html/2510.10138v1)  
11. dots.ocr SOTA Document Parsing in a Compact VLM, acessado em janeiro 9, 2026, [https://www.youtube.com/watch?v=uw8Rrypg\_xI](https://www.youtube.com/watch?v=uw8Rrypg_xI)  
12. PaddleOCR-VL : Best OCR AI model, acessado em janeiro 9, 2026, [https://medium.com/data-science-in-your-pocket/paddleocr-vl-best-ocr-ai-model-e15d9e37a833](https://medium.com/data-science-in-your-pocket/paddleocr-vl-best-ocr-ai-model-e15d9e37a833)  
13. Do we really need traditional OCR and layout models at this point, since VLMs have improved so much. \- Reddit, acessado em janeiro 9, 2026, [https://www.reddit.com/r/LocalLLaMA/comments/1jmcbsk/do\_we\_really\_need\_traditional\_ocr\_and\_layout/](https://www.reddit.com/r/LocalLLaMA/comments/1jmcbsk/do_we_really_need_traditional_ocr_and_layout/)  
14. Fine-tune VLMs for multipage document-to-JSON with SageMaker AI and SWIFT \- AWS, acessado em janeiro 9, 2026, [https://aws.amazon.com/blogs/machine-learning/fine-tune-vlms-for-multipage-document-to-json-with-sagemaker-ai-and-swift/](https://aws.amazon.com/blogs/machine-learning/fine-tune-vlms-for-multipage-document-to-json-with-sagemaker-ai-and-swift/)  
15. Effective Prompt Engineering for Data Extraction with Large Language Models | by DanShw, acessado em janeiro 9, 2026, [https://medium.com/@kofsitho/effective-prompt-engineering-for-data-extraction-with-large-language-models-331ee454cbae](https://medium.com/@kofsitho/effective-prompt-engineering-for-data-extraction-with-large-language-models-331ee454cbae)  
16. How do I learn about prompt engineering for OCR platforms? : r/PromptEngineering \- Reddit, acessado em janeiro 9, 2026, [https://www.reddit.com/r/PromptEngineering/comments/1pyzdnq/how\_do\_i\_learn\_about\_prompt\_engineering\_for\_ocr/](https://www.reddit.com/r/PromptEngineering/comments/1pyzdnq/how_do_i_learn_about_prompt_engineering_for_ocr/)  
17. Regex for Date, Time and Currency, with Code Examples \- DEV Community, acessado em janeiro 9, 2026, [https://dev.to/oursky/regex-for-date-time-and-currency-2apm](https://dev.to/oursky/regex-for-date-time-and-currency-2apm)  
18. LLM Models and Date Parsing : r/PromptEngineering \- Reddit, acessado em janeiro 9, 2026, [https://www.reddit.com/r/PromptEngineering/comments/1pp30hf/llm\_models\_and\_date\_parsing/](https://www.reddit.com/r/PromptEngineering/comments/1pp30hf/llm_models_and_date_parsing/)  
19. Best Receipt OCR 2026: Guide to Extracting Receipt Data \- Unstract, acessado em janeiro 9, 2026, [https://unstract.com/blog/unstract-receipt-ocr-scanner-api/](https://unstract.com/blog/unstract-receipt-ocr-scanner-api/)  
20. Best OCR \+ automation setup for extracting invoice line items (PDF → Airtable)? \- Reddit, acessado em janeiro 9, 2026, [https://www.reddit.com/r/automation/comments/1opif94/best\_ocr\_automation\_setup\_for\_extracting\_invoice/](https://www.reddit.com/r/automation/comments/1opif94/best_ocr_automation_setup_for_extracting_invoice/)  
21. Automated Invoice Data Extraction: Using LLM and OCR \- arXiv, acessado em janeiro 9, 2026, [https://arxiv.org/pdf/2511.05547](https://arxiv.org/pdf/2511.05547)  
22. Receipt-OCR Mastery: Turning Paper Slips into Real-Time Retail Data \- Medium, acessado em janeiro 9, 2026, [https://medium.com/@API4AI/receipt-ocr-mastery-turning-paper-slips-into-real-time-retail-data-8e0c0878e6d0](https://medium.com/@API4AI/receipt-ocr-mastery-turning-paper-slips-into-real-time-retail-data-8e0c0878e6d0)  
23. Invoice processing prebuilt AI model \- Microsoft Learn, acessado em janeiro 9, 2026, [https://learn.microsoft.com/en-us/ai-builder/prebuilt-invoice-processing](https://learn.microsoft.com/en-us/ai-builder/prebuilt-invoice-processing)  
24. Brazil E-invoice Requirements: NF-e & NFS-e Guide \- Storecove, acessado em janeiro 9, 2026, [https://www.storecove.com/blog/en/what-are-the-e-invoice-requirements-in-brazil/](https://www.storecove.com/blog/en/what-are-the-e-invoice-requirements-in-brazil/)  
25. Why Your ChatGPT Prompts Suck (And How To Stop Getting Generic AI Responses), acessado em janeiro 9, 2026, [https://medium.com/@0xmega/why-your-chatgpt-prompts-suck-and-how-to-stop-getting-generic-ai-responses-04ffcbbcce2b](https://medium.com/@0xmega/why-your-chatgpt-prompts-suck-and-how-to-stop-getting-generic-ai-responses-04ffcbbcce2b)  
26. OCR vs LLMs: What's the Best Tool for Document Processing in 2025? | TableFlow, acessado em janeiro 9, 2026, [https://tableflow.com/blog/ocr-vs-llms](https://tableflow.com/blog/ocr-vs-llms)  
27. I Built an Open Source LLM-Based Receipt Generator — Here's Why \- Maxime Champoux, acessado em janeiro 9, 2026, [https://maximechampoux.medium.com/i-built-an-open-source-llm-based-receipt-generator-heres-why-e79c58b30903](https://maximechampoux.medium.com/i-built-an-open-source-llm-based-receipt-generator-heres-why-e79c58b30903)  
28. bhimrazy/receipt-ocr: An efficient OCR engine for receipt image processing. \- GitHub, acessado em janeiro 9, 2026, [https://github.com/bhimrazy/receipt-ocr](https://github.com/bhimrazy/receipt-ocr)  
29. Extract data from text and parse it as a JSON \- Beginners \- Hugging Face Forums, acessado em janeiro 9, 2026, [https://discuss.huggingface.co/t/extract-data-from-text-and-parse-it-as-a-json/64971](https://discuss.huggingface.co/t/extract-data-from-text-and-parse-it-as-a-json/64971)  
30. klippa-app/receipt-ocr: Receipt OCR engine to extract receipt information. \- GitHub, acessado em janeiro 9, 2026, [https://github.com/klippa-app/receipt-ocr](https://github.com/klippa-app/receipt-ocr)  
31. Reducing hallucinations when extracting data from PDF using LLMs \- DEV Community, acessado em janeiro 9, 2026, [https://dev.to/parthex/reducing-hallucinations-when-extracting-data-from-pdf-using-llms-4nl5](https://dev.to/parthex/reducing-hallucinations-when-extracting-data-from-pdf-using-llms-4nl5)  
32. Regex to validate brazilian money using Javascript \- Stack Overflow, acessado em janeiro 9, 2026, [https://stackoverflow.com/questions/10300930/regex-to-validate-brazilian-money-using-javascript](https://stackoverflow.com/questions/10300930/regex-to-validate-brazilian-money-using-javascript)  
33. Automate document processing with Amazon Bedrock Prompt Flows (preview) \- AWS, acessado em janeiro 9, 2026, [https://aws.amazon.com/blogs/machine-learning/automate-document-processing-with-amazon-bedrock-prompt-flows-preview/](https://aws.amazon.com/blogs/machine-learning/automate-document-processing-with-amazon-bedrock-prompt-flows-preview/)  
34. A comprehensive taxonomy of prompt engineering techniques for large language models \- Zhen Zheng, acessado em janeiro 9, 2026, [https://jamesthez.github.io/files/liu-fcs26.pdf](https://jamesthez.github.io/files/liu-fcs26.pdf)  
35. LLM-Based Product Classifier for Google Taxonomy | by TurgutGuvercin \- Medium, acessado em janeiro 9, 2026, [https://medium.com/@turgutgvcn/llm-based-product-classifier-for-google-taxonomy-f6bfb5a1659b](https://medium.com/@turgutgvcn/llm-based-product-classifier-for-google-taxonomy-f6bfb5a1659b)  
36. How to Prevent LLM Hallucinations \- Grooper, acessado em janeiro 9, 2026, [https://grooper.com/blog\_posts/llm-hallucinations/](https://grooper.com/blog_posts/llm-hallucinations/)  
37. \[2405.00204\] General Purpose Verification for Chain of Thought Prompting \- arXiv, acessado em janeiro 9, 2026, [https://arxiv.org/abs/2405.00204](https://arxiv.org/abs/2405.00204)  
38. How to Implement Chain-of-Thought Prompting for Better AI Reasoning \- NJII, acessado em janeiro 9, 2026, [https://www.njii.com/2024/11/how-to-implement-chain-of-thought-prompting-for-better-ai-reasoning/](https://www.njii.com/2024/11/how-to-implement-chain-of-thought-prompting-for-better-ai-reasoning/)  
39. Invoice Information Extraction: Methods and Performance Evaluation \- arXiv, acessado em janeiro 9, 2026, [https://arxiv.org/html/2510.15727v1](https://arxiv.org/html/2510.15727v1)  
40. GPT-4 kept failing at math on my invoices, so I built a "Math-Verified" wrapper API. \- Reddit, acessado em janeiro 9, 2026, [https://www.reddit.com/r/indiehackers/comments/1p9jr0i/gpt4\_kept\_failing\_at\_math\_on\_my\_invoices\_so\_i/](https://www.reddit.com/r/indiehackers/comments/1p9jr0i/gpt4_kept_failing_at_math_on_my_invoices_so_i/)  
41. AI-Generated Document Fraud: Fake Invoices and Receipts Made Easy with ChatGPT‑4, acessado em janeiro 9, 2026, [https://www.vaarhaft.com/post/ai-generated-document-fraud-fake-invoices-and-receipts-made-easy-with-chatgpt-4](https://www.vaarhaft.com/post/ai-generated-document-fraud-fake-invoices-and-receipts-made-easy-with-chatgpt-4)  
42. Detecting the Fakes: How Veryfi Is Combating AI-Generated Receipts, acessado em janeiro 9, 2026, [https://www.veryfi.com/technology/ai-generated-receipts-detection/](https://www.veryfi.com/technology/ai-generated-receipts-detection/)  
43. Can Multi-modal (reasoning) LLMs detect document manipulation? \- arXiv, acessado em janeiro 9, 2026, [https://arxiv.org/html/2508.11021v1](https://arxiv.org/html/2508.11021v1)  
44. How LLMs are becoming investigative partners in fintech fraud detection \- Taktile, acessado em janeiro 9, 2026, [https://taktile.com/articles/llms-investigative-partners-fraud-detection](https://taktile.com/articles/llms-investigative-partners-fraud-detection)  
45. Your AI-fake receipts defensive playbook \- AppZen, acessado em janeiro 9, 2026, [https://www.appzen.com/blog/your-ai-fake-receipts-defensive-playbook-for-expense-audit](https://www.appzen.com/blog/your-ai-fake-receipts-defensive-playbook-for-expense-audit)  
46. Automating Invoice Data Extraction: An End-to-End Workflow Guide \- Nanonets, acessado em janeiro 9, 2026, [https://nanonets.com/blog/invoice-data-extraction-a-complete-guide/](https://nanonets.com/blog/invoice-data-extraction-a-complete-guide/)  
47. Hallucination-Free LLMs: The future of OCR and data extraction | Mar 19, 2025 \- Cradl AI, acessado em janeiro 9, 2026, [https://www.cradl.ai/post/hallucination-free-llm-data-extraction](https://www.cradl.ai/post/hallucination-free-llm-data-extraction)  
48. Reducing hallucinations in large language models with custom intervention using Amazon Bedrock Agents | Artificial Intelligence, acessado em janeiro 9, 2026, [https://aws.amazon.com/blogs/machine-learning/reducing-hallucinations-in-large-language-models-with-custom-intervention-using-amazon-bedrock-agents/](https://aws.amazon.com/blogs/machine-learning/reducing-hallucinations-in-large-language-models-with-custom-intervention-using-amazon-bedrock-agents/)  
49. Extracting Invoice and Receipt Data as JSON Using Fine-Tuned VLMs, acessado em janeiro 9, 2026, [https://www.cloudthat.com/resources/blog/extracting-invoice-and-receipt-data-as-json-using-fine-tuned-vlms](https://www.cloudthat.com/resources/blog/extracting-invoice-and-receipt-data-as-json-using-fine-tuned-vlms)