import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useKeycloak } from '@react-keycloak/web';

function Register() {

  const { keycloak } = useKeycloak();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function save(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/person/register",
        {
          name:name,
          email: email,
          password: password,
          role: "client",
        }
      );

      toast("User created successfully");
      keycloak.login({ redirectUri: `http://localhost:3000/clientHome`}); 
    } catch (error) {
      //toast.error("Email already used or an error occurred.", { position: "top-right" });
      toast.error(error)
    }
  }

  return (
    <div className="container">
      <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
        
        <div >
        <div className="col text-center">
        <b>
        <h1 className="pink-with-contour-and-shadow mt-2">Register client</h1>
        </b>
        </div>

          <form>
            <div class="form-group">
            <b> <label>Name</label></b>
              <input
                type="text"
                class="form-control"
                id="Name"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div class="form-group">
             <b> <label>Email</label></b>
              <input
                type="text"
                class="form-control"
                id="email"
                placeholder="Enter Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div class="form-group">
             <b> <label>Password</label></b>
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="col text-center">
            <button type="submit" class="btn btn-pink mt-4" onClick={save}>
              Save
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Register;
