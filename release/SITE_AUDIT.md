# NutriPilot 18.1.0 — revisão do site e limites da validação

## Correções desta revisão

| Problema reproduzido | Correção e verificação |
|---|---|
| Salvamentos simultâneos recriavam o arquivo do usuário depois da exclusão da conta no modo files | Fila por conta coordena salvamento/exclusão e revalida o acesso antes da gravação. Teste dispara oito salvamentos simultâneos e exclui a conta; nenhum arquivo pessoal reaparece. |
| Um cliente podia incluir accountToken nos dados persistidos | O servidor remove o token de conta junto com os demais campos de autenticação/permissão antes de salvar, nos dois backends. Teste confere o conteúdo retornado. |
| Arquivo novo sem cache ficava esperando indefinidamente numa rede travada | Service worker encerra a espera em dez segundos e cancela a tentativa; mantém fallback offline sem substituir JavaScript por HTML. |
| Páginas legais, contato e exclusão podiam ficar congeladas no cache antigo | As quatro rotas deixam de usar o cache do service worker. Nova versão do cache remove a cópia antiga na ativação. |
| Falha de escrita no cache podia gerar rejeição não tratada; erro do servidor descartava uma cópia local utilizável | Falhas de cache são tratadas sem impedir a resposta de rede; erro 5xx do shell usa a cópia salva quando disponível. Teste cobre cache cheio e servidor indisponível. |
| Sincronização aceitava rajadas sem limite próprio e só media o estado depois de ler o corpo geral de até 14 MB | Limite de 120 salvamentos por minuto por conta, oito gravações simultâneas por instância e corpo limitado ao tamanho do estado. Excesso recebe 429 ou 413; teste confere recuperação e preservação do estado salvo. |

Nenhum limite de consumo foi afrouxado, checkout externo reintroduzido ou dado de produção alterado. A versão consolidada continua 18.1.0; somente a revisão aprovada mais recente deve ser publicada.

## Verificações executadas

- Análise sintática do servidor, cliente, service worker e módulos operacionais; geração de traduções sem alterações pendentes.
- Suíte do aplicativo: foto/texto e erros com prestador simulado, chat e histórico, consentimento, interrupção e respostas atrasadas, autenticação e acesso, persistência, corrupção, exclusão, sincronização, assinaturas simuladas, cotas e proteção de consumo.
- PostgreSQL real com dois processos no CI; transações, orçamento/limites compartilhados, importação, login de uso único, compra/expiração/exclusão e virada de dia/mês. Localmente essa parte é omitida quando não há banco de teste.
- Testes da trava de publicação e configuração nativa. Auditoria das dependências de produção sem vulnerabilidades reportadas na execução local.
- Nova restauração do backup real em destino privado isolado: candidata revisada iniciou, health respondeu e sete rotas públicas retornaram HTTP 200. Os arquivos originais continuaram byte a byte idênticos depois do encerramento. Nenhuma credencial externa fornecida, análise paga desativada.
- CI e imagem da revisão exata devem passar antes da integração. Publicar uma imagem no registro não implanta o site.

## O que ainda impede o deploy

A lista autoritativa é readiness.json e a saída de node ops/release-gate.mjs prepare. Nesta revisão há oito verificações sem comprovação:

1. Confirmação explícita da elegibilidade de deploy e continuidade da hospedagem. Hobby e console conectado já foram observados; não foi enviado deploy apenas para testar o bloqueio.
2. Orçamento, modelo e limites do prestador de análise verificados. Proteções estão preparadas para manter consumo pago desligado; nenhum orçamento positivo autorizado.
3. Entrega real do código de acesso com a chave substituta e login validado. Nomes de variáveis configurados não comprovam entrega.
4. Identidade e políticas reais conferidas. Nome/endereço fornecidos pelo proprietário estão somente no patch privado; aplicação no processo, formatação final e páginas reais ainda precisam de conferência.
5. Configuração iOS: conta, produtos, conexão RevenueCat e assinatura.
6. IPA assinado da candidata identificado e verificado.
7. Configuração Android: conta, produtos, conexão RevenueCat e assinatura.
8. AAB assinado da candidata identificado e verificado.

A indisponibilidade dessas configurações não é corrigida com endereço inventado, chaves falsas ou marcação antecipada de evidência. Nenhum RG/CPF/documento deve ser gravado no repositório.

## Depois do deploy e antes de anunciar o lançamento

Confirmar SUCCESS e versão/revisão no domínio; novos segredos em uso e revogação coordenada dos antigos; foto e chat com prestador real dentro do orçamento; entrega de e-mail, login, sincronização e exclusão em conta própria; backup externo recorrente e alertas recebidos; Wait for CI ativo e páginas legais reais. Em cada loja, conferir compra/restauração/cancelamento/reembolso em teste, artefato assinado, revisão e disponibilidade. Executar launch e guardar evidências privadas.

Os testes automatizados usam dados sintéticos e serviços simulados quando indicado. Não substituem aparelhos reais, entrega de e-mail, orçamento, carga de produção ou aprovação das lojas. Esta revisão não garante ausência absoluta de bugs nem capacidade para milhões de acessos.
