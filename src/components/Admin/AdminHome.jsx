import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams, Link } from "react-router-dom";

function AdminHome() {
  const location = useLocation();
  const email = location.state.email;


  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  
  useEffect(() => {
    loadClients();
  },[]);

  const loadClients = async () => {
    const result = await axios.get("http://localhost:8080/person/getAll");
    const filteredClients = result.data.filter((client) => client.role === "client");
    setClients(filteredClients);
  };

  const navigateToRegisterClient = () => {
    navigate("/register-client" , { state: { email: email} });
  };


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
            {clients.map((user, index) => (
              <tr>
                <th scope="row" key={index}>
                  {index + 1}
                </th>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>
                  <Link
                    className="btn btn-pink mx-2"
                    to={`/client-details/${user.email}`}
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
      </div>
    </div>
  );
}
export default AdminHome;
