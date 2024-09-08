import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { Paw } from './components/paw';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <h1>Hello World</h1>
    <Paw />
  </React.StrictMode>
);
