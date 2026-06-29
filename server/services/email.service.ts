import nodemailer from 'nodemailer';

export async function sendCareerEmail(to: string, subject: string, body: string, attachments: Array<{ filename: string; content: string }> = []) {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD) {
    return { skipped: true, reason: 'SMTP credentials are not configured' };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_APP_PASSWORD
    }
  });

  return transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    text: body,
    attachments
  });
}
