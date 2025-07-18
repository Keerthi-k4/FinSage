// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Replace with your actual client ID
const clientId = "327913298164-916r0cv5ut4iotvhlf4seir04e74ih46.apps.googleusercontent.com";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>  {/* ✅ Needed for GoogleLogin */}
      <AuthProvider>                           {/* ✅ Needed for auth context */}
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
