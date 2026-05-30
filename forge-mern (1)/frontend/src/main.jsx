import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { store } from './app/store';
import { theme, GlobalStyle } from './styles/theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <App />
          <Toaster position="top-right" toastOptions={{
            style: { background: '#1a1d2e', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' },
          }} />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
