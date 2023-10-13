import React from "react";
import '../page/Home.css';
import Logout from "../page/image/logout.png"
import UserGear from "../page/image/user-gear.png"
import { useAuth } from '../page/AuthContext';
import { useNavigate } from 'react-router-dom';


const PanelAdmin = () => {
    const { userEmail, setUserEmail } = useAuth();
    const navigate = useNavigate();
  
    const handleLogout = () => {
      // Wylogowanie użytkownika
      localStorage.removeItem('email');
      setUserEmail(null);
      navigate('/'); // Przekieruj na stronę logowania lub inny odpowiedni ekran
    };
  
    const handleDashboard = () => {
      // Przejdź do dashboardu
      navigate('/dashboard');
    };
  
    return (
      <div className="panel-admin-icon">
        {userEmail && (
          <>
            <img src={UserGear} alt="Dashboard" onClick={handleDashboard} />
            <img src={Logout} alt="Wyloguj" onClick={handleLogout} />
          </>
        )}
      </div>
    );
  };
  
  export default PanelAdmin;