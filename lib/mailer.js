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
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://trylinqr.com';
  // Logo is served from /public/trylinqr.png — absolute URL so it loads in
  // every mail client (Gmail strips relative URLs).
  const LOGO_URL = `${APP_URL.replace(/\/$/, '')}/trylinqr.png`;
  return `
  <div style="background:#f7f6f3;padding:40px 16px;font-family:'Segoe UI',Inter,Helvetica,Arial,sans-serif;color:#2a2236">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"
           width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;
           border-radius:16px;overflow:hidden;border:1px solid rgba(42,34,54,0.08);
           box-shadow:0 4px 24px rgba(42,34,54,0.05)">
      <tr>
        <td style="padding:28px 32px;border-bottom:1px solid rgba(42,34,54,0.08);
                   background:#ffffff;text-align:left">
          <a href="${APP_URL}" style="text-decoration:none">
            <img src="${LOGO_URL}" alt="TryLinqr"
                 width="140" height="40"
                 style="display:block;height:40px;width:auto;border:0;outline:none" />
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;color:#2a2236;font-size:15px;line-height:1.65">
          <h2 style="margin:0 0 16px;color:#2a2236;font-size:22px;font-weight:700;
                     letter-spacing:-0.01em">
            ${title}
          </h2>
          <div style="color:#4a4258">${body}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 32px;background:#fbf7f2;color:#6b6478;font-size:12px;
                   line-height:1.55;border-top:1px solid rgba(42,34,54,0.06)">
          <p style="margin:0 0 6px;color:#2a2236;font-weight:600">TryLinqr</p>
          <p style="margin:0 0 10px">
            Discover &amp; book events of every kind — concerts, workshops,
            festivals, sports, food and beyond.
          </p>
          <p style="margin:0">
            Need help? Reply to this email or write to
            <a href="mailto:connect@trylinqr.com" style="color:#944268;text-decoration:none">
              connect@trylinqr.com
            </a>.
          </p>
        </td>
      </tr>
    </table>
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
       <p><a href="${verifyUrl}" style="display:inline-block;background:#944268;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Verify Email</a></p>
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
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:#944268;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Go to Dashboard</a></p>`
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
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticket._id}" style="display:inline-block;background:#944268;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">View ticket</a></p>`
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
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticket._id}" style="display:inline-block;background:#944268;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Open ticket</a></p>`
    ),
  }),
  supportReply: (ticket, replyFromRole) => ({
    subject: `New reply on ${ticket.ticketCode} — ${ticket.subject}`,
    html: shell(
      `New reply on your ticket`,
      `<p>${replyFromRole === 'customer' ? 'The customer' : 'The TryLinqr team'} replied on ticket <b>${ticket.ticketCode}</b>.</p>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticket._id}" style="display:inline-block;background:#944268;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">View thread</a></p>`
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
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticket._id}" style="display:inline-block;background:#944268;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Open ticket</a></p>`
    ),
  }),
  supportResolved: (ticket) => ({
    subject: `Ticket resolved · ${ticket.ticketCode}`,
    html: shell(
      `Your ticket has been resolved`,
      `<p>Ticket <b>${ticket.ticketCode}</b> — <i>${ticket.subject}</i> has been marked as resolved.</p>
       <p>If your issue isn't fully fixed, you can reopen the ticket from your support page.</p>
       <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/support/${ticket._id}" style="display:inline-block;background:#944268;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">View ticket</a></p>`
    ),
  }),
};
