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

## Resultado verificado em 25/10/2026

- Material de assinatura transmitido ao GitHub somente após confirmação específica do proprietário. Três segredos no ambiente protegido ios-signing; Required reviewers inclui AtlasEvermore, bypass administrativo desativado, somente main e nenhuma tag permitida. Nenhuma chave de compras Apple foi adicionada ao build.
- Revisão 5a4f67a1b7c8bf86140f381370ef22bd27f418b3, nativeTree 39d0f6ebdde9f52a715c46fc9b9de67c7538e24c. Regressão e imagem de servidor passaram no run 40237669241: 62 testes da aplicação, 8 da trava, 3 nativos e 10 de assinatura; zero falhas. Imagem imutável ghcr.io/atlasevermore/nutripilot@sha256:e6994f8850b4d5a571f16ecb65707624cf5354c7cfdd8fce847de9eca5aaaef1, sem implantação.
- Run 40237700794, tentativa 2: SUCCESS. IPA de dispositivo versão 18.1.0, build 202; códigos de assinatura, certificado aprovado, perfil exato, time, bundle, versão e número conferidos. A limpeza do chaveiro e arquivos temporários também passou.
- ZIP do artefato baixado: hash conferido contra o digest do GitHub; hash do IPA conferido contra o recibo e SHA256SUMS; Info.plist conferido independentemente. Cópia durável guardada em área privada do proprietário, fora da retenção de um dia do GitHub. Sem PKCS12 ou senha no artefato. Prova técnica sem segredos: IOS_ARTIFACT_2026-10-25.json.
- ios_artifact atualizado com essa evidência real, sem alterar nativeTree/applicationTree nem os requisitos. CI preparada renovada após releitura do patch Railway; Wait for CI permanece somente STAGED. ios_configuration, compras/restauração e aprovação da loja continuam pendentes.
- Chave pública SDK iOS do RevenueCat existente preparada no Railway como REVENUECAT_IOS_KEY, no mesmo patch (agora 16 mudanças), staged/skipDeploys. Nada aplicado ao processo antigo. Não foi criada chave administrativa extra; não confundir chave pública SDK com segredo de servidor.

## Falhas anteriores corrigidas e limites da comprovação

No primeiro run 40236821230, a instalação da identidade, archive e export passaram, mas o verificador usava o prefixo opcional de codesign --extract-certificates como argumento separado. Corrigida a sintaxe documentada --extract-certificates=PREFIXO e adicionado teste do contrato da CLI; preservadas todas as verificações. A falha impediu o envio do artefato. Na primeira tentativa do run 40237700794, a revisão aprovada não havia sido atualizada porque o GitHub exigiu confirmação de acesso. A trava recusou antes de carregar credenciais. Após confirmação via fluxo seguro e readback da revisão salva, a repetição concluiu com sucesso, sem bypass.

Catálogo mensal/anual permanece cadastrado no RevenueCat com Store Status Could not check; nenhuma chave secreta foi criada. Não houve compra/restauração, TestFlight, envio de binário à Apple, submissão ou publicação. A aplicação nativa continua carregando o backend existente: este IPA não comprova que o conteúdo web foi atualizado. O sucesso da geração não autoriza ignorar as demais pendências de prepare/launch.
