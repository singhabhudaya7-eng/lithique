interface InquiryEmailData {
  clientName: string
  clientEmail: string
  clientPhone?: string | null
  message: string
  relicName: string
  relicSlug: string
  isWaitlist: boolean
}

export async function sendInquiryNotification(data: InquiryEmailData) {
  if (!process.env.RESEND_API_KEY) return

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://lithique.in'

  const subject = data.isWaitlist
    ? `[Waitlist] ${data.clientName} — ${data.relicName}`
    : `[Inquiry] ${data.clientName} — ${data.relicName}`

  await resend.emails.send({
    from: 'LITHIQUE Archive <noreply@lithique.in>',
    to: process.env.ADMIN_EMAIL ?? 'tech@foruselectric.com',
    subject,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; color: #0A0A0A;">
        <h2 style="font-size: 1.5rem; margin-bottom: 8px;">${data.relicName}</h2>
        <p style="color: #888; font-size: 0.85rem; margin-bottom: 24px;">
          ${data.isWaitlist ? 'Waitlist registration' : 'Acquisition inquiry'} received
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Name</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.clientName}</td></tr>
          <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.clientEmail}</td></tr>
          ${data.clientPhone ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.clientPhone}</td></tr>` : ''}
        </table>
        ${!data.isWaitlist ? `<div style="background: #f9f9f9; padding: 16px; margin-bottom: 24px; font-style: italic;">${data.message}</div>` : ''}
        <a href="${appUrl}/admin/inquiries" style="display: inline-block; padding: 10px 24px; background: #C9A84C; color: #0A0A0A; text-decoration: none; font-family: sans-serif; font-size: 12px; letter-spacing: 0.1em;">
          VIEW IN ADMIN
        </a>
      </div>
    `,
  })
}
