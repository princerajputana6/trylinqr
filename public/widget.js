/*!
 * TryLinqr Embed Widget
 * ---------------------------------------------------------------------------
 * One-time install. The organizer drops a single tag on their website:
 *
 *   <script src="https://YOURAPP.com/widget.js" data-org-id="ORG_ID"></script>
 *
 * From then on, every event they publish with "Show on my website" enabled
 * appears automatically as a left-right slider — no further edits to their
 * site. Works on WordPress, React, Next.js, Wix, Webflow, Squarespace, plain
 * HTML — anything that can run a <script> tag.
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

  /* ── 3. Section wrapper with padding ─────────────────────────────────── */
  var section = document.createElement('div');
  section.style.cssText = [
    'width:100%',
    'box-sizing:border-box',
    'padding:48px 40px',
    'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
    'background:transparent',
  ].join(';');
  container.appendChild(section);

  /* ── 4. Header row (title + nav arrows) ──────────────────────────────── */
  var header = document.createElement('div');
  header.style.cssText = [
    'display:flex',
    'align-items:center',
    'justify-content:space-between',
    'margin-bottom:24px',
  ].join(';');

  var heading = document.createElement('div');
  heading.style.cssText = [
    'display:flex',
    'align-items:center',
    'gap:10px',
  ].join(';');

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
  badge.href = base;
  badge.target = '_blank';
  badge.rel = 'noopener noreferrer';
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
    'line-height:1',
  ].join(';');

  heading.appendChild(titleEl);
  heading.appendChild(badge);

  /* Arrow buttons */
  var arrows = document.createElement('div');
  arrows.style.cssText = 'display:flex;gap:8px;';

  function makeArrow(label, dir) {
    var btn = document.createElement('button');
    btn.setAttribute('aria-label', label);
    btn.innerHTML = dir === 'prev'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
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

  var prevBtn = makeArrow('Previous', 'prev');
  var nextBtn = makeArrow('Next', 'next');
  arrows.appendChild(prevBtn);
  arrows.appendChild(nextBtn);

  header.appendChild(heading);
  header.appendChild(arrows);
  section.appendChild(header);

  /* ── 5. Slider viewport ──────────────────────────────────────────────── */
  var viewport = document.createElement('div');
  viewport.style.cssText = [
    'overflow:hidden',
    'width:100%',
    'position:relative',
  ].join(';');

  var track = document.createElement('div');
  track.style.cssText = [
    'display:flex',
    'gap:20px',
    'transition:transform 0.35s cubic-bezier(0.4,0,0.2,1)',
    'will-change:transform',
  ].join(';');

  viewport.appendChild(track);
  section.appendChild(viewport);

  /* ── 6. Slider state ─────────────────────────────────────────────────── */
  var CARD_WIDTH   = 300; // px (iframe width)
  var CARD_GAP     = 20;
  var currentIndex = 0;
  var totalCards   = 0;

  function visibleCount() {
    var w = viewport.offsetWidth || 900;
    return Math.max(1, Math.floor((w + CARD_GAP) / (CARD_WIDTH + CARD_GAP)));
  }

  function maxIndex() {
    return Math.max(0, totalCards - visibleCount());
  }

  function slideTo(idx) {
    currentIndex = Math.max(0, Math.min(idx, maxIndex()));
    var offset = currentIndex * (CARD_WIDTH + CARD_GAP);
    track.style.transform = 'translateX(-' + offset + 'px)';
    prevBtn.style.opacity = currentIndex === 0 ? '0.35' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    nextBtn.style.opacity = currentIndex >= maxIndex() ? '0.35' : '1';
    nextBtn.style.pointerEvents = currentIndex >= maxIndex() ? 'none' : 'auto';
  }

  prevBtn.addEventListener('click', function () { slideTo(currentIndex - 1); });
  nextBtn.addEventListener('click', function () { slideTo(currentIndex + 1); });
  window.addEventListener('resize', function () { slideTo(currentIndex); });

  /* ── 7. Fetch events and build cards ─────────────────────────────────── */
  var frames = {};

  fetch(base + '/api/embed/events?org=' + encodeURIComponent(orgId) + '&limit=' + limit)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data || !data.ok || !data.events || !data.events.length) {
        container.style.display = 'none';
        return;
      }

      totalCards = data.events.length;

      data.events.forEach(function (ev) {
        var slide = document.createElement('div');
        slide.style.cssText = [
          'flex:0 0 ' + CARD_WIDTH + 'px',
          'width:' + CARD_WIDTH + 'px',
          'min-width:' + CARD_WIDTH + 'px',
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
        ].join(';');

        frames[ev.slug] = frame;
        slide.appendChild(frame);
        track.appendChild(slide);
      });

      // Initial arrow state
      slideTo(0);
    })
    .catch(function (err) {
      console.warn('[TryLinqr] Could not load events:', err);
    });

  /* ── 8. Auto-resize iframes ──────────────────────────────────────────── */
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
