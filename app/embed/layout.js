// Standalone layout for embeddable event cards. Deliberately bare — no site
// nav, footer or chrome — so the markup renders cleanly inside an organizer's
// <iframe> on any third-party website.
export const metadata = {
  robots: { index: false, follow: false },
};

export default function EmbedLayout({ children }) {
  return (
    <div style={{ margin: 0, padding: 0, background: 'transparent' }}>
      {children}
    </div>
  );
}
