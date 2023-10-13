import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import './Home.css';

function Orders() {
    // const [auth, setAuth] = useState('');
    // let nav = useNavigate();

    // useEffect(() => {
    //     var auth = localStorage.getItem('email');
    //     setAuth(auth);
    // }, []);

    // if (auth === null) {
    //     nav(`/admin`);
    // }

    const [orders, setOrders] = useState([]);
    const [activeKey, setActiveKey] = useState(null);
    const [activeKeySecond, setActiveKeySecond] = useState(null);

    useEffect(() => {
        getOrders();
    }, []);

    function getOrders() {
        axios.get('http://localhost:80/api/orders.php').then(function (response) {
            setOrders(response.data);
        });
    }

    function handleAccordionChange(eventKey) {
        setActiveKey(eventKey === activeKey ? null : eventKey);
    }

    function handleAccordionChangeSecond(eventKey) {
        setActiveKeySecond(eventKey === activeKeySecond ? null : eventKey);
    }

    const cancelOrder = (id_zamowienia) => {
        const data = {
            id_zamowienia: id_zamowienia, // Poprawione na id_zamowienia
            status: 'ANULOWANE'
        };
        axios.put(`http://localhost:80/api/editcalculator.php`, data).then(function (response) {
            getOrders();
        });
    }
    
    const completeOrder = (id_zamowienia) => {
        const data = {
            id_zamowienia: id_zamowienia, // Poprawione na id_zamowienia
            status: 'ZAKOŃCZONE'
        };
        axios.put(`http://localhost:80/api/editcalculator.php`, data).then(function (response) {
            getOrders();
        });
    }
    const deleteOrder = (id_zamowienia) => {
        axios.delete(`http://localhost:80/api/orders.php?id_zamowienia=${id_zamowienia}`)
            .then(function (response) {
                getOrders();
            })
            .catch(function (error) {
                console.error("Błąd podczas usuwania zamówienia: ", error);
            });
    }

    

    return (
        <div className="orders-wrapper">
            <div>
            <div className="orders">
                <h1>Zamówienia</h1>
                <div className='orders-btn'>
                <Link className='btn-add-dish add-order' to="/dashboard-orders/add-order">Nowe zamówienie</Link>
                <Link className='add-order btn-go-back' to="/dashboard">Powróć do panelu</Link>
                </div>
                
                <div className="active-orders">
                    <h2 className='orders-headline'>Aktualne zamówienia</h2>
                    {orders
                        .filter(order => order.status === 'AKTYWNE')
                        .map((order, key) => (
                            <Accordion key={key} activeKey={activeKey} onSelect={handleAccordionChange}>
                                <div key={key}>
                                <Accordion.Item eventKey={key} >
                                    <Accordion.Header>
                                        <h3>Zamówienie NR #{order.id_zamowienia} | Stolik {order.nr_stolika}</h3>
                                    </Accordion.Header>
                                    <Accordion.Body>

                                        <div className="order-detail">
                                            {order.dania.map((dish, dishKey) => (
                                                <p key={dishKey}><strong>{dish.nazwa_dania}</strong> | Cena za szt. <strong>{dish.cena_dania}</strong>  Ilość: <strong>x{dish.ilosc}</strong>  Typ: <strong>{dish.typ_dania}</strong> </p>
                                            ))}
                                            <hr></hr>
                                            <p>Stolik: {order.nr_stolika}</p>
                                            <p>Status: {order.status}</p>
                                            <p>Data zamówienia: {order.data_zamowienia}</p>
                                            <p>Uwagi: {order.notatki}</p>
                                            <p>Koszt zamówienia: <strong>{order.wartosc}</strong></p>
                                            <button className='btn-confirmed' onClick={() => completeOrder(order.id_zamowienia)}>Zakończ</button>
                                            <Link className='edit-link' to={`edit/${order.id_zamowienia}`}>Edytuj</Link>
                                            <button className='btn-delete' onClick={() => cancelOrder(order.id_zamowienia)}>Anuluj</button>
                                        </div>

                                    </Accordion.Body>
                                </Accordion.Item>
                                </div>
                            </Accordion>
                        ))}
                </div>
                <div className="historic-orders">
                    <h2 className='orders-headline'>Historia zamówień</h2>
                    {orders
                        .filter(order => order.status !== 'AKTYWNE')
                        .map((order, key) => (
                            <Accordion key={key} activeKey={activeKeySecond} onSelect={handleAccordionChangeSecond}>
                                <div key={key}>
                                <Accordion.Item eventKey={key} >
                                    <Accordion.Header>
                                        <h3>Zamówienie NR #{order.id_zamowienia} | Stolik {order.nr_stolika}</h3>
                                    </Accordion.Header>
                                    <Accordion.Body>

                                        <div className="order-detail">
                                            {order.dania.map((dish, dishKey) => (
                                                <p key={dishKey}><strong>{dish.nazwa_dania}</strong> | Cena za szt. <strong>{dish.cena_dania}</strong>  Ilość: <strong>x{dish.ilosc}</strong>  Typ: <strong>{dish.typ_dania}</strong> </p>
                                            ))}
                                            <hr></hr>
                                            <p>Stolik: {order.nr_stolika}</p>
                                            <p>Status: {order.status}</p>
                                            <p>Data zamówienia: {order.data_zamowienia}</p>
                                            <p>Koszt zamówienia: <strong>{order.wartosc}</strong></p>
                                            <button className='btn-delete' onClick={() => deleteOrder(order.id_zamowienia)}>Usuń</button>
                                        </div>

                                    </Accordion.Body>
                                </Accordion.Item>
                                </div>
                            </Accordion>
                        ))}
                </div>
            </div>
            </div>
        </div>
    );
}

export default Orders;