# App Store — disponibilidade e ficha (decisão do proprietário, 29/10/2026)

Autorização explícita do proprietário em 29/10/2026 18:08 (America/Sao_Paulo): "autorizo esses 35 países". Substitui a seleção de 175 países, que não foi aplicada.

- Américas (5): Estados Unidos, Canadá, Brasil, México, Chile
- Europa (19): Reino Unido, Irlanda, França, Bélgica, Suíça, Luxemburgo, Alemanha, Áustria, Holanda, Espanha, Portugal, Itália, Polônia, Suécia, Noruega, Dinamarca, Finlândia, Islândia, Mônaco
- Oriente Médio (4): Emirados Árabes Unidos, Arábia Saudita, Catar, Kuwait
- Ásia-Pacífico (7): Japão, Coreia do Sul, Singapura, Austrália, Nova Zelândia, Hong Kong, Taiwan

Fora: China continental, Índia, Indonésia, Turquia e os demais.

Nome na loja aprovado: **NutriPilot: Health OS** (somente metadados; o app e o código continuam com a marca NutriPilot, sem mudança na árvore da aplicação ou nativa). Ficha em 11 idiomas (inglês principal; pt-BR, fr, es, de, it, nl, pl, ja, ko, ar), redigida no documento do proprietário e ainda **não** colada na App Store Connect. O mapa de locais de saúde foi retirado da ficha até existir no app. Linhas marcadas [IA] dependem de `AI_ENABLED`; decisão pendente.

Ainda não aplicado na App Store Connect: países, nomes, descrições, contato de revisão, declaração de privacidade e vínculo do build. Requer sessão do proprietário no navegador do computador.

## Atualização 29/10 ~20h30 (aplicado na App Store Connect pelo navegador do proprietário)
- Aplicados: nome/subtítulo/descrição/palavras-chave/texto promocional em 17 localizações (en-US/GB/AU/CA, pt-BR/PT, fr-FR/CA, es-ES/MX, de-DE, it, nl-NL, pl, ja, ko, ar-SA); idioma principal en-US; URLs; copyright; lançamento manual; notas de revisão (sem login).
- Disponibilidade: 34 territórios (Mônaco não é vitrine própria; usa a França), sem novos territórios automáticos.
- Capturas: 6 iPhone 6,9" + 6 iPad 13" por idioma (en, pt, fr, es, de, it), molduras sobre telas reais com dados sintéticos; fontes na branch `store-screenshots-18.1.0` (9d27896).
- IA: decisão do proprietário de ligar só para assinantes, gpt-5-mini, US$5 de crédito, recarga automática desligada. Railway ainda com AI_ENABLED=false e OPENAI_MODEL antigo; mudar só no patch preparado, nunca direto no serviço ao vivo.
- Falta: contato de revisão (proprietário), upload do build 301 (workflow PR #39 + chave ASC API em secrets; IPA temporária na branch `tmp-ipa-upload-301`, apagar após upload), RevenueCat inexistente no Railway (chaves/webhook/entitlement), declaração de privacidade, gates de deploy.
