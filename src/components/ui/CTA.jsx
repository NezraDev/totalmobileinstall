import { Link } from 'react-router-dom';
import { ArrowUpRight, Phone } from 'lucide-react';
import { ctaCopy as c } from '../../content/ui';
import { business } from '../../content/business';
export default function CTA() {
  return (
    <section className="closing-cta">
      <div className="container">
        <div>
          <h2>{c.title}</h2>
          <p>{c.description}</p>
        </div>
        <div className="button-group">
          <Link className="button button-white" to="/book-service?mode=mobile">
            {c.action}
            <ArrowUpRight size={18} />
          </Link>
          <a className="cta-call" href={business.phoneHref}>
            <Phone size={17} />
            {c.call}
          </a>
        </div>
      </div>
    </section>
  );
}
