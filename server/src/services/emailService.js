import nodemailer from 'nodemailer';
import { config } from '../config/env.js';

// Helper transporter generator
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// 1. Single recipient email sender (Password reset tokens, user alerts, etc.)
export const sendEmail = async ({ to, subject, body, html }) => {
  if (!to) return { success: false, reason: 'No recipient email specified' };

  const transporter = createTransporter();

  const mailOptions = {
    from: `"EduBatch Portal" <${config.smtp.user || 'no-reply@edubatch.com'}>`,
    to,
    subject: subject || 'EduBatch Notification',
    text: body,
    html: html || `<div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">${body}</div>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP Email Service]: Email sent to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[SMTP Email Service Error]: Failed sending email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

// 2. Broadcast email sender (System announcements to multiple students/teachers)
export const sendBroadcastEmail = async ({ toEmails, title, body, batchName, createdByName }) => {
  if (!toEmails || toEmails.length === 0) {
    return { success: false, recipientCount: 0, reason: 'No target recipient emails found' };
  }

  const transporter = createTransporter();

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #38bdf8; margin: 0; font-size: 24px; font-weight: 800; tracking-tight: -0.5px;">EduBatch System Broadcast</h1>
        <p style="color: #94a3b8; margin-top: 6px; font-size: 13px;">${batchName ? `Target Batch: ${batchName}` : 'Global Announcement across All Batches'}</p>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">${title}</h2>
        <div style="color: #334155; font-size: 14px; line-height: 1.65; white-space: pre-wrap; background-color: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #38bdf8; margin: 20px 0;">
${body}
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Published by: <strong>${createdByName || 'Administrator'}</strong></p>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; color: #94a3b8; font-size: 11px;">
        &copy; ${new Date().getFullYear()} EduBatch Learning Portal. All rights reserved.
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"EduBatch Broadcast" <${config.smtp.user || 'no-reply@edubatch.com'}>`,
      bcc: toEmails,
      subject: `[EduBatch Broadcast] ${title}`,
      html: htmlBody,
    });

    console.log(`[SMTP Email Service]: Broadcast email sent to ${toEmails.length} recipient(s). Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId, recipientCount: toEmails.length };
  } catch (error) {
    console.error('[SMTP Email Service Error]: Could not send broadcast mail:', error.message);
    return { success: false, recipientCount: toEmails.length, error: error.message };
  }
};
