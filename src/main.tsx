import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Add error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: system-ui, sans-serif;">
      <h1>Failed to Load Application</h1>
      <p>Please check the browser console for errors.</p>
      <pre style="text-align: left; background: #f5f5f5; padding: 1rem; border-radius: 4px; margin-top: 1rem;">${String(error)}</pre>
    </div>
  `;
}

