import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'
import '@fortawesome/fontawesome-free/css/all.min.css';

import { DarkModeProvider } from './context/DarkModeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </React.StrictMode>
);
