import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'
import emailjs from '@emailjs/browser';
const Dashboard = () => {
    const [auth, setAuth] = useState('');
    let navigate = useNavigate(); // Use for Navigate on Previous
    useEffect(() => {
        var auth = localStorage.getItem('email');
        setAuth(auth);
    },
        [])
    if (auth === null) {
        navigate(`/admin`);
    }
    
    return (
        <div className='dashboard-wrapper'>
        <div className='panel-admin'>
            <h1 className='panel-admin-title'>Dashboard</h1>
            <div className='option-boxes'>
    
            <Link className='dashboard-menu-box' to="/dashboard-menu"><h2>Menu</h2></Link>
            
            <Link className='dashboard-reservation-box' to="/dashboard-reservation"><h2>Rezerwacje</h2></Link>
            
            
            </div>
            <div className='option-boxes'>
            <Link className='dashboard-reservation-box' to="/dashboard-calculator"><h2>Kalkulator</h2></Link>
            <Link className='dashboard-reservation-box' to="/dashboard-orders"><h2>Zamówienia</h2></Link>
            </div>
            <Link className='btn-go-back' to='/'>Powrót do strony głównej</Link>
        </div>
        </div>
    )
}

export default Dashboard;