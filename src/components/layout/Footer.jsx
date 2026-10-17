import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, ArrowUpRight } from 'lucide-react';
import { business } from '../../content/business';
import { services } from '../../content/services';
import { navigation, ui } from '../../content/navigation';
export default function Footer() {
  const [suppressed, setSuppressed] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    const visible = new Set();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setSuppressed(visible.size > 0);
    });
    const attach = () =>
      document
        .querySelectorAll('.booking-form-wrap,.location-map,.site-footer')
        .forEach((el) => observer.observe(el));
    attach();
    const mutation = new MutationObserver(attach);
    mutation.observe(document.getElementById('main-content'), {
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, [pathname]);
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/">
              <img
                src={business.logo}
                alt={business.name}
                width="1200"
                height="196"
              />
            </Link>
            <p>{business.footer}</p>
          </div>
          <div>
            <h2>{ui.servicesHeading}</h2>
            {services.map((s) => (
              <Link key={s.id} to={`/services/${s.id}`}>
                {s.name}
              </Link>
            ))}
          </div>
          <div>
            <h2>{ui.exploreHeading}</h2>
            {navigation
              .filter((n) => n.to !== '/')
              .map((n) => (
                <Link key={n.to} to={n.to}>
                  {n.label}
                </Link>
              ))}
          </div>
          <div className="footer-contact">
            <h2>{ui.contactHeading}</h2>
            <a className="footer-phone" href={business.phoneHref}>
              {business.phone}
            </a>
            <a href={`mailto:${business.email}`}>{business.email}</a>
            <p>{business.address}</p>
            {business.hours.map((h) => (
              <p key={h.days}>
                {h.days}
                <br />
                {h.time}
              </p>
            ))}
          </div>
        </div>
        <div className="container footer-bottom">
          <p>{business.copyright}</p>
          <div>
            <Link to="/privacy-policy">{ui.privacyLabel}</Link>
            <Link to="/terms-of-use">{ui.termsLabel}</Link>
          </div>
        </div>
      </footer>
      <div className={`mobile-actions ${suppressed ? 'suppressed' : ''}`}>
        <a href={business.phoneHref}>
          <Phone size={18} />
          {ui.call}
        </a>
        <Link to="/book-service">
          {ui.book}
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </>
  );
}
