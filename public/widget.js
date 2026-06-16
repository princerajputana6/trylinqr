/*!
 * TryLinqr Embed Widget
 * ---------------------------------------------------------------------------
 * One-time install. The organizer drops a single tag on their website:
 *
 *   <script src="https://YOURAPP.com/widget.js" data-org-id="ORG_ID"></script>
 *
 * From then on, every event they publish with "Show on my website" enabled
 * appears automatically — no further edits to their site. Works on WordPress,
 * React, Next.js, Wix, Webflow, Squarespace, plain HTML — anything that can
 * run a <script> tag.
 *
 * Optional attributes:
 *   data-limit="6"                 max events to show (1–24)
 *   data-columns="2"               grid columns on wide screens (1–4)
 *   data-target="#my-events"       CSS selector of a container you placed
 *                                  yourself; otherwise cards render where the
 *                                  script tag sits.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var isDeferred = !script; // true when loaded async/deferred (e.g. Next.js Script component)
  if (!script) {
    // Fallback for browsers/loaders where currentScript is null.
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

  // Derive our own origin from the script src so the snippet is copy-paste
  // portable across staging / production without editing URLs.
  var base;
  try {
    base = new URL(script.src).origin;
  } catch (e) {
    base = '';
  }

  var limit = clampInt(script.getAttribute('data-limit'), 6, 1, 24);
  var columns = clampInt(script.getAttribute('data-columns'), 2, 1, 4);
  var targetSel = script.getAttribute('data-target');

  // Resolve / create the container.
  var container;
  if (targetSel) {
    container = document.querySelector(targetSel);
  }
  if (!container) {
    container = document.createElement('div');
    if (!isDeferred && script.parentNode) {
      // Synchronous load: insert right where the script tag sits in the DOM.
      script.parentNode.insertBefore(container, script.nextSibling);
    } else {
      // Deferred/async load (e.g. Next.js): document.currentScript was null so
      // we don't know where the organizer intended to place the widget. Auto-
      // detect the first prominent hero/section element and insert after it.
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

  var grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gap = '16px';
  grid.style.gridTemplateColumns =
    'repeat(auto-fill, minmax(' + (columns >= 2 ? 280 : 320) + 'px, 1fr))';
  grid.style.width = '100%';
  grid.style.boxSizing = 'border-box';
  container.appendChild(grid);

  // slug -> iframe, so height messages from each embed find their frame.
  var frames = {};

  fetch(base + '/api/embed/events?org=' + encodeURIComponent(orgId) + '&limit=' + limit)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data || !data.ok || !data.events || !data.events.length) {
        grid.parentNode.removeChild(grid);
        return;
      }
      data.events.forEach(function (ev) {
        var frame = document.createElement('iframe');
        frame.src = base + '/embed/' + encodeURIComponent(ev.slug);
        frame.title = ev.title || 'Event';
        frame.loading = 'lazy';
        frame.setAttribute('frameborder', '0');
        frame.setAttribute('scrolling', 'no');
        frame.style.width = '100%';
        frame.style.border = '0';
        frame.style.height = '340px'; // until the embed reports its real height
        frame.style.colorScheme = 'normal';
        frames[ev.slug] = frame;
        grid.appendChild(frame);
      });
    })
    .catch(function (err) {
      console.warn('[TryLinqr] Could not load events:', err);
    });

  // Auto-resize: each embed page posts its content height back up.
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'trylinqr:embed-height') return;
    var f = frames[d.slug];
    if (f && d.height) f.style.height = d.height + 'px';
  });

  function clampInt(val, fallback, min, max) {
    var n = parseInt(val, 10);
    if (isNaN(n)) return fallback;
    return Math.max(min, Math.min(max, n));
  }
})();
