import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateDevice() {
  let navigate = useNavigate();
  const { id } = useParams();

  const [device, setDevice] = useState({
    description: "",
    address: "",
    maxHourlyConsumption: "",
  });

  const [updatedDevice, setUpdatedDevice] = useState({
    description: device.description,
    address: device.address,
    maxHourlyConsumption: device.maxHourlyConsumption,
  });

  useEffect(() => {
    loadDevice();
  }, []);

  const onSubmit = async (e) => {
    console.log(updatedDevice.maxHourlyConsumption+"pls")
    e.preventDefault();
    console.log("max consumption",e.target.value)
    await axios.put(`http://localhost:8081/device/update/${device.id}`, {
      description: updatedDevice.description,
      address: updatedDevice.address,
      maxHourlyConsumption: updatedDevice.maxHourlyConsumption,
    });
    toast.success("Device updated", {
        position: "top-right", // Customize the position
        autoClose: 3000, // Customize how long the notification stays
        hideProgressBar: false, // Show/hide progress bar
        closeOnClick: true, // Close the notification when clicked
        pauseOnHover: true, // Pause the timer when hovering
        draggable: true, // Make the notification draggable
        progress: undefined, // Use your custom progress bar
        // Add more customization options as needed
      });
    //navigate("/", { state: { id: device.id } });
  };

  const loadDevice = async () => {
    const result = await axios.get(`http://localhost:8081/device/${id}`);
    setDevice(result.data);
    setUpdatedDevice(result.data); // Set the updatedDevice to the current values
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Edit device</h2>

          <form onSubmit={(e) => onSubmit(e)}>
            <div className="form-group">
              <label>
                <b>Description</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="description"
                placeholder={device.description}
                value={updatedDevice.description}
                onChange={(event) =>
                    
                  setUpdatedDevice({
                    ...updatedDevice,
                    description: event.target.value,
                  })
                  
                }
              />
            </div>

            <div className="form-group">
              <label>
                <b>Address</b>
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder={device.address}
                value={updatedDevice.address}
                onChange={(event) =>
                  setUpdatedDevice({
                    ...updatedDevice,
                    address: event.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label>
                <b>Max Hourly Consumption</b>
              </label>
              <input
                type="number" // Change the input type to "number"
                className="form-control"
                id="maxHourlyConsumption"
                placeholder={device.maxHourlyConsumption}
                value={updatedDevice.maxHourlyConsumption}
                onChange={(event) =>
                  setUpdatedDevice({
                    ...updatedDevice,
                    maxHourlyConsumption: parseInt(event.target.value)
                  })
                }
              />
            </div>

            <button type="submit" className="btn btn-pink mt-4"  valuelue={ updatedDevice.maxConsumption} onClick={onSubmit}>
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateDevice;
