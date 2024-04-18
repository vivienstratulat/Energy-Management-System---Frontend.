import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import ClientHome from './components/ClientHome';
import ClientAccount from './components/ClientAccount';
import DeleteAccount from './components/DeleteAccount';
import UpdateClient from './components/UpdateClient';
import AdminHome from './components/Admin/AdminHome';
import ClientDetails from './components/Admin/ClientDetails';
import RegisterClient from './components/Admin/RegisterClient';
import AddDevice from './components/Admin/AddDevice';
import SeeDevices from './components/SeeDevices';
import SeeClientDevices from './components/Admin/SeeClientDevices';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS styles
import UpdateDevice from './components/Admin/UpdateDevice';
import ClientH from './components/ClientH';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import SeeGraph from './components/SeeGraph';
import Chat from './components/Chat';
import AdminChat from './components/Admin/AdminChat';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/clientHome" element={<ClientHome/>} />
        <Route path="/account/:email" element={<ClientAccount />} />
        <Route path="/delete-acc/:email" element={<DeleteAccount />} />
        <Route path="/update-client/:email" element={<UpdateClient />} />
        <Route path="/adminHome" element={<AdminHome/>} />
        <Route path="client-details/:email" element={<ClientDetails/>} />
        <Route path="register-client" element={<RegisterClient/>} />
        <Route path="addDevice/:email" element={<AddDevice/>} />
        <Route path="SeeDevices/:externalId" element={<SeeDevices/>} />
        <Route path="seeClientDevices/:externalId" element={<SeeClientDevices/>} />
        <Route path="updateDevice/:id" element={<UpdateDevice/>} />
        <Route path="/clientH" element={<ClientH/>} />
        <Route path="/SeeDeviceConsumption/:deviceId" element={<SeeGraph/>} />
        <Route path="chat/:email" element={<Chat/>} />
        <Route path="adminChat/:email" element={<AdminChat/>} />
      </Routes>
      <ToastContainer /> {/* Add this line to display notifications */}
    </Router>
  );
}

export default App;