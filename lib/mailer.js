import nodemailer from 'nodemailer';

/**
 * SMTP creds — supports either GMAIL_USER/GMAIL_APP_PASSWORD or
 * SMTP_USER/SMTP_PASS. MAIL_FROM is the friendly From header; we always
 * authenticate using the SMTP user. ADMIN_NOTIFY_EMAIL is the platform
 * inbox copied on approval-flow notifications (organizer register etc.).
 */
const SMTP_USER = process.env.GMAIL_USER || process.env.SMTP_USER || '';
const SMTP_PASS =
  process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '';
const MAIL_FROM =
  process.env.MAIL_FROM ||
  (SMTP_USER ? `TryLinqr <${SMTP_USER}>` : 'TryLinqr <connect@trylinqr.com>');
export const ADMIN_NOTIFY_EMAIL =
  process.env.ADMIN_NOTIFY_EMAIL || 'connect@trylinqr.com';

export function mailerConfigured() {
  return Boolean(SMTP_USER && SMTP_PASS);
}

let transporter = null;
function getTransporter() {
  if (!mailerConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

function shell(title, body) {
  return `
  <div style="background:#0f0f14;padding:32px 0;font-family:Inter,Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#1c1c26;border-radius:16px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#710014,#5a000f);padding:24px 32px">
        <h1 style="margin:0;color:#fff;font-size:22px">TryLinqr</h1>
      </div>
      <div style="padding:32px;color:#e5e5ea;font-size:15px;line-height:1.6">
        <h2 style="color:#fff;margin-top:0">${title}</h2>
        ${body}
      </div>
      <div style="padding:20px 32px;color:#6b6b7b;font-size:12px;border-top:1px solid #2a2a36">
        You received this email from TryLinqr. Discover & book events of every kind.
      </div>
    </div>
  </div>`;
}

export async function sendMail({ to, subject, html, cc, bcc, replyTo }) {
  const t = getTransporter();
  if (!t) {
    console.log(`[mailer] (not configured) would send "${subject}" to ${to}`);
    return { skipped: true };
  }
  return t.sendMail({
    from: MAIL_FROM,
    to,
    cc,
    bcc,
    replyTo: replyTo || ADMIN_NOTIFY_EMAIL,
    subject,
    html,
  });
}

/**
 * Copy the platform inbox on approval-flow / notification events.
 * Use this in places where a human at TryLinqr should also be informed
 * (organizer registers, organizer is approved, ticket is forwarded, etc.).
 */
export async function notifyAdmin({ subject, html }) {
  return sendMail({ to: ADMIN_NOTIFY_EMAIL, subject, html });
}

export const emails = {
  welcome: (name, verifyUrl) => ({
    subject: 'Welcome to TryLinqr — verify your email',
    html: shell(
      `Welcome, ${name}!`,
      `<p>Thanks for joining TryLinqr. Please verify your email to activate your account.</p>
       <p><a href="${verifyUrl}" style="display:inline-block;background:#710014;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Verify Email</a></p>
       <p style="color:#6b6b7b;font-size:13px">Or paste this link: ${verifyUrl}</p>`
    ),
  }),
  emailVerified: (name) => ({
    subject: 'Your TryLinqr account is active',
    html: shell(
      `You're all set, ${name}!`,
      `<p>Your email is verified and your account is active. Start discovering events now.</p>`
    ),
  }),
  adminPending: (name) => ({
    subject: 'TryLinqr organizer account — pending approval',
    html: shell(
      `Thanks for registering, ${name}`,
      `<p>Your organizer account is under review. Our team will approve it shortly, and you'll get an email once you're live.</p>`
    ),
  }),
  adminApproved: (name) => ({
    subject: "You're live on TryLinqr!",
    html: shell(
      `Congratulations, ${name}!`,
      `<p>Your organizer account has been approved. You can now create and publish events.</p>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:#710014;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Go to Dashboard</a></p>`
    ),
  }),
  adminRejected: (name, reason) => ({
    subject: 'TryLinqr organizer application update',
    html: shell(
      `Hello ${name}`,
      `<p>Unfortunately your organizer application was not approved at this time.</p>
       ${reason ? `<p><b>Reason:</b> ${reason}</p>` : ''}`
    ),
  }),
  bookingConfirmed: (booking, event, qrDataUrl) => ({
    subject: `Booking confirmed — ${event.title}`,
    html: shell(
      'Your booking is confirmed!',
      `<p><b>${event.title}</b></p>
       <p>${event.venue?.name || ''}, ${event.venue?.city || ''}</p>
       <p>Booking code: <b>${booking.bookingCode}</b><br/>
          Tier: ${booking.ticketTier?.name} × ${booking.quantity}<br/>
          Total paid: ₹${booking.totalAmount}</p>
       <p>Show this QR at the venue entrance:</p>
       <img src="${qrDataUrl}" alt="QR" width="200" style="background:#fff;border-radius:12px;padding:8px"/>`
    ),
  }),
  bookingCancelled: (booking, event) => ({
    subject: `Booking cancelled — ${event.title}`,
    html: shell(
      'Your booking was cancelled',
      `<p>Your booking <b>${booking.bookingCode}</b> for <b>${event.title}</b> has been cancelled.</p>
       ${booking.paymentStatus === 'refunded' ? '<p>A refund of ₹' + booking.totalAmount + ' has been initiated.</p>' : ''}`
    ),
  }),
  eventCancelled: (event) => ({
    subject: `Event cancelled — ${event.title}`,
    html: shell(
      'An event you booked was cancelled',
      `<p>We're sorry — <b>${event.title}</b> has been cancelled by the organizer. Any payments will be refunded.</p>`
    ),
  }),
  supportTicketReceived: (ticket) => ({
    subject: `Support ticket received · ${ticket.ticketCode}`,
    html: shell(
      `We received your ticket`,
      `<p>Thanks for reaching out. Our team will respond shortly.</p>
       <p><b>Ticket:</b> ${ticket.ticketCode}<br/>
          <b>Subject:</b> ${ticket.subject}<br/>
          <b>Category:</b> ${ticket.category}</p>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticket._id}" style="display:inline-block;background:#710014;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">View ticket</a></p>`
    ),
  }),
  supportNewForHandler: (ticket, customerName) => ({
    subject: `New support ticket · ${ticket.ticketCode}`,
    html: shell(
      `New support ticket`,
      `<p><b>${customerName}</b> has raised a new ticket.</p>
       <p><b>Ticket:</b> ${ticket.ticketCode}<br/>
          <b>Subject:</b> ${ticket.subject}<br/>
          <b>Category:</b> ${ticket.category}</p>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticket._id}" style="display:inline-block;background:#710014;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Open ticket</a></p>`
    ),
  }),
  supportReply: (ticket, replyFromRole) => ({
    subject: `New reply on ${ticket.ticketCode} — ${ticket.subject}`,
    html: shell(
      `New reply on your ticket`,
      `<p>${replyFromRole === 'customer' ? 'The customer' : 'The TryLinqr team'} replied on ticket <b>${ticket.ticketCode}</b>.</p>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticket._id}" style="display:inline-block;background:#710014;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">View thread</a></p>`
    ),
  }),
  supportForwarded: (ticket, organizerName, reason) => ({
    subject: `Ticket forwarded to you · ${ticket.ticketCode}`,
    html: shell(
      `Hi ${organizerName}, a ticket has been forwarded to you`,
      `<p>The TryLinqr team has routed this ticket to you because it's related to your event/booking.</p>
       <p><b>Ticket:</b> ${ticket.ticketCode}<br/>
          <b>Subject:</b> ${ticket.subject}</p>
       ${reason ? `<p><b>Note from team:</b> ${reason}</p>` : ''}
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticket._id}" style="display:inline-block;background:#710014;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Open ticket</a></p>`
    ),
  }),
  supportResolved: (ticket) => ({
    subject: `Ticket resolved · ${ticket.ticketCode}`,
    html: shell(
      `Your ticket has been resolved`,
      `<p>Ticket <b>${ticket.ticketCode}</b> — <i>${ticket.subject}</i> has been marked as resolved.</p>
       <p>If your issue isn't fully fixed, you can reopen the ticket from your support page.</p>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticket._id}" style="display:inline-block;background:#710014;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">View ticket</a></p>`
    ),
  }),
};
