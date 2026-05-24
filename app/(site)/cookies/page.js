import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Cookie Policy · TryLinqr' };

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cookie Policy"
      intro="We keep cookies to the bare minimum needed to run the platform reliably and remember you between visits."
      lastUpdated="May 2026"
    >
      <h2>What is a cookie?</h2>
      <p>
        A cookie is a small piece of data your browser stores on behalf of a
        website. We use cookies and similar technologies (like
        localStorage) to keep you signed in and to make the site work.
      </p>

      <h2>Cookies we set</h2>
      <ul>
        <li>
          <strong>Session cookies</strong> (essential): keep you signed in
          between page loads. Expire when you log out.
        </li>
        <li>
          <strong>CSRF tokens</strong> (essential): protect your account from
          cross-site request forgery.
        </li>
        <li>
          <strong>Preference cookies</strong> (functional): remember your
          chosen city, theme and recently-viewed events.
        </li>
        <li>
          <strong>Analytics</strong> (optional): aggregated, anonymous data
          on which pages and events are most popular. We do not run
          third-party ad cookies.
        </li>
      </ul>

      <h2>Managing cookies</h2>
      <p>
        You can clear cookies in your browser at any time. Doing so will
        sign you out and reset your preferences but will not delete your
        account or bookings.
      </p>

      <h2>Third-party</h2>
      <p>
        Our payment partner Razorpay may set cookies during checkout — see
        their{' '}
        <a
          href="https://razorpay.com/privacy/"
          target="_blank"
          rel="noopener"
        >
          privacy notice
        </a>
        .
      </p>

      <h2>Updates</h2>
      <p>
        We will note any changes to this policy here, and in major cases
        notify you via email.
      </p>
    </LegalPage>
  );
}
