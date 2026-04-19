import { transporter } from "../config/nodemailer";

const FROM_EMAIL = "HiveUp <service@hiveup.com>";

type EmailParams = {
  to: string;
  name: string;
  token: string;
};

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>HiveUp</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <span style="font-size:28px;font-weight:800;color:#f8fafc;letter-spacing:-0.5px;">
                Hive<span style="color:#f59e0b;">Up</span>
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#1e293b;border-radius:12px;padding:40px 44px;border:1px solid #334155;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-size:12px;color:#64748b;">
                © ${new Date().getFullYear()} HiveUp · Este correo fue generado automáticamente, por favor no responder.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function tokenBox(token: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td align="center" style="background-color:#0f172a;border:1px solid #334155;border-radius:10px;padding:24px;">
          <span style="font-size:38px;font-weight:800;letter-spacing:10px;color:#f59e0b;">
            ${token}
          </span>
        </td>
      </tr>
    </table>`;
}

export async function sendConfirmationEmail(params: EmailParams) {
  await transporter.sendMail({
    from: `${FROM_EMAIL}`,
    to: params.to,
    subject: "HiveUp · Confirma tu cuenta",
    html: baseLayout(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f8fafc;">Confirma tu cuenta</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.6;">
        Hola <strong style="color:#f1f5f9;">${params.name}</strong>, gracias por registrarte en HiveUp.
        Usa el código de verificación a continuación para activar tu cuenta.
        Expira en <strong style="color:#f1f5f9;">10 minutos</strong>.
      </p>
      ${tokenBox(params.token)}
      <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
        Si no creaste esta cuenta, puedes ignorar este correo de forma segura.
      </p>
    `),
  });
}

export async function sendPasswordResetEmail(params: EmailParams) {
  await transporter.sendMail({
    from: `${FROM_EMAIL}`,
    to: params.to,
    subject: "HiveUp · Restablece tu contraseña",
    html: baseLayout(`
      <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#f8fafc;">Restablece tu contraseña</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#94a3b8;line-height:1.6;">
        Hola <strong style="color:#f1f5f9;">${params.name}</strong>, recibimos una solicitud para
        restablecer tu contraseña. Usa el código siguiente.
        Expira en <strong style="color:#f1f5f9;">10 minutos</strong>.
      </p>
      ${tokenBox(params.token)}
      <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6;">
        Si no solicitaste este cambio, ignora este correo. Tu contraseña no será modificada.
      </p>
    `),
  });
}
