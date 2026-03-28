interface SendEmailParams {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail(
  params: SendEmailParams,
  resendApiKey: string
): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: params.from ?? 'Rehabroad <noreply@rehabroad.com.br>',
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

// Templates de email
export const emailTemplates = {

  // 1. Lembrete diário de exercícios para o paciente
  hepReminder: (params: {
    patientName: string
    planTitle: string
    exercises: { name: string; sets?: number; reps?: string; frequency?: string }[]
    checkinUrl: string
  }) => ({
    subject: `🏃 Seus exercícios de hoje — ${params.planTitle}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#10b981,#059669);padding:32px 24px;text-align:center;">
      <div style="font-size:40px;margin-bottom:8px;">🏃</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">
        Hora dos seus exercícios!
      </h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">
        ${params.planTitle}
      </p>
    </div>

    <!-- Corpo -->
    <div style="padding:24px;">
      <p style="color:#374151;font-size:15px;margin:0 0 20px;">
        Olá, <strong>${params.patientName}</strong>! 👋<br>
        Seu fisioterapeuta preparou estes exercícios para você fazer hoje:
      </p>

      <!-- Lista de exercícios -->
      ${params.exercises.map((ex, i) => `
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 16px;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="background:#10b981;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;flex-shrink:0;">${i + 1}</div>
          <div>
            <p style="margin:0;font-weight:600;color:#065f46;font-size:14px;">${ex.name}</p>
            ${ex.sets ? `<p style="margin:4px 0 0;color:#047857;font-size:12px;">${ex.sets} séries × ${ex.reps ?? ''} · ${ex.frequency ?? ''}</p>` : ''}
          </div>
        </div>
      </div>
      `).join('')}

      <!-- CTA -->
      <div style="text-align:center;margin:24px 0;">
        <a href="${params.checkinUrl}"
           style="background:#10b981;color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;display:inline-block;">
          ✅ Registrar que fiz os exercícios
        </a>
      </div>

      <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
        Seu progresso é acompanhado pelo seu fisioterapeuta em tempo real.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">
        Rehabroad · Plataforma de Apoio Clínico<br>
        <a href="${params.checkinUrl}" style="color:#10b981;">Acessar plano de exercícios</a>
      </p>
    </div>
  </div>
</body>
</html>`
  }),

  // 2. Confirmação ao paciente após check-in
  hepCheckinConfirmation: (params: {
    patientName: string
    completedCount: number
    totalCount: number
    checkinUrl: string
  }) => ({
    subject: `✅ Check-in registrado — Rehabroad`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,0.08);">

    <div style="background:linear-gradient(135deg,#10b981,#059669);padding:32px 24px;text-align:center;">
      <div style="font-size:48px;margin-bottom:8px;">🎉</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Check-in registrado!</h1>
    </div>

    <div style="padding:24px;text-align:center;">
      <p style="color:#374151;font-size:15px;">
        Parabéns, <strong>${params.patientName}</strong>!<br>
        Você registrou <strong>${params.completedCount} de ${params.totalCount}</strong> exercícios hoje.
      </p>

      <!-- Barra de progresso -->
      <div style="background:#f3f4f6;border-radius:99px;height:12px;margin:16px 0;overflow:hidden;">
        <div style="background:#10b981;height:100%;width:${Math.round((params.completedCount/params.totalCount)*100)}%;border-radius:99px;"></div>
      </div>
      <p style="color:#6b7280;font-size:13px;">${Math.round((params.completedCount/params.totalCount)*100)}% concluído</p>

      <p style="color:#374151;font-size:14px;margin:20px 0;">
        Seu fisioterapeuta foi notificado. Continue assim! 💪
      </p>

      <a href="${params.checkinUrl}"
         style="background:#10b981;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px;display:inline-block;">
        Ver meu plano completo
      </a>
    </div>

    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">Rehabroad · Plataforma de Apoio Clínico</p>
    </div>
  </div>
</body>
</html>`
  }),

  // 3. Notificação ao fisio quando paciente faz check-in
  hepCheckinNotification: (params: {
    physioName: string
    patientName: string
    completedCount: number
    totalCount: number
    adherenceRate: number
    painLevel?: number
    dashboardUrl: string
  }) => ({
    subject: `📋 ${params.patientName} fez check-in no plano domiciliar`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,0.08);">

    <div style="background:#1e293b;padding:24px;display:flex;align-items:center;gap:12px;">
      <div style="font-size:28px;">📋</div>
      <div>
        <h1 style="color:#fff;margin:0;font-size:18px;font-weight:700;">Check-in registrado</h1>
        <p style="color:#94a3b8;margin:4px 0 0;font-size:13px;">Rehabroad · Plano Domiciliar</p>
      </div>
    </div>

    <div style="padding:24px;">
      <p style="color:#374151;font-size:15px;margin:0 0 20px;">
        Olá, <strong>${params.physioName}</strong>!<br>
        Seu paciente <strong>${params.patientName}</strong> acabou de registrar o check-in.
      </p>

      <!-- Métricas -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px;">
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px;text-align:center;">
          <p style="margin:0;font-size:20px;font-weight:700;color:#065f46;">${params.completedCount}/${params.totalCount}</p>
          <p style="margin:4px 0 0;font-size:11px;color:#047857;">Exercícios</p>
        </div>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px;text-align:center;">
          <p style="margin:0;font-size:20px;font-weight:700;color:#065f46;">${params.adherenceRate}%</p>
          <p style="margin:4px 0 0;font-size:11px;color:#047857;">Adesão</p>
        </div>
        <div style="background:${params.painLevel !== undefined && params.painLevel >= 7 ? '#fef2f2' : '#f0fdf4'};border:1px solid ${params.painLevel !== undefined && params.painLevel >= 7 ? '#fecaca' : '#bbf7d0'};border-radius:10px;padding:12px;text-align:center;">
          <p style="margin:0;font-size:20px;font-weight:700;color:${params.painLevel !== undefined && params.painLevel >= 7 ? '#991b1b' : '#065f46'};">
            ${params.painLevel !== undefined ? `${params.painLevel}/10` : 'N/A'}
          </p>
          <p style="margin:4px 0 0;font-size:11px;color:#047857;">Dor</p>
        </div>
      </div>

      <div style="text-align:center;">
        <a href="${params.dashboardUrl}"
           style="background:#1e293b;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px;display:inline-block;">
          Ver prontuário completo →
        </a>
      </div>
    </div>

    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">Rehabroad · Plataforma de Apoio Clínico</p>
    </div>
  </div>
</body>
</html>`
  }),

  // 4. Alerta de baixa adesão ao fisio
  hepLowAdherenceAlert: (params: {
    physioName: string
    patientName: string
    adherenceRate: number
    daysChecked: number
    dashboardUrl: string
  }) => ({
    subject: `⚠️ ${params.patientName} — baixa adesão ao plano domiciliar`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,0.08);">

    <div style="background:#dc2626;padding:24px;text-align:center;">
      <div style="font-size:36px;margin-bottom:8px;">⚠️</div>
      <h1 style="color:#fff;margin:0;font-size:20px;font-weight:700;">Alerta de baixa adesão</h1>
    </div>

    <div style="padding:24px;">
      <p style="color:#374151;font-size:15px;">
        <strong>${params.physioName}</strong>, seu paciente <strong>${params.patientName}</strong>
        está com baixa adesão ao plano domiciliar.
      </p>

      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px;margin:20px 0;text-align:center;">
        <p style="margin:0;font-size:36px;font-weight:700;color:#991b1b;">${params.adherenceRate}%</p>
        <p style="margin:4px 0 0;color:#dc2626;font-size:13px;">de adesão nos últimos ${params.daysChecked} dias</p>
      </div>

      <p style="color:#6b7280;font-size:14px;">
        Baixa adesão ao plano domiciliar é um fator de risco para recidiva.
        Considere revisar a complexidade dos exercícios ou reforçar a importância na próxima sessão.
      </p>

      <div style="text-align:center;margin-top:20px;">
        <a href="${params.dashboardUrl}"
           style="background:#dc2626;color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px;display:inline-block;">
          Ver plano domiciliar →
        </a>
      </div>
    </div>

    <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #f3f4f6;">
      <p style="color:#9ca3af;font-size:11px;margin:0;">Rehabroad · Plataforma de Apoio Clínico</p>
    </div>
  </div>
</body>
</html>`
  }),
}
