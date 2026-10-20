# Google Play Console — textos e respostas (copiar e colar)

App: **NutriPilot** · Pacote `com.atlasevermore.nutripilot` · **Gratuito** com compras no app
Categoria: **Saúde e fitness** · Tags: Contador de calorias, Dieta e nutrição, Treino, Saúde da mulher
E-mail de contato: `SUPPORT_EMAIL` · Site: `https://atlasevermore.com` · Privacidade: `https://app.atlasevermore.com/privacy`

## Ficha da loja

### 🇫🇷 Français (langue par défaut)
- **Titre (30):** `NutriPilot : Nutrition & Sport`
- **Description courte (80):** `Scannez vos repas, comptez les calories, suivez un plan repas + sport sur mesure`
- **Description complète:** a mesma de `app-store.md` (FR), substituindo o parágrafo ABONNEMENT por:
```
ABONNEMENT
Kit complet ou formules par thème, mensuelles ou annuelles ; 7 jours d’essai gratuit sur l’abonnement annuel pour les nouveaux abonnés. L’abonnement se renouvelle automatiquement ; annulez à tout moment dans Google Play › Paiements et abonnements. Aucun compte ni mot de passe à créer : vos achats se restaurent avec votre compte Google.
```

### 🇧🇷 Português (Brasil)
- **Título (30):** `NutriPilot: Dieta e Treino`
- **Descrição curta (80):** `Fotografe refeições, conte calorias e siga um plano de dieta e treino sob medida`
- **Descrição completa:** a de `app-store.md` (PT), com o parágrafo ASSINATURA:
```
ASSINATURA
Kit completo ou planos por tema, mensais ou anuais; 7 dias de teste grátis no plano anual para novos assinantes. Renova automaticamente; cancele quando quiser em Google Play › Pagamentos e assinaturas. Sem conta nem senha: as compras são restauradas com a sua conta Google.
```

### 🇺🇸 English (US)
- **Title (30):** `NutriPilot: Food & Fitness`
- **Short description (80):** `Snap meals, count calories and follow a nutrition + workout plan built for you`
- **Full description:** the English one from `app-store.md`, with SUBSCRIPTION:
```
SUBSCRIPTION
Complete Kit or themed plans, monthly or yearly; 7-day free trial on the yearly plan for new subscribers. Renews automatically; cancel any time in Google Play › Payments & subscriptions. No account or password: purchases are restored with your Google account.
```

### Recursos gráficos
- Ícone 512×512: `native/resources/icon.png` (redimensione) · Gráfico de recursos 1024×500: `native/resources/feature-graphic.png`
- Capturas de telefone: `screenshots/android-phone/<lang>/` (1080×2340), 6 por idioma
- Tablet (opcional, recomendado): use `screenshots/ipad-13/<lang>/`

---

## Conteúdo do app (Política › Conteúdo do app)

**Acesso ao app:** "Todas as funcionalidades estão disponíveis sem acesso especial" (não há login).

**Anúncios:** Não contém anúncios.

**Classificação de conteúdo (IARC):** categoria **"Todos os outros tipos de app"**.
Violência, sexo, linguagem, drogas, jogos de azar: Não · Interação entre usuários: Não · Compartilha localização: Não ·
Compras digitais: **Sim** · Conteúdo gerado por IA: Sim (coach de nutrição/treino).

**Público-alvo:** **18 anos ou mais** (somente). Não atrai crianças.

**Apps de saúde (Declaração de apps de saúde):** marque
Gestão de nutrição e peso · Atividade física e fitness · Saúde da mulher (menopausa) · Gestão do sono · Gestão do estresse.
Não é dispositivo médico; não oferece diagnóstico nem tratamento. Política de privacidade acessível no app e na ficha.

**Segurança dos dados:**
- Coleta ou compartilha dados do usuário? **Sim** · Criptografados em trânsito? **Sim** · Usuário pode pedir exclusão? **Sim**
  (`https://app.atlasevermore.com/delete-account` e no app)
- Compartilhamento com terceiros: **Não** (OpenAI, RevenueCat e hospedagem atuam como prestadores de serviço — pela definição do Google não é "compartilhamento").

| Categoria › tipo | Coletado | Opcional? | Finalidade | Efêmero |
|---|---|---|---|---|
| Saúde e fitness › Informações de saúde | Sim | Opcional | Funcionalidade do app | Não |
| Saúde e fitness › Informações de fitness | Sim | Opcional | Funcionalidade do app | Não |
| Fotos e vídeos › Fotos (refeições, rótulos) | Sim | Opcional | Funcionalidade do app | **Sim** (só para a análise) |
| Mensagens › Outras mensagens no app (coach) | Sim | Opcional | Funcionalidade do app | Não |
| Informações pessoais › Nome (apelido) | Sim | Opcional | Funcionalidade do app, Personalização | Não |
| Informações pessoais › E-mail (login opcional) | Sim | Opcional | Gerenciamento da conta | Não |
| Informações financeiras › Histórico de compras | Sim | Obrigatório | Funcionalidade do app | Não |
| IDs do dispositivo ou outros › (ID anônimo de compra) | Sim | Obrigatório | Funcionalidade do app | Não |
| Atividade no app › Interações no app (contagens anônimas) | Sim | Obrigatório | Análises | Não |

**Exclusão de conta:** URL `https://app.atlasevermore.com/delete-account` · no app: Configurações › Excluir minha conta.

**Política de assinaturas:** preço, período, teste e renovação aparecem no paywall antes da compra; cancelamento pelo Google Play.

**Permissões declaradas:** Câmera (fotos de refeições e código de barras) · Notificações (lembretes) · Cobrança (compras).
Sem localização, contatos, SMS ou alarmes exatos.

---

## Teste fechado (contas pessoais)

1. Testar › **Teste fechado** › criar faixa "beta" › Países: França, Brasil (+ outros).
2. Testadores: lista de e-mails ou Google Group com **12+ pessoas** (amigos, família, clientes).
3. Enviar o `.aab` (Codemagic) › revisar e lançar a faixa.
4. Compartilhe o link de inscrição; cada pessoa precisa **aceitar o convite e instalar**. Manter por **14 dias** seguidos.
5. Painel › **Solicitar acesso à produção** (perguntas sobre o teste: quantos testadores, feedback recebido, mudanças feitas).

## Lançamento em produção
Produção › Criar versão › escolher o `.aab` › notas da versão (FR/PT/EN) › Países (França, Bélgica, Suíça, Canadá, Brasil, Portugal…) ›
Revisar › Iniciar lançamento (pode começar em 20 % e ir para 100 %).

Notas da versão 1.0:
- FR `Première version : scanner de repas, plans de repas et d’entraînement, espace Ménopause 40+, sommeil et coach.`
- PT `Primeira versão: scanner de refeições, planos de dieta e treino, espaço Menopausa 40+, sono e coach.`
- EN `First release: meal scanner, meal and workout plans, Menopause 40+ space, sleep and coach.`
