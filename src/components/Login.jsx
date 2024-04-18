import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function login(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const url = "http://localhost:8080/person/login";
      const data = { email: email, password: password };
      const config = { "content-type": "application/json" };
      const res = await axios.post(url, data, config);

  

      const myUser = res.data;
      if (myUser.role === "admin") {
        toast.success("Hello admin", { position: "top-right" }); // Customize success toast
        navigate("/adminHome", { state: { email: myUser.email } });
      } else if (myUser.role === "client") {
        toast.success("Hello client", { position: "top-right" }); // Customize success toast
        navigate("/clientHome", { state: { email: myUser.email } });
      }
    } catch (err) {
      toast.error("Wrong credentials or an error occurred.", { position: "top-right" }); // Customize error toast
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
        <div className="row">
          <div className="col text-center">
            <b>
              <h1 className="pink-with-contour-and-shadow">Login</h1>
            </b>
          </div>
        </div>
        <hr />

        <form onSubmit={login}>
          <div className="row d-flex justify-content-center text-center">
            <div className="col-sm-6">
              <div className="form-group">
                <label>
                  <b>Email:</b>
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        style={{ width: "20px", height: "25px" }}
                      />
                    </span>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row d-flex justify-content-center text-center">
            <div className="col-sm-6">
              <div className="form-group">
                <label>
                  <b>Password:</b>
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <FontAwesomeIcon
                        icon={faLock}
                        style={{ width: "20px", height: "25px" }}
                      />
                    </span>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                  />
                  <div className="input-group-append">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                        style={{ width: "20px", height: "25px" }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row d-flex justify-content-center text-center">
            <div className="col-sm-6 my-2">
              <button
                type="submit"
                className="btn btn-pink btn-lg"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
