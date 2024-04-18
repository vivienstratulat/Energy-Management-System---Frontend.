import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
function ClientAccount() {
  const navigate = useNavigate();

  const { email } = useParams();
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    externalId:"",
    role: "",
  });
  const { id, name, password } = user;
  console.log(id);
  console.log(email);

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const loadClient = async () => {

    const result = await axios.get(`http://localhost:8080/person/getByEmail/${email}`);
    setUser(result.data);
  };
  useEffect(() => {
    loadClient();
  }, []);

  async function deleteAcc(event) {
    navigate(`/delete-acc/${event.target.value}`);
  }

  async function editAcc(event) {
    navigate(`/update-client/${event.target.value}`);
  }

  async function goHome(event) {
    navigate(`/`);
  }
  
  return (
    <div className="container">
      <div>
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <b>
            <h2 className="text-center m-4">Account details</h2>
          </b>

          <div className="card">
            <div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Name: </b>
                  {user.name}
                </li>
                <li className="list-group-item">
                  <b>Email: </b>
                  {user.email} 
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-pink my-2 mx-2"
              onClick={goHome}
            >
              Home
            </button>

            <button
              type="submit"
              className="btn btn-pink my-2 mx-2" // Adjust mx-2 for spacing
              value={email}
              onClick={editAcc}
            >
              Edit Account
            </button>

            <button
              type="submit"
              className="btn btn-pink my-2 mx-2" // Adjust mx-2 for spacing
              value={email}
              onClick={deleteAcc}
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ClientAccount;
