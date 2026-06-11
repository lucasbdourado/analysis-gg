# PRD-3330 - Tasks resumidas

## PRD3330-T01 - Fechar regras pendentes com Produto/Tech Lead

**Objetivo:** fechar as decisoes que bloqueiam a implementacao.

**Contexto:** a PRD deixa duvidas sobre criptografia, APIs e reset de propriedades.

**Arquivos/areas provaveis:**

- Documento da PRD/Jira
- Comentarios do Jira
- Prototipos
- Validacao com Produto, Tech Lead e QA

## PRD3330-T02 - Mapear contrato tecnico da conversao

**Objetivo:** definir como o Fusion vai representar uma conversao pendente e uma conversao executada.

**Contexto:** a troca Integer -> Text nao deve depender apenas de trocar `@type` no JSON.

**Arquivos/areas provaveis:**

- `src/main/java/com/neomind/framework/fusion/modules/ged/rest/FieldInfoRest.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/FieldInfoService.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/impl/FieldInfoServiceImpl.java`
- `src/main/java/com/neomind/fusion/entity/FieldInfo.java`
- `src/main/java/com/neomind/fusion/entity/FieldInfoInteger.java`
- `src/main/java/com/neomind/fusion/entity/FieldInfoText.java`
- `src/main/frontend/src/webpack/components/field-editor/field-editor.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/fields/fields-service.js`

## PRD3330-T03 - Criar DTOs/VOs para validacao e execucao da conversao

**Objetivo:** preparar objetos de entrada/saida do REST e do servico de conversao.

**Contexto:** o frontend precisara consultar se o campo pode ser convertido e enviar a conversao pendente no save.

**Arquivos/areas provaveis:**

- Novo pacote provavel em `src/main/java/com/neomind/framework/fusion/modules/ged/dto/`
- `FieldInfoConversionEligibilityRequestDTO`
- `FieldInfoConversionEligibilityResponseDTO`
- `FieldInfoConversionRequestDTO`
- `FieldInfoConversionResponseDTO`
- `src/main/java/com/neomind/framework/fusion/modules/ged/rest/FieldInfoRest.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/FieldInfoService.java`

## PRD3330-T04 - Criar REST de elegibilidade/preview da conversao

**Objetivo:** permitir que o frontend consulte se um campo Inteiro pode virar Texto antes de mostrar ou confirmar a acao.

**Contexto:** a UI precisa saber se o campo e criptografado, se e persistido e se o tipo original permite conversao.

**Arquivos/areas provaveis:**

- `src/main/java/com/neomind/framework/fusion/modules/ged/rest/FieldInfoRest.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/FieldInfoService.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/impl/FieldInfoServiceImpl.java`
- DTOs criados na T03
- `src/test/java/com/neomind/framework/fusion/test/modules/ged/service/impl/FieldInfoServiceImplTests.java`

## PRD3330-T05 - Criar servico backend de conversao de FieldInfo

**Objetivo:** concentrar a regra de conversao Integer -> Text em um servico especifico.

**Contexto:** a conversao envolve metadado, tipo de campo, reset de propriedades e banco.

**Arquivos/areas provaveis:**

- Novo servico provavel em `src/main/java/com/neomind/framework/fusion/modules/ged/service/FieldInfoConversionService.java`
- Nova implementacao provavel em `src/main/java/com/neomind/framework/fusion/modules/ged/service/impl/FieldInfoConversionServiceImpl.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/FieldInfoService.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/impl/FieldInfoServiceImpl.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/dao/FieldInfoDAO.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/dao/impl/FieldInfoDAOImpl.java`
- `src/main/java/com/neomind/fusion/entity/FieldInfoInteger.java`
- `src/main/java/com/neomind/fusion/entity/FieldInfoText.java`
- `src/main/java/com/neomind/fusion/entity/FieldInfo.java`

## PRD3330-T06 - Implementar reset backend das configuracoes incompativeis

**Objetivo:** garantir que o campo convertido fique como Texto simples mesmo se o frontend enviar propriedades antigas.

**Contexto:** a PRD exige reset de formula, regras, adapters e propriedades do campo antigo.

**Arquivos/areas provaveis:**

- `FieldInfoConversionServiceImpl`
- `src/main/java/com/neomind/fusion/entity/FieldInfo.java`
- `src/main/java/com/neomind/fusion/entity/FieldInfoInteger.java`
- `src/main/java/com/neomind/fusion/entity/FieldInfoText.java`
- `src/main/java/com/neomind/fusion/entity/ViewRule.java`
- Classes relacionadas a adapter/conversor em `src/main/java/com/neomind/fusion/entity/`
- Testes de servico em `src/test/java/com/neomind/framework/fusion/test/modules/ged/service/impl/`

## PRD3330-T07 - Implementar conversao fisica da coluna no banco

**Objetivo:** converter a coluna de dados de numero para texto preservando valores existentes.

**Contexto:** sem alterar a coluna, o campo convertido pode falhar ao salvar CNPJ alfanumerico.

**Arquivos/areas provaveis:**

- `src/main/java/com/neomind/fusion/persist/schema/SchemaHelper.java`
- `src/test/java/com/neomind/fusion/persist/schema/SchemaHelperTest.java`
- `src/main/java/com/neomind/fusion/entity/FieldInfo.java`
- `src/main/java/com/neomind/fusion/entity/EntityInfo.java`
- `src/main/java/com/neomind/fusion/entity/InstantiableEntityInfo.java`
- Possiveis helpers em `src/main/java/com/neomind/fusion/engine/update/fix/FixUtils.java`

## PRD3330-T08 - Integrar conversao ao save de formulario/tipo de documento

**Objetivo:** executar a conversao somente quando o usuario salvar o formulario ou tipo de documento.

**Contexto:** confirmar o modal nao deve alterar banco imediatamente.

**Arquivos/areas provaveis:**

- `src/main/java/com/neomind/framework/fusion/modules/ged/rest/FieldInfoRest.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/rest/DocumentEntityInfoRest.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/DocumentEntityInfoService.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/impl/DocumentEntityInfoServiceImpl.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/impl/FieldInfoServiceImpl.java`
- `src/main/java/com/neomind/fusion/entity/service/EntityServiceImpl.java`
- `src/main/java/com/neomind/fusion/entity/EntityInfo.java`
- `src/main/java/com/neomind/fusion/entity/dynamic/DocumentEntityInfo.java`

## PRD3330-T09 - Ajustar dropdown de tipo no editor Angular.js

**Objetivo:** permitir troca de tipo apenas para campos Inteiro persistidos elegiveis.

**Contexto:** hoje o tipo de campo persistido e exibido em modo nao editavel.

**Arquivos/areas provaveis:**

- `src/main/frontend/src/webpack/components/field-editor/field-editor.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/field-editor.constant.js`
- `src/main/frontend/src/webpack/components/field-editor/field-editor.tpl.jade`
- `src/main/frontend/src/webpack/components/field-editor/fields/fields-service.js`
- Template legado provavel: `src/main/webapp/WEB-INF/pages/entityfields/fieldeditor/sections/basic.tpl.jade` ou template gerado correspondente
- `src/main/frontend/src/webpack/components/field-editor/entityfields.less`

## PRD3330-T10 - Ajustar bloqueio visual para campo criptografado

**Objetivo:** impedir conversao de Integer criptografado no frontend com tooltip orientativo.

**Contexto:** a PRD pede Texto desabilitado com tooltip especifico.

**Arquivos/areas provaveis:**

- `src/main/frontend/src/webpack/components/field-editor/field-editor.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/fields/integer/field-info-integer.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/fields/text/field-info-text.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/fields/fields-service.js`
- `src/main/frontend/src/webpack/components/field-editor/entityfields.less`
- Template `basic.tpl.jade`/HTML gerado

## PRD3330-T11 - Criar modal Angular.js de confirmacao da conversao

**Objetivo:** mostrar modal antes de marcar conversao pendente.

**Contexto:** a PRD exige aviso de irreversibilidade, execucao no save e possivel demora.

**Arquivos/areas provaveis:**

- Novo template provavel em `src/main/frontend/src/webpack/components/field-editor/modals/field-conversion-alert-modal.tpl.jade`
- Novo controller provavel em `src/main/frontend/src/webpack/components/field-editor/modals/field-conversion-alert-modal.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/field-editor.module.js`
- `src/main/frontend/src/webpack/components/field-editor/fields/fields-service.js`
- Referencia existente: `src/main/frontend/src/webpack/components/field-editor/modals/eform-change-alert-modal.controller.js`

## PRD3330-T12 - Controlar estado pendente e reversao antes do save

**Objetivo:** controlar no frontend quando a conversao foi confirmada, cancelada ou revertida para Integer.

**Contexto:** o usuario pode confirmar Texto e depois voltar para Integer antes de salvar.

**Arquivos/areas provaveis:**

- `src/main/frontend/src/webpack/components/field-editor/field-editor.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/fields/fields-service.js`
- `src/main/frontend/src/webpack/components/entity-fields/entityfields.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/field-editor.service.js`
- `src/main/frontend/src/webpack/components/base/services/base.fieldInfo.service.js`

## PRD3330-T13 - Reset visual das configuracoes no editor

**Objetivo:** deixar a UI coerente com o campo Texto simples apos confirmar conversao.

**Contexto:** a PRD pede reset de propriedades e desativacao de Area/Editor avancado.

**Arquivos/areas provaveis:**

- `src/main/frontend/src/webpack/components/field-editor/fields/text/field-info-text.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/fields/integer/field-info-integer.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/fields/common-interface-elements.constant.js`
- `src/main/frontend/src/webpack/components/field-editor/sections-builder/section-elements/section-elements.service.js`
- `src/main/frontend/src/webpack/components/field-editor/sections-builder/sections-builder.directive.js`
- `src/main/frontend/src/webpack/components/field-editor/field-editor.controller.js`
- `src/main/frontend/src/webpack/components/field-editor/entityfields.less`

## PRD3330-T14 - Integrar frontend com REST de elegibilidade

**Objetivo:** usar o REST para saber se a conversao pode ser oferecida e quais avisos exibir.

**Contexto:** regras criticas nao devem ficar duplicadas apenas no Angular.js.

**Arquivos/areas provaveis:**

- `src/main/frontend/src/webpack/components/base/services/base.fieldInfo.service.js`
- `src/main/frontend/src/webpack/components/field-editor/fields/fields-service.js`
- `src/main/frontend/src/webpack/components/field-editor/field-editor.controller.js`
- `src/main/frontend/src/webpack/components/entity-fields/entityfields.controller.js`

## PRD3330-T15 - Validar runtime legado e nova engine apos conversao

**Objetivo:** garantir que o campo convertido renderize e salve corretamente depois da conversao.

**Contexto:** a conversao muda tipo e coluna, mas o campo precisa funcionar nas duas engines.

**Arquivos/areas provaveis:**

- `src/main/webapp/js/modules/core/form/form.js`
- `src/main/webapp/js/modules/core/form/validador_CPF_CNPJ.js`
- `src/main/webapp/webui/mask/mask.vm`
- `src/main/frontend/src/webpack/components/field-mask/field-mask.service.js`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/layout/service/runtime/LayoutRuntimePopulator.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/layout/service/ComponentRegister.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/mask/MaskParamsGenerator.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/model/mapper/FieldInfoMapper.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/model/dto/FieldInfoTextDTO.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/model/dto/FieldInfoIntegerDTO.java`

## PRD3330-T16 - Validar e ajustar component-library, se necessario

**Objetivo:** garantir que a renderizacao React suporte o campo convertido.

**Contexto:** o component-library ja teve ajuste de mascara CNPJ no FUSION-41328, mas a conversao pode expor nova combinacao de dados.

**Arquivos/areas provaveis em `C:/component-library`:**

- `packages/form-renderer/src/components/Form.tsx`
- `packages/form-renderer/src/utils/FieldMaskValidator.ts`
- `packages/form-renderer/src/utils/FieldValidator.ts`
- `packages/form-renderer/src/utils/validation.ts`
- `packages/form-renderer/tests/utils.test.ts`
- `packages/input-text/src/`
- `packages/input-integer/src/`
- `packages/fusion-dev-integration/`

## PRD3330-T17 - Validar importacao/exportacao de formularios e documentos

**Objetivo:** garantir que estruturas e registros com campo convertido continuem importando/exportando.

**Contexto:** Jira menciona risco em importadores.

**Arquivos/areas provaveis:**

- `src/main/java/com/neomind/fusion/importer/eform/service/impl/FormDataImportServiceImpl.java`
- `src/main/java/com/neomind/fusion/importer/eform/service/impl/FormDataServiceImpl.java`
- `src/main/java/com/neomind/fusion/data/FieldHelper.java`
- `src/main/java/com/neomind/fusion/entity/exchange/EntityInfoExporter.java`
- `src/main/java/com/neomind/fusion/entity/exchange/EntityInfoUpdater.java`
- `src/main/java/com/neomind/fusion/entity/serialize/tree/field/FieldInfoDefaultSerializer.java`
- `src/main/java/com/neomind/fusion/entity/serialize/tree/field/types/FieldInfoIntegerSerializer.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/service/impl/DocumentEntityInfoServiceImpl.java`

## PRD3330-T18 - Validar APIs de documento, processo e integracoes externas

**Objetivo:** definir e validar comportamento das APIs com campo convertido.

**Contexto:** a PRD tem duvida explicita sobre impacto em APIs.

**Arquivos/areas provaveis:**

- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/resources/DocumentRest.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/resources/EntityRest.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/resources/FormRendererRest.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/resources/FieldRendererRest.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/resources/dto/SaveFormRequest.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/service/DocumentServiceImpl.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/service/FormServiceImpl.java`
- `src/main/java/com/neomind/framework/fusion/modules/eform/engine/service/EntityServiceImpl.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/rest/DocumentEntityInfoRest.java`
- `src/main/java/com/neomind/framework/fusion/modules/ged/rest/FieldInfoRest.java`
- `src/main/java/com/neomind/fusion/webservice/soap/`
- `src/main/java/com/neomind/fusion/webservice/odata/`

## PRD3330-T19 - Criar testes automatizados tecnicos

**Objetivo:** cobrir regras criticas em testes de unidade/integracao.

**Contexto:** a funcionalidade envolve backend, banco, frontend legado e nova engine.

**Arquivos/areas provaveis:**

- `src/test/java/com/neomind/framework/fusion/test/modules/ged/service/impl/FieldInfoServiceImplTests.java`
- Novos testes provaveis para `FieldInfoConversionServiceImpl`
- `src/test/java/com/neomind/fusion/persist/schema/SchemaHelperTest.java`
- `src/test/java/com/neomind/framework/fusion/modules/eform/engine/layout/service/runtime/LayoutRuntimePopulatorTest.java`
- `src/test/java/com/neomind/framework/fusion/modules/eform/engine/mask/MaskParamsGeneratorTest.java`
- Testes frontend existentes, se houver infraestrutura para Angular.js
- `C:/component-library/packages/form-renderer/tests/utils.test.ts`, se component-library for alterado

## PRD3330-T20 - Criar E2E e validacao final da feature

**Objetivo:** validar a feature completa ponta a ponta.

**Contexto:** precisa garantir que backend, UI, banco, legado, nova engine e integracoes funcionem juntos.

**Arquivos/areas provaveis:**

- Repositorio/projeto de E2E Playwright relacionado ao Fusion
- Massas de teste de formulario dinamico
- Massas de teste de tipo de documento
- Evidencias de QA
- Matriz PRD -> teste
