import React from 'react';
import { useKeycloak } from '@react-keycloak/web';

const ClientH = () => {
  const { keycloak, initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!keycloak.authenticated) {
    return <div>You are not logged in.</div>;
  }

  const userProfile = keycloak.tokenParsed;
  //const id=keycloak.idToken;
  const id=keycloak.tokenParsed.sub;
  const { preferred_username, email } = userProfile;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {preferred_username}</p>
      <p>Email: {id}</p>
    </div>
  );
};

export default ClientH;
