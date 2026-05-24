import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Privacy Policy · TryLinqr' };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro="We collect what we need, never more, and we never sell your data. This page explains what we collect, why, and how to control it."
      lastUpdated="May 2026"
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account details:</strong> name, email, phone, and (for
          organizers) organization name and description.
        </li>
        <li>
          <strong>Bookings &amp; tickets:</strong> the events you book,
          quantity, price, and QR ticket data.
        </li>
        <li>
          <strong>Payment data:</strong> handled by our payment partner
          (Razorpay). We store transaction IDs and status — never card
          numbers.
        </li>
        <li>
          <strong>Usage data:</strong> standard server logs (IP, browser,
          pages visited) for security and analytics.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To fulfil your bookings and deliver tickets.</li>
        <li>To send transactional emails (verification, confirmations).</li>
        <li>To personalize your discovery feed.</li>
        <li>To prevent fraud and abuse.</li>
        <li>
          To send marketing emails — only with your explicit opt-in, with a
          one-tap unsubscribe in every message.
        </li>
      </ul>

      <h2>Who we share it with</h2>
      <ul>
        <li>
          <strong>Organizers</strong> see your name, email and booking
          details — necessary to honour your ticket.
        </li>
        <li>
          <strong>Payment processors</strong> (Razorpay) for transaction
          processing.
        </li>
        <li>
          <strong>Email infrastructure</strong> (Gmail SMTP) for transactional
          mail.
        </li>
        <li>
          <strong>Hosting &amp; storage</strong> partners (Vercel, MongoDB
          Atlas, Cloudinary).
        </li>
      </ul>
      <p>We do not sell your data to third parties for advertising. Ever.</p>

      <h2>How long we keep it</h2>
      <p>
        We retain account data while your account is active and for up to 24
        months after deletion to satisfy legal and accounting obligations.
        Anonymized analytics may be kept longer.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>Access and download a copy of your data.</li>
        <li>Correct any inaccurate information.</li>
        <li>Delete your account and personal data.</li>
        <li>
          Object to or restrict certain processing (e.g. marketing emails).
        </li>
      </ul>
      <p>
        Email{' '}
        <a href="mailto:privacy@trylinqr.com">privacy@trylinqr.com</a> to
        exercise any of these.
      </p>

      <h2>Security</h2>
      <p>
        TLS in transit, encryption at rest, hashed passwords (bcrypt),
        signed JWT sessions, and signed Razorpay webhooks. No system is
        bullet-proof — if you spot something, please email{' '}
        <a href="mailto:security@trylinqr.com">security@trylinqr.com</a>.
      </p>

      <h2>Children</h2>
      <p>
        TryLinqr is not intended for children under 13. Some events may have
        age restrictions set by the organizer and shown on the event page.
      </p>

      <h2>Updates</h2>
      <p>
        We&apos;ll notify you of material changes to this policy by email and
        in-app at least 14 days before they take effect.
      </p>
    </LegalPage>
  );
}
