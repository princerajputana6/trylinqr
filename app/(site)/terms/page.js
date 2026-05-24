import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Terms of Service · TryLinqr' };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      intro="By using TryLinqr you agree to the terms below. Please read them carefully — they explain how we operate and what you can expect from us."
      lastUpdated="May 2026"
    >
      <h2>1. Who we are</h2>
      <p>
        TryLinqr (&ldquo;TryLinqr,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;)
        operates the website at trylinqr.com and related services that allow
        organizers to publish events and attendees to discover and book them.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must be at least 18 years old to create an organizer account. You
        are responsible for the activity on your account and for keeping your
        credentials secure. We may suspend accounts that violate these terms
        or applicable law.
      </p>

      <h2>3. Bookings &amp; tickets</h2>
      <p>
        When you book an event you enter a contract directly with the
        organizer. TryLinqr facilitates the booking, payment and ticket
        delivery but is not the operator of the event. Tickets are personal
        and may not be resold without the organizer&apos;s consent.
      </p>

      <h2>4. Payments &amp; fees</h2>
      <p>
        Payments are processed by Razorpay and other regulated payment
        partners. TryLinqr may charge a platform fee disclosed at checkout.
        Organizers receive payouts net of platform and payment-processor
        fees, on the schedule described in their organizer agreement.
      </p>

      <h2>5. Cancellations &amp; refunds</h2>
      <p>
        Each organizer sets their own cancellation policy, shown on the event
        page. Refunds for events cancelled by the organizer or by force
        majeure are processed automatically. See our{' '}
        <a href="/refund-policy">refund policy</a> for the full process.
      </p>

      <h2>6. Acceptable use</h2>
      <ul>
        <li>No illegal events, hateful content, or fraudulent listings.</li>
        <li>No scraping, reverse-engineering, or abuse of our APIs.</li>
        <li>
          No attempts to circumvent ticket allocation, queueing, or pricing
          mechanisms.
        </li>
      </ul>

      <h2>7. Intellectual property</h2>
      <p>
        Our software, brand assets and design are owned by TryLinqr.
        Organizer content remains owned by the organizer; by uploading it you
        grant us a worldwide licence to display and promote that content on
        TryLinqr.
      </p>

      <h2>8. Disclaimers &amp; liability</h2>
      <p>
        TryLinqr is provided on an &ldquo;as is&rdquo; basis. To the extent
        permitted by law, our liability is limited to the amount you paid for
        the relevant booking in the 30 days prior to the claim.
      </p>

      <h2>9. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Material changes will be
        notified in-app or by email. Continuing to use TryLinqr after a
        change means you accept the new terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms? Email{' '}
        <a href="mailto:legal@trylinqr.com">legal@trylinqr.com</a>.
      </p>
    </LegalPage>
  );
}
