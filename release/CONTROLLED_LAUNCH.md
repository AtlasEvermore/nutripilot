# NutriPilot 18.0.2 — lançamento com custo controlado

## O que mudou

- IA pausada por padrão (`AI_ENABLED=false`). Guardar uma chave não ativa consumo.
- Visitantes não têm análises de IA por padrão: `AI_ALLOW_GUESTS=false` e `FREE_SCANS=0`. A API exige compra ativa; alterar o navegador não concede acesso.
- O suporte público usa respostas locais de ajuda, sem chamada a modelo externo. Assuntos específicos são encaminhados ao e-mail de suporte.
- Código de barras e registro manual continuam disponíveis sem IA. Não anunciar IA gratuita ou ilimitada.
- Após aprovação do orçamento, os valores iniciais de proteção são 10 solicitações por usuário/dia, 50 tentativas externas por dia e 500 por mês no serviço, com no máximo duas chamadas simultâneas. Falhas e novas tentativas também contam no teto global.
- Contadores globais persistem em `/data/ai-usage.json`, são gravados antes da chamada e entram no backup criptografado. Zero ou configuração inválida desativa, nunca libera uso ilimitado. Arquivo corrompido bloqueia chamadas em vez de zerar a contagem.

Esses são limites de quantidade, NÃO um teto financeiro em reais ou dólares. O custo depende do modelo, entrada, imagem, saída e novas tentativas. Não ativar até medir o custo por operação, aprovar orçamento e configurar os controles do provedor. A chave geral continua pausada até isso acontecer. O contador pressupõe uma única instância: múltiplos processos/replicas exigem um contador transacional compartilhado antes de escalar.

## Funil web e pagamento

A compra web antes levava às lojas de aplicativos, que ainda não tinham URLs configuradas. A candidata agora aceita checkout Hotmart para uma oferta exata do Kit completo, com redirecionamento validado no servidor. É necessário conferir produto, preço, moeda, periodicidade, benefícios e webhook antes de preencher `HOTMART_CHECKOUT_COMPLETE_MONTHLY` / `HOTMART_CHECKOUT_COMPLETE_ANNUAL` e ativar `WEB_CHECKOUT_ENABLED`.

O código não reutiliza automaticamente links históricos nem transforma um plano isolado em Kit completo. O checkout permanece desativado até a confirmação comercial. O site não promete um teste gratuito da App Store em uma compra Hotmart. As condições definitivas devem corresponder às exibidas na oferta de pagamento.

Não iniciar uma campanha de vendas enquanto compra de teste, recebimento do e-mail, acesso, cancelamento e reembolso não estiverem comprovados. Nenhuma campanha ou despesa de publicidade foi criada.

## Interface e recuperação

A tela de refeição mostra todos os métodos em uma grade adaptável, estado selecionado acessível, erro persistente na tela, alternativas sem IA e possibilidade de fechar durante o processamento. Mensagens novas têm tradução para português, inglês, espanhol, alemão e italiano, com francês como origem. O novo dicionário pequeno faz parte do cache offline, sem carregar todos os idiomas extras no telefone.

Os testes automatizados exercitam a renderização e o servidor. A inspeção visual em aparelhos reais e a aceitação final no domínio continuam pendentes; não registrar isso como concluído por um teste de HTML.

## Alternativas gratuitas de IA avaliadas em 24/10/2026

| Alternativa | Uso possível | Condição antes de ativar |
|---|---|---|
| Recursos locais existentes | Registro manual, cálculos, biblioteca e ajuda automática sem custo de inferência | Não apresentar regras locais como IA generativa nem como reconhecimento de foto |
| Groq Free | Avaliação de um modelo dentro dos limites gratuitos do provedor | Conta/chave própria, modelo compatível, privacidade e qualidade verificadas; sem upgrade automático |
| Gemini Free | Experimentos com dados sintéticos ou não sensíveis, conforme termos aplicáveis | Não encaminhar automaticamente fotos, histórico ou dados de saúde de clientes ao serviço gratuito |

Fontes oficiais:
- https://console.groq.com/docs/rate-limits
- https://console.groq.com/docs/your-data
- https://ai.google.dev/gemini-api/docs/pricing
- https://ai.google.dev/gemini-api/terms

Não foi criada conta em outro provedor, não foi enviada informação de clientes a outro modelo e não foi ativada uma alternativa sem avaliação. Uma faixa gratuita não garante capacidade, qualidade ou disponibilidade para o público.

## Publicação condicional

Usar a candidata mais recente do GitHub, hoje 18.0.2, sem publicar as versões intermediárias. Acompanhar o Railway e o suporte; só implantar após todas as evidências de `prepare` estarem válidas, CI/imagem aprovadas, backup externo/restauração comprovados e acesso liberado. O retorno da hospedagem sozinho não satisfaz os demais requisitos.

Depois da implantação, exigir SUCCESS, conferir revisão e domínio e executar a aceitação `launch`. Se houver bloqueio de aprovação, não trocar de ferramenta para contorná-lo. Não apagar volume, trocar DNS, comprar serviços ou revogar credenciais automaticamente.
