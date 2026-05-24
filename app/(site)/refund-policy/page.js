import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Refund Policy · TryLinqr' };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Refund Policy"
      intro="Each event organizer sets the cancellation rules for their event. TryLinqr handles the refund mechanics on their behalf — here&apos;s exactly how it works."
      lastUpdated="May 2026"
    >
      <h2>Customer-initiated cancellations</h2>
      <p>
        Open your booking in <a href="/my-bookings">My Bookings</a> and tap
        Cancel. The refund amount follows the organizer&apos;s cancellation
        policy shown on the event page.
      </p>
      <ul>
        <li>
          Cancellations made within the &ldquo;full-refund window&rdquo;
          receive 100% back (minus a payment-processor fee where applicable).
        </li>
        <li>
          Cancellations made within the partial-refund window receive the
          percentage stated by the organizer (commonly 50%).
        </li>
        <li>
          Cancellations after the cut-off, or for already-attended events,
          are not eligible for a refund.
        </li>
      </ul>

      <h2>Organizer-initiated cancellations</h2>
      <p>
        If an organizer cancels an event, every paid booking is refunded in
        full automatically. You will receive an email confirmation, and the
        amount returns to your original payment method within 5–7 business
        days depending on your bank.
      </p>

      <h2>Force majeure</h2>
      <p>
        Events cancelled due to force majeure (weather, government order,
        venue failure) are treated the same as organizer-initiated
        cancellations — full refunds, automatically.
      </p>

      <h2>Free events</h2>
      <p>
        Free RSVPs can be cancelled any time. There is nothing to refund;
        we simply release your slot back to the waitlist.
      </p>

      <h2>Payment-processor fees</h2>
      <p>
        Razorpay charges a small per-transaction fee that is non-refundable
        on full refunds in certain card schemes. Where applicable this is
        shown at checkout and on your refund notification.
      </p>

      <h2>Refund timing</h2>
      <ul>
        <li>UPI / Wallets — usually within 24 hours.</li>
        <li>Net Banking / Debit cards — 3–5 business days.</li>
        <li>Credit cards — 5–7 business days.</li>
      </ul>

      <h2>Still waiting?</h2>
      <p>
        If a refund hasn&apos;t arrived 10 business days after we processed
        it, please open a{' '}
        <a href="/support/new">support ticket</a> with your booking ID and we
        will trace it with our payment partner.
      </p>
    </LegalPage>
  );
}
