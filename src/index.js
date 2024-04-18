import React from 'react';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import App from './App';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const initOptions = {
  onLoad: 'check-sso', 
  silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
};

axios.interceptors.request.use(
  (config) => {
 
    const token = keycloak.token;
    console.log("Token: " + token); 

    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token: ", decodedToken); 

      if (decodedToken && decodedToken.realm_access && decodedToken.realm_access.roles) {
    
        const userRoles = decodedToken.realm_access.roles;
        console.log("User Roles: ", userRoles);
    
      } else {
        console.log("User roles not found in the token.");
      }
    } catch (error) {
      console.error("Error decoding the token: ", error);
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log(config.headers+"nu i capu mieu");
    }

    

    return config;
  },
  (error) => {

    return Promise.reject(error);
  }
);

ReactDOM.render(
  <React.StrictMode>
    <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
      <App />
    </ReactKeycloakProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
