import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddDevice() {

    const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [maxHourlyConsumption, setMaxHourlyConsumption] = useState("");
  const [clientId, setClientId] = useState("");
  const[user,setUser]=useState({});
  const { email } = useParams();
  const navigate = useNavigate();

  const loadClient = async () => {
    const result = await axios.get(`http://localhost:8080/person/getByEmail/${email}`);
    setUser(result.data);
  };
  useEffect(() => {
    loadClient();
  }, []);

  console.log(email+" from add device");
  async function save(event) {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8081/device/register/${user.externalId}`,
        {
            description: description,
            address: address,
            maxHourlyConsumption: maxHourlyConsumption,
          }
      );

      toast("Device added successfully");
      navigate(`/client-details/${user.email}`);
    } catch (error) {
    }
  }

  return (
    <div className="container">
      <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
        
        <div >
        <div className="col text-center">
        <b>
        <h1 className="pink-with-contour-and-shadow mt-2">Add device</h1>
        </b>
        </div>

          <form>
            <div class="form-group">
            <b> <label>Description</label></b>
              <input
                type="text"
                class="form-control"
                id="Description"
                placeholder="Enter description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div class="form-group">
             <b> <label>Address</label></b>
              <input
                type="text"
                class="form-control"
                id="address"
                placeholder="Enter address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              />
            </div>

            <div class="form-group">
             <b> <label>Max Hourly Consumption</label></b>
              <input
                type="number"
                class="form-control"
                id="maxConsumption"
                placeholder="Enter max hourly consumption"
                value={maxHourlyConsumption}
                onChange={(event) => setMaxHourlyConsumption(event.target.value)}
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
export default AddDevice;
