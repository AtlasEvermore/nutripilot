# Movimento completo no iPhone e sem travadas — 30/10/2026

- Causa do app "seco": o modo econômico ligava quando o navegador informava ≤4 núcleos; o Safari do iPhone informa poucos núcleos mesmo em aparelhos rápidos, então todas as animações (órbitas do mundo, anel V13 girando, brilho dos botões) eram desligadas. Novo limite: ≤2 núcleos ou ≤2 GB.
- Causa das travadas: desfoque de fundo (backdrop-filter) em muitos cartões e anel do score redesenhado a cada quadro. Removido o desfoque dos cartões novos; anel gira por transform (composição).
- sw.js: cache renomeado (v51) para atualizar ícones de quem já visitou.
- Movimento reduzido do sistema continua desligando tudo.
- 30/10 12:20 BRT: camada visual corrigida para nunca substituir fundos/fotos/animações originais (seção Treino e mundo animado de volta), comparação lado a lado com 7b74f94 sem perda de conteúdo.
- 30/10 13:30 BRT: Atlas vivo (varredura de radar, rotas com energia, nós pulsando), hidratação estilo oceano profundo, Kit completo com halo girando. Somente CSS aditivo; movimento reduzido e aparelhos fracos desligam.
