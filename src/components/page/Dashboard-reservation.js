import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import './Home.css'
import emailjs from '@emailjs/browser';

const DashboardReservation = () => {
   
    const [auth, setAuth] = useState('');
    let navigate = useNavigate(); // Use for Navigate on Previous
    useEffect(() => {
        var auth = localStorage.getItem('email');
        setAuth(auth);
    }, []);

    if (auth === null) {
        navigate(`/admin`);
    }

    const [reservation, setReservation] = useState([]);
    const [activeKey, setActiveKey] = useState(null);
    useEffect(() => {
        getReservation();
    }, []);

    function getReservation() {
        axios.get('http://localhost:80/api/reservation.php/').then(function (odpowiedz) {
            setReservation(odpowiedz.data);
        });
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
        };

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
                console.log(response.data);
                getReservation();
            });
    };
    const date = new Date();
    date.setDate(date.getDate());
    const minDate = date.toISOString().slice(0, 10);
    console.log(minDate);
    return (
        <div className='panel-admin-reservation'>
           
            <div className='dashboard-reservation-wrapper'>
            <h1>Rezerwacje</h1>
            <Link className='add-dish-go-back-link link-reservation' to='/dashboard'>Powrót do poprzedniej strony</Link>
            <div className='class'>
                <div className='today-reservation'>
                    <h2 className='reservation-headline'>Dzisiejsze rezerwacje</h2>
                    {reservation.map((reserv, key) => (
                        <Accordion activeKey={activeKey} onSelect={(eventKey) => setActiveKey(eventKey)}>
                            {reserv.date === minDate ? (
                                <div key={key}>
                                    <Accordion.Item eventKey={key} >
                                        <Accordion.Header className={reserv.status === "NIEPOTWIERDZONE" ? "unconfirmed" : "confirmed"}>{reserv.name} {reserv.surname} - {reserv.date}</Accordion.Header>
                                        <Accordion.Body>
                                            <div>
                                                <p>Email: {reserv.email} </p>
                                                <p>Telefon: {reserv.phone} </p>
                                                <p>Liczba gości: {reserv.guests} </p>
                                                <p>Data: {reserv.date}</p>
                                                <p>Godzina: {reserv.time}</p>
                                                <p>Status rezerwacji: {reserv.status}</p>
                                                {reserv.status === "NIEPOTWIERDZONE" ? (
                                                    <button onClick={() => sendEmail(reserv.email, reserv.id, reserv.name, reserv.surname, reserv.guests, reserv.phone, reserv.date, reserv.time, "POTWIERDZONA")}>
                                                        Potwierdź
                                                    </button>
                                                ) : (
                                                    <div></div>
                                                )}
                                                <Link className='edit-link' to={`reservation/${reserv.id}/edit`} style={{ marginRight: "10px" }}>
                                                    Edytuj
                                                </Link>
                                                <button className='btn-delete' onClick={() => deleteReservation(reserv.id)}>Usuń</button>

                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </Accordion>
                    ))}
                </div>

                <div className='reservations-confirmed'>
                    <h2 className='reservation-headline'>Niepotwierdzone rezerwacje</h2>
                    {reservation.map((reserv, key) => (
                        <Accordion activeKey={activeKey} onSelect={(eventKey) => setActiveKey(eventKey)}>
                            {reserv.status === "NIEPOTWIERDZONE" & reserv.date != minDate ? (
                                <div key={key}>
                                    <Accordion.Item eventKey={key}>
                                        <Accordion.Header>{reserv.name} {reserv.surname} - {reserv.date}</Accordion.Header>
                                        <Accordion.Body>
                                            <div>
                                                <p>Email: {reserv.email} </p>
                                                <p>Telefon: {reserv.phone} </p>
                                                <p>Liczba gości: {reserv.guests} </p>
                                                <p>Data: {reserv.date}</p>
                                                <p>Godzina: {reserv.time}</p>
                                                <p>Status rezerwacji: {reserv.status}</p>
                                                {reserv.status === "NIEPOTWIERDZONE" ? (
                                                    <button className='btn-confirmed' onClick={() => sendEmail(reserv.email, reserv.id, reserv.name, reserv.surname, reserv.guests, reserv.phone, reserv.date, reserv.time, "POTWIERDZONA")}>
                                                        Potwierdź
                                                    </button>
                                                ) : (
                                                    <div></div>
                                                )}
                                                <Link className='edit-link' to={`reservation/${reserv.id}/edit`} style={{ marginRight: "10px" }}>
                                                    Edytuj
                                                </Link>
                                                <button className='btn-delete' onClick={() => deleteReservation(reserv.id)}>Usuń</button>

                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </Accordion>
                    ))}
                </div>

                <div className='reservations-unconfirmed'>
                    <h2 className='reservation-headline'>Potwierdzone rezerwacje</h2>
                    {reservation.map((reserv, key) => (
                        <Accordion activeKey={activeKey} onSelect={(eventKey) => setActiveKey(eventKey)}>
                            {reserv.status === "POTWIERDZONA" & reserv.date != minDate ? (
                                <div key={key}>
                                    <Accordion.Item eventKey={key}>
                                        <Accordion.Header>{reserv.name} {reserv.surname} - {reserv.date}</Accordion.Header>
                                        <Accordion.Body>
                                            <div>
                                                <p>Email: {reserv.email} </p>
                                                <p>Telefon: {reserv.phone} </p>
                                                <p>Liczba gości: {reserv.guests} </p>
                                                <p>Data: {reserv.date}</p>
                                                <p>Godzina: {reserv.time}</p>
                                                <p>Status rezerwacji: {reserv.status}</p>
                                                {reserv.status === "NIEPOTWIERDZONE" ? (
                                                    <button onClick={() => sendEmail(reserv.email, reserv.id, reserv.name, reserv.surname, reserv.guests, reserv.phone, reserv.date, reserv.time, "POTWIERDZONA")}>
                                                        Potwierdź
                                                    </button>
                                                ) : (
                                                    <div></div>
                                                )}
                                                <Link className='edit-link' to={`reservation/${reserv.id}/edit`} style={{ marginRight: "10px" }}>
                                                    Edytuj
                                                </Link>
                                                <button className='btn-delete' onClick={() => deleteReservation(reserv.id)}>Usuń</button>

                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </div>
                            ) : (
                                <div></div>
                            )}
                        </Accordion>
                    ))}
                </div>



            </div>
        </div>
        </div>
    );
};

export default DashboardReservation;