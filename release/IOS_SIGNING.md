# Geração controlada do IPA — iOS primeiro

O workflow `iOS signed artifact` gera somente um arquivo de distribuição, sem acesso à App Store Connect API, sem upload, submissão, publicação do backend ou alteração de DNS. A geração do artefato não substitui `prepare`/`launch`, compras/restauração reais, revisão da Apple ou aprovação das políticas. A aplicação nativa continua apontando para o domínio existente; uma compilação não atualiza o backend atualmente servido.

## Antes de fornecer credenciais

1. Confirmar especificamente com o proprietário o envio do PKCS12 criptografado, sua senha e o perfil App Store ao GitHub, para uso por runners efêmeros do repositório AtlasEvermore/nutripilot. A confirmação anterior para emitir certificado/perfil não abrange essa transferência. Não gravar valores em código, mensagens, issues ou logs.
2. Criar/revisar o ambiente `ios-signing`, com aprovação obrigatória do proprietário e restrição de implantação apenas à branch `main`. Conferir as proteções salvas antes de adicionar segredos. Sem orçamento para serviços pagos: o job só aceita este repositório público e runner padrão `macos-26`; não ativar faturamento ou builds pagos.
3. Guardar somente no ambiente protegido os segredos `IOS_DISTRIBUTION_P12_BASE64`, `IOS_DISTRIBUTION_P12_PASSWORD` e `IOS_DISTRIBUTION_PROFILE_BASE64`. Base64 é transporte, não criptografia. Não adicionar chave de compras Apple ou chave administrativa: não são necessárias para exportar o IPA.
4. Após revisão e CI, definir a variável do ambiente `IOS_SIGNING_APPROVED_REVISION` como o SHA completo aprovado. Disparar manualmente na `main` com o input `revision` igual ao mesmo SHA. O workflow recusa outra branch, repositório privado e revisão divergente; nunca chamar por eventos de PR ou `pull_request_target`.

## O que a geração confere

- Dependências travadas e testes nativos antes de carregar as credenciais. Resolução de pacotes antes da importação do certificado.
- Perfil exatamente igual ao download autorizado da Apple, certificado esperado, time/bundle corretos, ausência de depuração e distribuição App Store com mais de 24 horas de validade.
- Assinatura manual somente nas configurações do alvo App; não aplicar perfil de provisionamento às dependências Swift.
- Certificado em chaveiro temporário. Segredos nunca integram o checkout nem a seleção de artefatos. Limpeza `always()` do chaveiro e arquivos temporários, inclusive na falha; runners hospedados também são descartados pelo GitHub.
- Verificação do IPA de dispositivo: assinatura, certificado, perfil, bundle, versão e número da compilação. Recibo com SHA do commit, nativeTree e SHA-256 do IPA. Nenhuma transação de compra é presumida.

O resultado aprovado é somente `NutriPilot.ipa`, `receipt.json` e `SHA256SUMS`, com retenção de um dia no GitHub. O repositório é público; revisar a audiência dos artefatos antes da execução. Preservar uma cópia durável do resultado validado em área privada do proprietário e registrar a referência sem chaves. Não distribuir o PKCS12 ou a senha como artefato. O contador do workflow compõe o número da compilação; conferir se é maior que qualquer build já enviado à Apple antes de um futuro upload.

## Estado de preparação em 25/10/2026

Certificado e perfil emitidos e validados localmente. Nove testes das fronteiras de assinatura/identidade e rejeição de artefatos incorretos passaram; YAML, scripts shell e integração com o perfil real e o template instalado do Capacitor também passaram. Ainda não executado em macOS com credenciais; não declarar IPA gerado até o job terminar e o recibo/arquivo serem conferidos. Ambiente ios-signing criado e conferido no GitHub: Required reviewers inclui o proprietário AtlasEvermore, bypass administrativo desativado, somente a branch main permitida e nenhuma tag permitida. Ainda sem segredos ou variável de revisão aprovada. CI de regressão da implementação 49d0e000967507700740de3e19809082dde240fc passou no run 40235288596: 62 testes da aplicação, 8 da trava, 3 nativos e 9 de assinatura; zero falhas e zero vulnerabilidades de produção encontradas na auditoria dessa revisão. Não marcar `ios_artifact` ou `ios_configuration` como verificados por esta preparação.

## Primeira execução com credenciais e correção do verificador

Após confirmação específica, os três segredos foram guardados no ambiente protegido do GitHub, sem inclusão no repositório. A variável de aprovação apontou para d8a500fdb537262ab040459f7ffdf6e06e4341f2, cuja regressão e imagem de servidor passaram no run 40235598007. O proprietário também autorizou o uso para gerar o artefato, incluindo retenção de um dia no repositório público; a revisão do ambiente foi aprovada sem bypass.

No run 40236821230, macOS/Xcode 26.6, a instalação da identidade, archive e export passaram. A verificação final falhou e nenhum artefato foi publicado; a limpeza de credenciais terminou com sucesso. O verificador usava o prefixo opcional de `codesign --extract-certificates` como argumento separado; a sintaxe documentada pela Apple para prefixo é `--extract-certificates=PREFIXO`. Corrigida a chamada e adicionado teste desse contrato de CLI, totalizando dez testes locais. Erros agora identificam a verificação ou ferramenta que falhou, sem mostrar segredos. Todos os requisitos de certificado, perfil, identidade, versão e assinatura foram preservados; somente uma nova execução concluída poderá aprovar o IPA.

Catálogo mensal/anual permanece cadastrado no RevenueCat com Store Status Could not check. Não foi criada chave secreta de RevenueCat: o formulário foi apenas preparado, pois criar esse acesso e transmiti-lo ao backend exige confirmação específica separada da assinatura iOS. Nenhuma compra/restauração, implantação, submissão ou disponibilidade em loja foi certificada.
