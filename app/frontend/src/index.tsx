import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './styles/styles.css'

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Lora:wght@400;700&family=Nunito:wght@400;600;700&family=Montserrat:wght@400;600;700&display=swap';
document.head.appendChild(link);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
            <App />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);