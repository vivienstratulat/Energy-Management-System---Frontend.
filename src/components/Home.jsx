import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import './Styles.css';
import { useKeycloak } from '@react-keycloak/web';

function Home() {
  const { keycloak } = useKeycloak();

  useEffect(() => {
  });

  const navigate = useNavigate();

  const handleLogin = () => {
    keycloak.login({ redirectUri: `http://localhost:3000/clientHome`}); // Use the login function provided by useKeycloak
    //navigate("/clientH")
  };

  function goToLoginPage() {
    navigate("/login");
  }
  function goToRegisterPage() {
    navigate("/register");
  }
  return (
    <div className="container">
      <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
      <div className="col text-center">
        <b>
        <h1 className="pink-with-contour-and-shadow mt-2">Home</h1>
        </b>
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <button
            color="blue"
            text="Login"
            onClick={handleLogin}
            className="btn btn-pink mx-4"
          >
            Login
          </button>
          <button
            className="btn btn-pink mx-2"
            color="blue"
            text="Register"
            onClick={goToRegisterPage}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
