import React from 'react';
import ReactDOM from 'react-dom/client';
import './pages/legacy/css/style.css';
import './pages/legacy/css/animations.css';
import './pages/legacy/css/responsive.css';
import './pages/legacy/css/admin.css';
import App from './App'
import '@fortawesome/fontawesome-free/css/all.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
