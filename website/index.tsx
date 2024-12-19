import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './pages/Home';

import 'htmlcache.js';

const root = createRoot(document.getElementById('root'));
setTimeout(() => {
  document.getElementById('loading')?.remove();
  root.render(<Home />);
}, 1000);
