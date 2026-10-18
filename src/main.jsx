import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/hero.css';
import './styles/metrics.css';
import './styles/brand.css';
import './styles/comparison-controls.css';
import './styles/spacing.css';
import './styles/map.css';
import './styles/motion.css';
import App from './app/App';

const application = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
const root = document.getElementById('root');
if (root.hasAttribute('data-prerendered'))
  ReactDOM.hydrateRoot(root, application);
else ReactDOM.createRoot(root).render(application);
