import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { PawImage } from './components/paw-image';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div style={{ textAlign: 'center' }}>
      <h1>Cat Messenger</h1>
      <PawImage />
      <p>click, spin, click again, stop spin.</p>
    </div>
  </React.StrictMode>
);
