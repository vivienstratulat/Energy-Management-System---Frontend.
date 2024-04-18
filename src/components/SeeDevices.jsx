import React, { useEffect, useState} from "react";
import { useParams,Link  } from "react-router-dom";
import axios from "axios";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

function SeeDevices() {
  const { externalId } = useParams();
  const [devices, setDevices] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  const initializeWebSocket = () => {
    const socket = new SockJS('http://localhost:8086/websocket');
    const stompClient = Stomp.over(socket);
    stompClient.withCredentials = true;

    stompClient.connect({}, () => {
      stompClient.subscribe('/queue/'+externalId, (message) => {
        console.log("/queue/"+externalId);
        
       
        const measurement = JSON.parse(message.body);
        
        setMeasurements(prevMeasurements => [...prevMeasurements, measurement]);
        console.log("device iddddddd= ", measurement.device_id);
        console.log("Received measurement:", measurement); 
        if (measurement.flag === 1) {
          toast("The maximum consumption has been exceeded!! for device with id "+ measurement.device_id, { autoClose: 6000 });
        }
      });
    });

    // Remember to disconnect the WebSocket in the cleanup function
    return () => {
      stompClient.disconnect();
    };
  };

  const loadDevices = async () => {
    try {
      const result = await axios.get(
        `http://localhost:8081/device/getByClientId/${externalId}`,
      );
      setDevices(result.data);
    } catch (error) {
      console.error("Error loading devices:", error);
    }
  };

  useEffect(() => {
    loadDevices();
    const cleanupWebSocket = initializeWebSocket();

    return () => {
      cleanupWebSocket();
    };
  }, [externalId]);

  return (
    <div className="container">
      <div className="py-4">
        <div className="col text-center">
          <b>
            <h1 className="pink-with-contour-and-shadow">Your Devices</h1>
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
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{device.description}</td>
                <td>{device.address}</td>
                <td>{device.maxHourlyConsumption}</td>
                <td> <Link
                    className="btn btn-pink mx-2"
                    to={`/SeeDeviceConsumption/${device.id}`}
                  >
                    View consumption
                  </Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SeeDevices;
