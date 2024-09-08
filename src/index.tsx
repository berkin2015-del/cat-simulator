import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { Recorder } from './components/recorder';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div style={{ textAlign: 'center' }}>
      <h1 className='select-none'>Cat Messenger</h1>
      <Recorder />
      <p>click, spin, click again, stop spin.</p>
    </div>
  </React.StrictMode>
);
