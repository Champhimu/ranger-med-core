// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const isDev = process.env.NODE_ENV === "development";

root.render(
  isDev ? (
    <Provider store={store}>
      <App />
    </Provider>
  ) : (
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
);
