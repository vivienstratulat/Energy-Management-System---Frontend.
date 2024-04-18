import Keycloak from 'keycloak-js';

const keycloakConfig = {
  realm: 'ems',
  url: 'http://localhost:8082',
  redirectUri: 'http://localhost:3000/clientH',
  clientId: 'ems-frontend',
  // additional configuration if necessary
};

const keycloak = new Keycloak(keycloakConfig);

keycloak.onTokenExpired = () => {
    keycloak.updateToken(30) // Specify a minimum validity period in seconds
        .then(refreshed => {
            if (refreshed) {
                console.log('Token refreshed successfully');
            } else {
                console.log('Token not refreshed, it is still valid');
            }
        })
        .catch(err => {
            console.error('Failed to refresh the token, or the session has expired', err);
        });
};

export default keycloak;
