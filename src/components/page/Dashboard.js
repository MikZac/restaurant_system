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

    const [menu, setMenu] = useState([]);
    const [reservation, setReservation] = useState([]);

    useEffect(() => {
        getMenu();
    }, []);
    useEffect(() => {
        getReservation();
    }, []);

    function getMenu() {
        axios.get('http://localhost:80/api/menu/').then(function (response) {
            setMenu(response.data);
        });
    }
    const deleteDish = (id) => {
        axios.delete(`http://localhost:80/api/menu/${id}/delete`).then(function (response) {
            getMenu();
        });
    }
    function getReservation() {
        axios.get('http://localhost:80/api/reservation.php/').then(function (odpowiedz) {
            setReservation(odpowiedz.data);
        })
    }
    const deleteReservation = (id) => {
        axios.delete(`http://localhost:80/api/reservation.php/${id}/delete`).then(function (response) {
            getReservation();
        });
    }

    const sendEmail = (email, id, name, surname, guests, phone, date, time, status) => {
        var templateParams = {
            id: id,
            email: email,
            name: name,
            surname: surname,
            guests: guests,
            phone: phone,
            date: date,
            time: time

        }
        console.log(templateParams);

        emailjs.send('service_zky5ydp', 'template_8ix73uq', templateParams, 'vab5-4Cb_EoliyDQh')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });

        axios.put(`http://localhost:80/api/editreservation.php/${id}/edit`, { id: id, status: status }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                console.log(response.data)
                getReservation();
            });
    };


    return (
        <div className='dashboard-wrapper'>
        <div className='panel-admin'>
            <h1 className='panel-admin-title'>Dashboard</h1>
            <div className='option-boxes'>
            <div className='dashboard-menu-box'>
            <h2><Link to="/dashboard-menu">Zarządzaj menu</Link></h2>
                </div>
            <div className='dashboard-reservation-box'><h2><Link to="/dashboard-reservation">Rezerwacje</Link></h2>
            </div>
            </div>
            <Link className='btn-go-back' to='/'>Powrót do strony głównej</Link>
        </div>
        </div>
    )
}

export default Dashboard;