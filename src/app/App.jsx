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
import SiteMotion from '../components/layout/SiteMotion';
import Home from '../pages/Home/Home';
import { ui } from '../content/navigation';
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
export function SiteContent() {
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
      <SiteMotion routeKey={pathname} />
      <main
        id="main-content"
        className="route-frame"
        data-home={pathname === '/' ? 'true' : undefined}
        tabIndex="-1"
        key={pathname}
      >
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
      <SiteContent />
    </BrowserRouter>
  );
}
