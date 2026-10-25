# NutriPilot — o proprietário só precisa de três coisas

1. Entrar nas próprias contas Apple Developer, Google Play e RevenueCat quando for aberto o acesso seguro. Se não tiver cadastro, concluir identidade e eventuais termos/taxas diretamente na plataforma; nenhuma contratação está autorizada automaticamente.
2. Confirmar o nome legal e o endereço real já preparados em privado. Não colocar documento ou endereço no GitHub. Documentos são enviados somente ao formulário oficial que os exigir.
3. Aprovar valores/orçamento antes de ativar cobrança ou consumo pago. Não é necessário entender arquivos de build, certificados ou IDs técnicos: o agente configura e valida essa parte quando houver acesso.

## Trabalho técnico assumido

O GitHub prepara a compilação Android e iOS para teste, sem credenciais de loja nem assinatura de distribuição. O repositório é público e os jobs usam somente runners padrão; uma condição bloqueia esses jobs se ele se tornar privado. Não há envio à loja nem uso de segredos de produção. Os artefatos diagnósticos têm retenção de um dia.

O diagnóstico Android produz APK de depuração e AAB sem assinatura de distribuição; o iOS produz aplicativo para simulador. Nenhum deles certifica publicação, compra real, assinatura do proprietário ou aprovação. A shell remota usa a versão que estiver realmente no backend; enquanto produção estiver em V12, compilar a shell não atualiza o conteúdo para 18.1.0.

Codemagic é opcional: o agente não deve pedir uma nova assinatura só para compilar. Sua configuração de artefatos Android não exige mais o grupo de credenciais Google Play que só seria necessário para distribuição. Fluxos de release continuam exigindo assinatura real e as travas de publicação; nenhum build pago ou distribuição automática é iniciado.

Acesso a contas não é comprovado pela existência de e-mail ou arquivo de configuração. Identidade, contratos, pagamentos e códigos de autenticação continuam sendo etapas pessoais do proprietário. Nunca pedir senha ou código no chat.
