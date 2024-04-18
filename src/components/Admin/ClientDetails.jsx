import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
function DoctorDetails() {
  const navigate = useNavigate();

  const { email } = useParams();

  const [user, setUser] = useState({
    id: "",
    name: "",
   // email: "",
    password: "",
    externalId:"",
    role: "",
  });

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const loadClient = async () => {
    const result = await axios.get(`http://localhost:8080/person/getByEmail/${email}`);
    setUser(result.data);
  };

  async function seeDevices(event) {
    console.log(event.target.value+"ceva");
    navigate(`/SeeClientDevices/${event.target.value}`);
  }

  async function edit(event) {
    console.log("qqqqqqqqq"+event.target.value);
    navigate(`/update-client/${event.target.value}`);
  }

  useEffect(() => {
    loadClient();
  }, []);

  return (
    <div className="container">
      <div>
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
        <div className="col text-center">
            <b>
              <h1 className="pink-with-contour-and-shadow">Client details</h1>
            </b>
          </div>

          <div className="card">
            <div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <b>Name:</b>
                  {user.name}
                </li>

                <li className="list-group-item">
                  <b>Email:</b>
                  {user.email}
                </li>
                <li className="list-group-item">
                  <b>Devices:</b>
                  <button
            type="submit"
            className="btn btn-pink my-2 mx-2"
            value={user.externalId}
            onClick={seeDevices}
          >
            see devices
          </button>
          <Link className="btn btn-pink mx-2" to={`/addDevice/${user.email}`}>
            +add device
          </Link>
                </li>
              </ul>
            </div>
          </div>
          <Link className="btn btn-pink my-2" to={`/clientHome`}>
            back
          </Link>
          <Link className="btn btn-pink mx-2" to={`/update-client/${user.email}`}>
            Edit Account
          </Link>

          <Link className="btn btn-pink mx-2" to={`/delete-acc/${user.email}`}>
            Delete Account
          </Link>
        </div>
      </div>
    </div>
  );
}
export default DoctorDetails;
