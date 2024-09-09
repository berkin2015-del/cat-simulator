import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Recorder } from './pages/recorder';
import { Settings } from './pages/settings';


import './index.css';

export const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <h1 className='select-none place-h-center'>Cat Messenger</h1>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Recorder />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
