import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DeleteAccount()
{
    const navigate = useNavigate();
    const { email } = useParams();
    console.log(email);
    const deleteAcc = async() =>
    {
        await axios.post(`http://localhost:8080/person/delete/${email}`);
        toast("Account deleted");
        navigate("/clientHome");
       // keycloak.logout({ redirectUri: `http://localhost:3000` });
    }
    
    return (
        <div>
            <h1>Are you sure you want to delete this account</h1>
            <p>Press here to permanently delete your account</p>
            <button className="btn btn-outline-pink mx-2" onClick={deleteAcc}>Delete</button>
        </div>
        

    );
}
export default DeleteAccount;