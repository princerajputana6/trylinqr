import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'About TryLinqr' };

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="About us"
      title="Built for every kind of unforgettable evening."
      intro="TryLinqr is a multi-domain event booking platform that puts community-led experiences on the same stage as the biggest concerts. From sunrise breakfast rides to weekend festivals, every event finds its crowd here."
      lastUpdated="May 2026"
    >
      <h2>Our story</h2>
      <p>
        TryLinqr started with a simple frustration: the best events were
        impossible to find, and even harder to book. We built a single
        cinematic home for everything happening around you — concerts,
        jagrans, comedy nights, workshops, marathons, festivals and beyond —
        and gave organizers the tools they need to fill seats without the
        usual platform tax.
      </p>

      <h2>What makes us different</h2>
      <ul>
        <li>
          <strong>Domain-agnostic.</strong> Any organizer, any vertical, one
          unified booking flow.
        </li>
        <li>
          <strong>Premium by default.</strong> Beautiful event pages, polished
          checkout, and QR ticketing out of the box.
        </li>
        <li>
          <strong>Operator-first economics.</strong> 0% commission to start and
          instant payouts, so organizers keep more of what they earn.
        </li>
        <li>
          <strong>Cinematic discovery.</strong> A homepage that treats every
          event like a featured release — not a search result.
        </li>
      </ul>

      <h2>The team</h2>
      <p>
        We&apos;re a small product-led team of engineers, designers and
        event-runners obsessed with the experience between &ldquo;tap
        book&rdquo; and &ldquo;showtime.&rdquo; If that resonates,{' '}
        <a href="/careers">we&apos;re hiring</a>.
      </p>

      <h2>Get in touch</h2>
      <p>
        Press, partnerships, or a really good idea? Drop us a line at{' '}
        <a href="mailto:hello@trylinqr.com">hello@trylinqr.com</a> or via our{' '}
        <a href="/contact">contact page</a>.
      </p>
    </LegalPage>
  );
}
