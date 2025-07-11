import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './pdf-worker'; // Import PDF worker configuration

// Import React-PDF styles
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 