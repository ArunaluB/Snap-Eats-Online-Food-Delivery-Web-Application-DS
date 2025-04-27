import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { Toaster } from 'react-hot-toast';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Toaster position="top-right" />
      <App />
    </React.StrictMode>
  );
} else {
  throw new Error("Root element not found");
}
