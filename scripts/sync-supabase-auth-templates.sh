#!/usr/bin/env bash
# Sync Supabase Auth email templates with TaskFlow Pro branding.
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
if [[ -f "$ROOT_DIR/.env.local" ]]; then set -a; source "$ROOT_DIR/.env.local"; set +a; fi
: "${SUPABASE_ACCESS_TOKEN:?SUPABASE_ACCESS_TOKEN required}"

PROJECT_REF="${PROJECT_REF:-lcubcugivegahjsbmepy}"

btn='<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;"><tr><td bgcolor="#14b8a6" style="background-color:#14b8a6;border-radius:8px;"><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:700;color:#09090b;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">%s</a></td></tr></table>'

wrap() {
  local title="$1" body="$2"
  cat <<EOF
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#09090b;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#18181b;border:1px solid #27272a;border-radius:12px;"><tr><td style="padding:28px 32px 12px;text-align:center;"><span style="font-size:20px;font-weight:700;color:#fafafa;">TaskFlow Pro</span></td></tr><tr><td style="padding:8px 32px 24px;color:#e4e4e7;font-size:16px;line-height:26px;"><p style="margin:0 0 16px;color:#fafafa;font-size:22px;line-height:30px;">${title}</p>${body}</td></tr></table></td></tr></table>
EOF
}

CONFIRM_BODY="<p style=\"margin:0 0 12px;\">Grazie per esserti registrato su TaskFlow Pro.</p>$(printf "$btn" "Conferma email")<p style=\"margin:0;color:#a1a1aa;font-size:13px;\">Se non hai creato un account, ignora questa email.</p>"
RECOVERY_BODY="<p style=\"margin:0 0 12px;\">Abbiamo ricevuto una richiesta per reimpostare la password.</p>$(printf "$btn" "Reimposta password")<p style=\"margin:0;color:#a1a1aa;font-size:13px;\">Se non l'hai richiesto tu, ignora questa email.</p>"
MAGIC_BODY="<p style=\"margin:0 0 12px;\">Clicca per accedere al tuo account. Il link scade a breve.</p>$(printf "$btn" "Accedi ora")"
OTP_BODY='<p style="margin:0 0 12px;">Usa questo codice per completare la verifica:</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#27272a" style="background-color:#27272a;border-radius:10px;padding:18px;"><span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#2dd4bf;font-family:Courier New,monospace;">{{ .Token }}</span></td></tr></table>'
CHANGE_BODY="<p style=\"margin:0 0 12px;\">Conferma <strong style=\"color:#fafafa;\">{{ .NewEmail }}</strong> come nuovo indirizzo.</p>$(printf "$btn" "Conferma nuova email")"
INVITE_BODY="<p style=\"margin:0 0 12px;\">Sei stato invitato su TaskFlow Pro.</p>$(printf "$btn" "Accetta invito")"

jq -n \
  --arg confirm "$(wrap "Conferma la tua email" "$CONFIRM_BODY")" \
  --arg recovery "$(wrap "Reimposta la password" "$RECOVERY_BODY")" \
  --arg magic "$(wrap "Accedi al tuo account" "$MAGIC_BODY")" \
  --arg otp "$(wrap "Codice di verifica" "$OTP_BODY")" \
  --arg change "$(wrap "Conferma nuova email" "$CHANGE_BODY")" \
  --arg invite "$(wrap "Invito al workspace" "$INVITE_BODY")" \
  '{
    mailer_subjects_confirmation: "Conferma il tuo account TaskFlow Pro",
    mailer_subjects_recovery: "Reimposta la password TaskFlow Pro",
    mailer_subjects_magic_link: "Accedi a TaskFlow Pro",
    mailer_subjects_reauthentication: "Il tuo codice TaskFlow Pro",
    mailer_subjects_email_change: "Conferma il nuovo indirizzo email",
    mailer_subjects_invite: "Invito su TaskFlow Pro",
    mailer_templates_confirmation_content: $confirm,
    mailer_templates_recovery_content: $recovery,
    mailer_templates_magic_link_content: $magic,
    mailer_templates_reauthentication_content: $otp,
    mailer_templates_email_change_content: $change,
    mailer_templates_invite_content: $invite
  }' > /tmp/supabase-auth-templates.json

curl -sS -X PATCH "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/supabase-auth-templates.json | jq '{confirmation: .mailer_subjects_confirmation, recovery: .mailer_subjects_recovery}'

rm -f /tmp/supabase-auth-templates.json
echo "Supabase auth templates updated."
