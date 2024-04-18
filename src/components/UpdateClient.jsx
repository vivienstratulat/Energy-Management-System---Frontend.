import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateClient() {
  let navigate = useNavigate();
  const { email } = useParams();
  console.log(email);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [updatedUser, setUpdatedUser] = useState({
    name: "",
    email, // Initialize with the email from route parameters
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const onInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    loadUser();
  }, [email]); // Include email as a dependency

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/person/update/${email}`, updatedUser);
      if (response.status === 200) {
        toast("User updated");
        navigate("/clientHome", { state: { email: updatedUser.email } });
      } else {
        toast.error("User update failed");
      }
    } catch (error) {
      toast.error("User update failed");
    }
  };

  const loadUser = async () => {
    const result = await axios.get(`http://localhost:8080/person/getByEmail/${email}`);
    setUser(result.data);
    setUpdatedUser(result.data); // Set the updatedUser to the current values
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <div className="col text-center">
            <b>
              <h1 className="pink-with-contour-and-shadow">Edit your account</h1>
            </b>
          </div>

          <form onSubmit={(e) => onSubmit(e)}>
            <div className="form-group">
              <label>
                <b>Name</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder={user.name}
                value={updatedUser.name}
                onChange={(event) => onInputChange(event)}
                name="name"
              />
            </div>

            <div className="form-group">
              <label>
                <b>Password</b>
              </label>
              <div className="input-group">
                {/* <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder={user.password}
                  value={updatedUser.password}
                  onChange={(event) => onInputChange(event)}
                  name="password"
                /> */}
                {/* <div className="input-group-append">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEye : faEyeSlash}
                    />
                  </button>
                </div> */}
              </div>
            </div>
            <div className="form-group">
              <label>
                <b>Email</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder={user.email}
                value={updatedUser.email}
                onChange={(event) => onInputChange(event)}
                disabled={true}
                name="email"
              />
            </div>

            <button type="submit" className="btn btn-pink mt-4" onClick={onSubmit}>
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateClient;
