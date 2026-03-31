import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');

// When react-snap pre-renders, it writes HTML into #root.
// On subsequent client load we must hydrate instead of re-render
// so the existing DOM is reused rather than blown away.
if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

reportWebVitals();
