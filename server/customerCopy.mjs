import nodemailer from 'nodemailer';
import { business } from '../src/content/business.js';
import { TEAM_REPLY_TO } from './requestEmail.mjs';

const COPY_TIMEOUT_MS = 8000;

/** Returns null until both server-only Gmail settings exist, so booking still works without them. */
export function createGmailCopySender(env = process.env) {
  const user = env.GMAIL_USER?.trim();
  const password = env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
  if (!user || !password) return null;
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass: password },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 7000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  return ({ to, subject, text, html }) =>
    transport.sendMail({
      from: { name: business.name, address: user },
      replyTo: TEAM_REPLY_TO,
      to: { name: '', address: to },
      subject,
      text,
      html,
    });
}

export function withCopyTimeout(sending) {
  let timer;
  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(
      () => reject(new Error('Customer copy timed out')),
      COPY_TIMEOUT_MS,
    );
  });
  return Promise.race([sending, timeout]).finally(() => clearTimeout(timer));
}
