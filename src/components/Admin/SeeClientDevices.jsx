import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SeeDevices() {
    const { externalId} = useParams();
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);


    console.log(externalId);
 

  // const naviCenter=(center)=>{
  // navigate(`/make-appointment/${email}`, {state:{ centerId: center.id }})};

  /*const getUser = async () => {
    const res = await axios.get(`http://localhost:8080/person/getByEmail/${email}`);
    setUser(res.data);
  };
*/
  const loadDevices = async () => {
    const result = await axios.get(
      `http://localhost:8081/device/getByClientId/${externalId}`
    );
    setDevices(result.data);
  };

  useEffect(() => {
    //getUser();
    loadDevices();
    
  }, []);

    async function deleteDevice(event){
    
        await axios.post(`http://localhost:8081/device/delete/${event.target.value}`);
        toast("Device removed");
        navigate("/clientHome");
    }


  return (
    <div className="container">
      <div className="py-4">
      <div className="col text-center">
            <b>
              <h1 className="pink-with-contour-and-shadow"> Devices</h1>
            </b>
          </div>
        <table className="table border shadow">
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Address</th>
              <th>Max hourly consumption</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device, index) => (
              <tr>
                <th scope="row" key={index}>
                  {index + 1}
                </th>
                <td>{device.description}</td>
                <td>{device.address}</td>
                <td>{device.maxHourlyConsumption}</td>
                <td>
                  <Link
                    className="btn btn-pink mx-2"
                    to={`/updateDevice/${device.id}`}
                  >
                    EDIT
                  </Link>
                  <button
          className="btn btn-pink mx-2"
          value={device.id}
          onClick={deleteDevice}
        >
          DELETE
        </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default SeeDevices;
