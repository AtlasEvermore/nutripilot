# Publicação da candidata 18.0.2

Distribuição: App Store e Google Play. Este roteiro descreve trabalho pendente; não certifica disponibilidade nem aprovação.

1. Confirmar contas de desenvolvedor sob controle do proprietário, identidade do editor, suporte e formulários legais. Não criar assinaturas pagas sem orçamento.
2. Configurar os produtos correspondentes ao catálogo no App Store Connect e no Play Console, e os aplicativos/entitlements no RevenueCat. Guardar apenas as chaves públicas SDK no cliente; segredos exclusivamente no servidor.
3. Confirmar as regras de associação/restauração de compras no RevenueCat com uma conta de teste. O acesso exige e-mail confirmado, identificador derivado dessa conta e assinatura vigente de app_store ou play_store; reembolso e expiração revogam o acesso.
4. Preparar certificados/perfis iOS e keystore Android com cópia de recuperação segura. Não gravar credenciais no repositório ou em relatórios.
5. Gerar projetos, executar configure-native.mjs --check com APP_VERSION=18.0.2 e BUILD_NUMBER crescente. Construir IPA/AAB assinados em ambiente autorizado. Codemagic produz artefatos, sem envio automático. Compilação paga não está autorizada sem orçamento.
6. Resolver os requisitos de infraestrutura, backup independente e restauração antes do deploy do backend. Executar node ops/release-gate.mjs prepare na revisão exata. Registrar hashes/assinaturas dos artefatos no manifesto sem segredos.
7. No backend implantado, testar foto real, várias mensagens de coach, consentimento, offline, reenvio de código, sincronização e exclusão. Conferir tamanho de texto, teclado e leitor de tela em aparelhos reais.
8. Enviar apenas para testes autorizados: TestFlight e faixa de testes do Play. Testar compra, cancelamento, expiração, reembolso, reinstalação e restauração; confirmar ausência de cobrança externa e preços/moeda corretos. Entregar à revisão instruções e acesso de teste válidos; não inventar credenciais.
9. Atualizar capturas da candidata final e formulários de privacidade/saúde conforme o comportamento real e os contratos dos prestadores. As capturas antigas do repositório não são evidência de teste desta candidata.
10. Registrar aprovação e disponibilidade de cada loja, executar node ops/release-gate.mjs launch e só então anunciar lançamento. Requisitos de testes/acesso à produção e prazos dependem da conta e da revisão real; conferir nos painéis.

Atualizar o backend não substitui os binários, a assinatura, os testes nem a revisão das lojas. Não marcar etapas como concluídas apenas por arquivos ou instruções existirem.
