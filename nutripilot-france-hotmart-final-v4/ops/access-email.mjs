// Email language follows the account screen, independently of store currency.
const copy = {
  fr: ['Votre code d’accès', 'Votre code d’accès est :', 'Ce code expire dans 15 minutes.', 'Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail.'],
  pt: ['Seu código de acesso', 'Seu código de acesso é:', 'Este código expira em 15 minutos.', 'Se você não solicitou este código, ignore este e-mail.'],
  en: ['Your access code', 'Your access code is:', 'This code expires in 15 minutes.', 'If you did not request this code, ignore this email.'],
  es: ['Tu código de acceso', 'Tu código de acceso es:', 'Este código caduca en 15 minutos.', 'Si no solicitaste este código, ignora este correo.'],
  de: ['Dein Zugangscode', 'Dein Zugangscode lautet:', 'Dieser Code ist 15 Minuten gültig.', 'Wenn du diesen Code nicht angefordert hast, ignoriere diese E-Mail.'],
  it: ['Il tuo codice di accesso', 'Il tuo codice di accesso è:', 'Questo codice scade tra 15 minuti.', 'Se non hai richiesto questo codice, ignora questa email.'],
  nl: ['Je toegangscode', 'Je toegangscode is:', 'Deze code verloopt over 15 minuten.', 'Negeer deze e-mail als je deze code niet hebt aangevraagd.'],
  pl: ['Twój kod dostępu', 'Twój kod dostępu to:', 'Ten kod wygasa za 15 minut.', 'Jeśli nie prosisz o ten kod, zignoruj tę wiadomość.'],
  tr: ['Erişim kodunuz', 'Erişim kodunuz:', 'Bu kodun süresi 15 dakika sonra dolar.', 'Bu kodu siz istemediyseniz bu e-postayı dikkate almayın.'],
  ja: ['アクセスコード', 'アクセスコード：', 'このコードの有効期限は15分です。', 'このコードをリクエストしていない場合は、このメールを無視してください。'],
  ko: ['접속 코드', '접속 코드:', '이 코드는 15분 후에 만료됩니다.', '이 코드를 요청하지 않았다면 이 이메일을 무시하세요.'],
  zh: ['您的访问验证码', '您的访问验证码是：', '此验证码将在15分钟后过期。', '如果您未请求此验证码，请忽略此邮件。'],
  ar: ['رمز الدخول الخاص بك', 'رمز الدخول الخاص بك هو:', 'تنتهي صلاحية هذا الرمز خلال 15 دقيقة.', 'إذا لم تطلب هذا الرمز، فتجاهل هذه الرسالة.'],
  id: ['Kode akses Anda', 'Kode akses Anda:', 'Kode ini kedaluwarsa dalam 15 menit.', 'Jika Anda tidak meminta kode ini, abaikan email ini.'],
};
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

export function accessEmailContent(code, requestedLanguage = 'fr', brandName = 'NutriPilot') {
  if (!/^\d{6}$/.test(String(code))) throw new Error('Invalid access code');
  const candidate = typeof requestedLanguage === 'string' ? requestedLanguage.toLowerCase().split(/[-_]/)[0] : '';
  const language = Object.hasOwn(copy, candidate) ? candidate : 'fr';
  const [subject, intro, expiry, ignore] = copy[language];
  const brand = String(brandName).replace(/[\r\n]/g, ' ').slice(0, 120);
  return {
    subject: `${subject} ${brand}`,
    text: `${brand}\n\n${intro}\n${code}\n\n${expiry}\n${ignore}`,
    html: `<div lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}" style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h2>${escapeHtml(brand)}</h2><p>${escapeHtml(intro)}</p><p dir="ltr" style="font-size:30px;font-weight:800;letter-spacing:5px">${code}</p><p>${escapeHtml(expiry)}</p><p style="color:#6b756e">${escapeHtml(ignore)}</p></div>`,
  };
}
