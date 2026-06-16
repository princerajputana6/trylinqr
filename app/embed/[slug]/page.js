import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Brand palette (kept inline so the card is fully self-contained inside the
// organizer's iframe and never depends on the host page's CSS or our bundle).
const C = {
  brand: '#944268',
  brandDeep: '#4f213a',
  sand: '#f8c49c',
  pearl: '#fbf7f2',
  ink: '#2a2236',
  muted: '#6b6478',
  line: 'rgba(42,34,54,0.12)',
};

function minPriceOf(e) {
  if (!e?.ticketTiers?.length) return 0;
  return Math.min(...e.ticketTiers.map((t) => t.price || 0));
}

function dateRange(e) {
  const opts = { day: 'numeric', month: 'short', year: 'numeric' };
  const start = e.startDate
    ? new Date(e.startDate).toLocaleDateString('en-IN', opts)
    : '';
  const end =
    e.endDate && new Date(e.endDate) > new Date(e.startDate)
      ? new Date(e.endDate).toLocaleDateString('en-IN', opts)
      : '';
  let s = start;
  if (end && end !== start) s += ` – ${end}`;
  if (e.startTime) s += ` · ${e.startTime}${e.endTime ? `–${e.endTime}` : ''}`;
  return s;
}

function NotAvailable() {
  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        border: `1px solid ${C.line}`,
        borderRadius: 16,
        padding: 24,
        background: '#fff',
        color: C.muted,
        textAlign: 'center',
      }}
    >
      This event is no longer available.
    </div>
  );
}

export default async function EmbedEventCard({ params }) {
  await connectDB();
  const event = await Event.findOne({
    slug: params.slug,
    status: 'published',
  })
    .populate('organizer', 'name orgName isApproved isBanned')
    .lean();

  // Hide events from unverified / banned organizers, mirroring the public feed.
  const org = event?.organizer;
  const blocked =
    !event || !org || org.isApproved === false || org.isBanned === true;

  if (blocked) {
    return (
      <main style={{ padding: 12, background: 'transparent' }}>
        <NotAvailable />
      </main>
    );
  }

  const min = minPriceOf(event);
  const eventUrl = `${APP_URL}/events/${event.slug}`;
  const banner =
    event.bannerImage ||
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=70';
  const city = event.venue?.name
    ? `${event.venue.name}${event.venue.city ? `, ${event.venue.city}` : ''}`
    : event.venue?.city || 'Online';

  return (
    <main style={{ padding: 12, background: 'transparent' }}>
      <a
        href={eventUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
          fontFamily:
            'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <article
          style={{
            overflow: 'hidden',
            borderRadius: 16,
            border: `1px solid ${C.line}`,
            background: '#fff',
            boxShadow: '0 6px 24px rgba(42,34,54,0.08)',
          }}
        >
          <div style={{ position: 'relative', height: 168 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <span
              style={{
                position: 'absolute',
                left: 12,
                top: 12,
                background: 'rgba(255,255,255,0.95)',
                color: C.brand,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 999,
              }}
            >
              {event.category?.replace('-', ' ')}
            </span>
          </div>

          <div style={{ padding: 18 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                lineHeight: 1.25,
                fontWeight: 800,
                color: C.brandDeep,
              }}
            >
              {event.title}
            </h3>

            <p style={{ margin: '10px 0 0', fontSize: 13, color: C.muted }}>
              📅 {dateRange(event)}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>
              📍 {city}
            </p>

            <div
              style={{
                marginTop: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: C.muted,
                  }}
                >
                  From
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.brand }}>
                  {min === 0 ? 'FREE' : formatCurrency(min)}
                </div>
              </div>
              <span
                style={{
                  background: C.brand,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '10px 18px',
                  borderRadius: 10,
                  whiteSpace: 'nowrap',
                }}
              >
                Register →
              </span>
            </div>
          </div>
        </article>
      </a>

      {/* Auto-resize: tell the parent page our true height so the host iframe
          can shrink/grow to fit with no inner scrollbar. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
  function postHeight(){
    try{
      var h = document.body.scrollHeight;
      parent.postMessage({ type: 'trylinqr:embed-height', slug: ${JSON.stringify(
        event.slug,
      )}, height: h }, '*');
    }catch(e){}
  }
  window.addEventListener('load', postHeight);
  setTimeout(postHeight, 60);
  if (window.ResizeObserver){ new ResizeObserver(postHeight).observe(document.body); }
})();`,
        }}
      />
    </main>
  );
}
