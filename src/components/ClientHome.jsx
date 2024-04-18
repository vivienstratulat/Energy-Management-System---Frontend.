import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";

function ClientHome() {
  let email;
  const { keycloak, initialized } = useKeycloak();
  const [user, setUser] = useState({ role: 'client' });
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!initialized) {
        return;
      }

      if (!keycloak.authenticated) {
        navigate("/");
        return;
      }

      try {
        const userProfile = keycloak.tokenParsed;
         email = keycloak.tokenParsed.email;
        const response = await axios.get(`http://localhost:8080/person/getByEmail/${email}`);
        setUser(response.data);

        if (response.data.role === "admin") {
          // Load clients if the user is an admin
          console.log("sunt admin");
          loadClients();
        }
      } catch (error) {
        // Handle the error
      }


    };

    fetchUserData();
  }, [initialized, keycloak, navigate]);

  const goHome = () => {
    navigate("/");
  };

  const edit = () => {
    navigate(`/account/${user.email}`);
  };

  const seeDevices = () => {
    console.log("exu"+user.externalId)
    navigate(`/SeeDevices/${user.externalId}`);
  };

  const chatAdmin = () => {
    console.log("sender email"+user.email)
    navigate(`/chat/${user.email}`);
  };

  const chat = () => {
    console.log("sender email"+user.email)
    navigate(`/adminChat/${user.email}`);
  };

  const navigateToRegisterClient = () => {
    navigate("/register-client" , { state: { email: email} });
  };

  const logOut = () => {
    keycloak.logout({ redirectUri: `http://localhost:3000` });
  };
  
  const loadClients = async () => {
    const result = await axios.get("http://localhost:8080/person/getAll");
    const filteredClients = result.data.filter((client) => client.role === "client");
    setClients(filteredClients);
  };

  if(user.role==='client'){
  return (
    <div className="container">
      <div className="border rounded p-4 mt-2 shadow">
        <div className="text-center">
          <h1 className="pink-with-contour-and-shadow">Welcome back, {user?.preferred_username || 'User'}</h1>
        </div>
        <div className="text-center mt-4">
          <button type="button" className="btn btn-pink my-2 mx-2" onClick={goHome}>
            Home
          </button>
          <button type="button" className="btn btn-pink my-2 mx-2" onClick={edit}>
            Account details
          </button>
          <button type="button" className="btn btn-pink my-2 mx-2" onClick={seeDevices}>
            See devices
          </button>
          <button type="button" className="btn btn-pink my-2 mx-2" onClick={chatAdmin}>
            Chat with admin
          </button>
          <button type="button" className="btn btn-pink my-2 mx-2" onClick={logOut}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );}
  else if(user.role==='admin'){
    return (
      <div className="container">
        <div className="py-4">
          <div className="col text-center">
            <b>
              <h1 className="pink-with-contour-and-shadow mt-2">Clients</h1>
            </b>
          </div>
          <table className="table border shadow">
            <thead>
              <tr>
                <th >ID</th>
                <th >Email</th>
                <th >Name</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{client.email}</td>
                  <td>{client.name}</td>
                  <td>
                    <Link
                      className="btn btn-pink mx-2"
                      to={`/client-details/${client.email}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="btn btn-pink mx-2"
            onClick={navigateToRegisterClient}
          >
            Add New Client
          </button>

          <button
            className="btn btn-pink mx-2"
            onClick={chat}
          >
            Chat
          </button>
          <button
            className="btn btn-pink mx-2"
            onClick={logOut}
          >
            Log out
          </button>
        </div>
      </div>
    );
  }
  }

export default ClientHome;
