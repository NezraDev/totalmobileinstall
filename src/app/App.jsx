import { Suspense, lazy, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Home from '../pages/Home/Home';
import { ui } from '../content/navigation';
import { business } from '../content/business';
const Services = lazy(() => import('../pages/Services/Services'));
const ServiceDetail = lazy(
  () => import('../pages/ServiceDetail/ServiceDetail'),
);
const ServiceAreas = lazy(() => import('../pages/ServiceAreas/ServiceAreas'));
const Projects = lazy(() => import('../pages/Projects/Projects'));
const Gallery = lazy(() => import('../pages/Gallery/Gallery'));
const FAQ = lazy(() => import('../pages/FAQ/FAQ'));
const Contact = lazy(() => import('../pages/Contact/Contact'));
const About = lazy(() => import('../pages/About/About'));
const BookService = lazy(() => import('../pages/BookService/BookService'));
const Privacy = lazy(() => import('../pages/Privacy/Privacy'));
const Terms = lazy(() => import('../pages/Terms/Terms'));
const NotFound = lazy(() => import('../pages/NotFound/NotFound'));
function Shell() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    const main = document.getElementById('main-content');
    main?.focus({ preventScroll: true });
  }, [pathname, hash]);
  return (
    <>
      <a href="#main-content" className="skip-link">
        {ui.skip}
      </a>
      <Header />
      <main id="main-content" tabIndex="-1" key={pathname}>
        <Suspense
          fallback={
            <div className="route-loading" role="status">
              Loading page…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/service-areas" element={<ServiceAreas />} />
            <Route path="/our-work" element={<Projects />} />
            <Route
              path="/home-service"
              element={<Navigate to="/our-work" replace />}
            />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/book-service" element={<BookService />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms-of-use" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AutomotiveBusiness',
            name: business.fullName,
            telephone: '+15042077742',
            email: business.email,
            address: {
              '@type': 'PostalAddress',
              streetAddress: '5800 Morrison Rd',
              addressLocality: 'New Orleans',
              addressRegion: 'LA',
              postalCode: '70126',
              addressCountry: 'US',
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                ],
                opens: '07:00',
                closes: '17:00',
              },
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '07:00',
                closes: '12:00',
              },
            ],
          }),
        }}
      />
      <Shell />
    </BrowserRouter>
  );
}
