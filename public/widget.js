/*!
 * TryLinqr Embed Widget
 * ---------------------------------------------------------------------------
 * One-time install. The organizer drops a single tag on their website:
 *
 *   <script src="https://YOURAPP.com/widget.js" data-org-id="ORG_ID"></script>
 *
 * Works on WordPress, React, Next.js, Wix, Webflow, Squarespace, plain HTML.
 *
 * Optional attributes:
 *   data-limit="6"             max events to show (1–24)
 *   data-title="My Events"     section heading (default: "Upcoming Events")
 *   data-target="#my-events"   CSS selector of a container you placed yourself
 */
(function () {
  'use strict';

  /* ── 1. Locate the script tag ────────────────────────────────────────── */
  var script = document.currentScript;
  var isDeferred = !script;
  if (!script) {
    var all = document.getElementsByTagName('script');
    for (var i = all.length - 1; i >= 0; i--) {
      if (all[i].src && all[i].src.indexOf('widget.js') !== -1) {
        script = all[i];
        break;
      }
    }
  }
  if (!script) return;

  var orgId = script.getAttribute('data-org-id');
  if (!orgId) {
    console.warn('[TryLinqr] Missing data-org-id on widget script tag.');
    return;
  }

  var base;
  try { base = new URL(script.src).origin; } catch (e) { base = ''; }

  var limit     = clampInt(script.getAttribute('data-limit'), 6, 1, 24);
  var titleText = script.getAttribute('data-title') || 'Upcoming Events';
  var targetSel = script.getAttribute('data-target');

  /* ── 2. Resolve / create the outer container ─────────────────────────── */
  var container;
  if (targetSel) container = document.querySelector(targetSel);
  if (!container) {
    container = document.createElement('div');
    if (!isDeferred && script.parentNode) {
      script.parentNode.insertBefore(container, script.nextSibling);
    } else {
      var hero =
        document.querySelector('[class*="hero"]') ||
        document.querySelector('section') ||
        document.querySelector('header');
      if (hero && hero.parentNode) {
        hero.parentNode.insertBefore(container, hero.nextSibling);
      } else {
        document.body.appendChild(container);
      }
    }
  }
  container.setAttribute('data-trylinqr-widget', orgId);

  /* ── 3. Outer section — full-width band with padding ─────────────────── */
  var section = document.createElement('div');
  section.style.cssText = [
    'width:100%',
    'box-sizing:border-box',
    'padding:48px 0',                 /* top/bottom rhythm */
    'background:transparent',
    'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
  ].join(';');
  container.appendChild(section);

  /* Inner wrapper — max-width + horizontal centering */
  var inner = document.createElement('div');
  inner.style.cssText = [
    'max-width:1200px',
    'margin:0 auto',
    'padding:0 40px',                 /* left/right spacing */
    'box-sizing:border-box',
  ].join(';');
  section.appendChild(inner);

  /* ── 4. Header row (title + nav arrows) ──────────────────────────────── */
  var header = document.createElement('div');
  header.style.cssText = [
    'display:flex',
    'align-items:center',
    'justify-content:space-between',
    'margin-bottom:24px',
    'gap:12px',
  ].join(';');

  var headingWrap = document.createElement('div');
  headingWrap.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;';

  var titleEl = document.createElement('h2');
  titleEl.textContent = titleText;
  titleEl.style.cssText = [
    'margin:0',
    'font-size:22px',
    'font-weight:700',
    'color:inherit',
    'line-height:1.2',
  ].join(';');

  var badge = document.createElement('a');
  badge.href   = base;
  badge.target = '_blank';
  badge.rel    = 'noopener noreferrer';
  badge.textContent = 'by TryLinqr';
  badge.style.cssText = [
    'font-size:11px',
    'font-weight:600',
    'color:#944268',
    'background:rgba(148,66,104,0.10)',
    'border:1px solid rgba(148,66,104,0.25)',
    'border-radius:999px',
    'padding:3px 10px',
    'text-decoration:none',
    'white-space:nowrap',
    'line-height:1.8',
    'display:inline-block',
  ].join(';');

  headingWrap.appendChild(titleEl);
  headingWrap.appendChild(badge);

  /* Arrow buttons */
  var arrows = document.createElement('div');
  arrows.style.cssText = 'display:flex;gap:8px;flex-shrink:0;';

  function makeArrow(label, svg) {
    var btn = document.createElement('button');
    btn.setAttribute('aria-label', label);
    btn.innerHTML = svg;
    btn.style.cssText = [
      'width:36px',
      'height:36px',
      'border-radius:50%',
      'border:1.5px solid rgba(0,0,0,0.15)',
      'background:#fff',
      'cursor:pointer',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'color:#333',
      'transition:background 0.15s,border-color 0.15s',
      'padding:0',
      'box-shadow:0 1px 4px rgba(0,0,0,0.08)',
    ].join(';');
    btn.addEventListener('mouseenter', function () {
      btn.style.background = '#f5f5f5';
      btn.style.borderColor = 'rgba(0,0,0,0.3)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.background = '#fff';
      btn.style.borderColor = 'rgba(0,0,0,0.15)';
    });
    return btn;
  }

  var ARROW_L = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
  var ARROW_R = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

  var prevBtn = makeArrow('Previous', ARROW_L);
  var nextBtn = makeArrow('Next', ARROW_R);
  arrows.appendChild(prevBtn);
  arrows.appendChild(nextBtn);

  header.appendChild(headingWrap);
  header.appendChild(arrows);
  inner.appendChild(header);

  /* ── 5. Slider viewport ──────────────────────────────────────────────── */
  var CARD_W = 300;
  var CARD_GAP = 20;

  var viewport = document.createElement('div');
  viewport.style.cssText = [
    'overflow:hidden',
    'width:100%',
    'position:relative',
  ].join(';');

  var track = document.createElement('div');
  track.style.cssText = [
    'display:flex',
    'gap:' + CARD_GAP + 'px',
    'transition:transform 0.35s cubic-bezier(0.4,0,0.2,1)',
    'will-change:transform',
    'align-items:stretch',
  ].join(';');

  viewport.appendChild(track);
  inner.appendChild(viewport);

  /* Loading skeleton */
  var loader = document.createElement('div');
  loader.style.cssText = 'display:flex;gap:' + CARD_GAP + 'px;padding:4px 0;';
  for (var s = 0; s < 3; s++) {
    var sk = document.createElement('div');
    sk.style.cssText = [
      'flex:0 0 ' + CARD_W + 'px',
      'height:340px',
      'border-radius:16px',
      'background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)',
      'background-size:200% 100%',
      'animation:tlqr-shimmer 1.4s infinite',
    ].join(';');
    loader.appendChild(sk);
  }
  inner.appendChild(loader);

  /* Inject shimmer keyframe once */
  if (!document.getElementById('tlqr-shimmer-style')) {
    var style = document.createElement('style');
    style.id = 'tlqr-shimmer-style';
    style.textContent = '@keyframes tlqr-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}';
    document.head.appendChild(style);
  }

  /* ── 6. Slider logic ─────────────────────────────────────────────────── */
  var currentIndex = 0;
  var totalCards   = 0;

  function visibleCount() {
    var w = inner.offsetWidth || 760;
    return Math.max(1, Math.floor((w + CARD_GAP) / (CARD_W + CARD_GAP)));
  }

  function maxIndex() {
    return Math.max(0, totalCards - visibleCount());
  }

  function slideTo(idx) {
    currentIndex = Math.max(0, Math.min(idx, maxIndex()));
    track.style.transform = 'translateX(-' + (currentIndex * (CARD_W + CARD_GAP)) + 'px)';
    prevBtn.style.opacity         = currentIndex === 0         ? '0.35' : '1';
    prevBtn.style.pointerEvents   = currentIndex === 0         ? 'none' : 'auto';
    nextBtn.style.opacity         = currentIndex >= maxIndex() ? '0.35' : '1';
    nextBtn.style.pointerEvents   = currentIndex >= maxIndex() ? 'none' : 'auto';
  }

  prevBtn.addEventListener('click', function () { slideTo(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { slideTo(currentIndex + 1); });
  window.addEventListener('resize', function () { slideTo(currentIndex); });

  /* ── 7. Fetch events ─────────────────────────────────────────────────── */
  var frames = {};

  fetch(base + '/api/embed/events?org=' + encodeURIComponent(orgId) + '&limit=' + limit)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      /* Remove loading skeletons */
      inner.removeChild(loader);

      if (!data || !data.ok || !data.events || !data.events.length) {
        /* Show a subtle empty state instead of silently hiding */
        var empty = document.createElement('div');
        empty.style.cssText = [
          'padding:32px 0',
          'text-align:center',
          'color:#999',
          'font-size:14px',
        ].join(';');
        empty.textContent = 'No upcoming events at the moment. Check back soon!';
        inner.appendChild(empty);
        /* Hide arrows since there's nothing to slide */
        arrows.style.display = 'none';
        return;
      }

      totalCards = data.events.length;

      data.events.forEach(function (ev) {
        var slide = document.createElement('div');
        slide.style.cssText = [
          'flex:0 0 ' + CARD_W + 'px',
          'width:' + CARD_W + 'px',
          'min-width:' + CARD_W + 'px',
        ].join(';');

        var frame = document.createElement('iframe');
        frame.src = base + '/embed/' + encodeURIComponent(ev.slug);
        frame.title = ev.title || 'Event';
        frame.loading = 'lazy';
        frame.setAttribute('frameborder', '0');
        frame.setAttribute('scrolling', 'no');
        frame.style.cssText = [
          'width:100%',
          'border:0',
          'height:340px',
          'color-scheme:normal',
          'display:block',
          'border-radius:16px',
        ].join(';');

        frames[ev.slug] = frame;
        slide.appendChild(frame);
        track.appendChild(slide);
      });

      slideTo(0);
    })
    .catch(function (err) {
      inner.removeChild(loader);
      console.warn('[TryLinqr] Could not load events:', err);
      arrows.style.display = 'none';
    });

  /* ── 8. Auto-resize iframes from postMessage ─────────────────────────── */
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'trylinqr:embed-height') return;
    var f = frames[d.slug];
    if (f && d.height) f.style.height = d.height + 'px';
  });

  /* ── 9. Helpers ──────────────────────────────────────────────────────── */
  function clampInt(val, fallback, min, max) {
    var n = parseInt(val, 10);
    if (isNaN(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }
})();
