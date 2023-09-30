import React, { useEffect, useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import './Home.css';

function NewOrder() {
  const [auth, setAuth] = useState('');
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [tableNumberError, setTableNumberError] = useState(false);
  const [menuError, setMenuError] = useState(false); 

  let nav = useNavigate();

  useEffect(() => {
    var auth = localStorage.getItem('email');
    setAuth(auth);
  }, []);

  useEffect(() => {
    getMenu();
  }, []);

  function getMenu() {
    axios.get('http://localhost:80/api/menu/').then(function (response) {
      setMenu(response.data);
    });
  }

  const addToOrder = (dish) => {
    const price = parseFloat(dish.price);

    setOrder((prevOrder) => {
      const existingDish = prevOrder.find((item) => item.name === dish.name);

      if (existingDish) {
        const updatedOrder = prevOrder.map((item) => {
          if (item.name === dish.name) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
        return updatedOrder;
      } else {
        return [...prevOrder, { ...dish, quantity: 1 }];
      }
    });

    setTotalPrice((prevTotalPrice) =>
      parseFloat((prevTotalPrice + price).toFixed(2))
    );
  };

  const removeFromOrder = (dish) => {
    if (dish.quantity === 1) {
      setOrder((prevOrder) => prevOrder.filter((item) => item.name !== dish.name));
    } else {
      setOrder((prevOrder) =>
        prevOrder.map((item) => {
          if (item.name === dish.name) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
      );
    }

    const price = parseFloat(dish.price);

    setTotalPrice((prevTotalPrice) =>
      parseFloat((prevTotalPrice - price).toFixed(2))
    );
  };

  const sendOrder = () => {
    // Sprawdź czy numer stolika jest poprawny (w przedziale 1-30)
    if (tableNumber < 1 || tableNumber > 30) {
      setTableNumberError(true);
      return;
    } else {
      setTableNumberError(false);
    }

    // Sprawdź czy zamówienie zawiera co najmniej jedno danie
    if (order.length === 0) {
      setMenuError(true);
      return;
    } else {
      setMenuError(false);
    }

    const orderData = {
      tableNumber: tableNumber,
      items: order.map((item) => ({
        dishName: item.name,
        quantity: item.quantity || 1,
      })),
      totalPrice: totalPrice,
      notes: notes,
    };

    axios
      .post('http://localhost:80/api/orders.php', orderData)
      .then(function (response) {
        nav('/dashboard-orders');
      
      })
      .catch(function (error) {
        console.error('Błąd podczas wysyłania zamówienia:', error);
      });
  };

  return (
    <div className="orders-wrapper-new">
      <div>
        <h1 className='new-order-headline'>Nowe zamówienie</h1>
        <Link className='btn-go-back' to='/dashboard-orders'>Powrót do zamówień</Link>
        <div className='new-order-wrapper'>
          <div className="new-order">
            <div className='table-number'>
              <h2>Numer stolika</h2>
              <input
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
              ></input>
              {tableNumberError && (
                <p className="error-message">Numer stolika musi być w przedziale 1-30</p>
              )}
            </div>
            <h2>Lista zamówionych dań: </h2>
            <ul>
              {order.map((orderedDish, index) => (
                <li key={orderedDish.order_id}>
                  {orderedDish.name} - {orderedDish.price} zł ({orderedDish.quantity}x){' '}
                  <button className='remove-dish-from-order' onClick={() => removeFromOrder(orderedDish)}>-</button>
                </li>
              ))}
            </ul>
            {menuError && (
              <p className="error-message">Dodaj co najmniej jedno danie do zamówienia</p>
            )}
            <h2>Uwagi</h2>
            <textarea
              rows="4"
              cols="50"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
            <p className='total-price'>Łączna cena zamówienia: <strong>{totalPrice} zł</strong></p>
            <button className='btn-add-dish' onClick={sendOrder}>Dodaj zamówienie</button>
          </div>
         
            <div className='dashboard-menu-wrapper'>
           
                <Accordion defaultActiveKey="0">
                <div className='starters-wrapper'>
                <Accordion.Item eventKey="0">
                <Accordion.Header>Przystawki</Accordion.Header>  
                <Accordion.Body>
                {menu.filter(dish => dish.type === "Przystawka").map((filteredDish, key) => (
                    <div className='according-element' key={key} >
                        <div className='dish-wrapper'>
                            <h3 className="order-item"><div className='according-element-btn'><button onClick={() => addToOrder(filteredDish)} className="order-add-dish">+</button></div><div className="order-dish-name">{filteredDish.name} - {filteredDish.price} zł </div></h3>
                        </div>
                        <div className='dish-ingredients'> <p>{filteredDish.ingredients} </p></div>
                        
                            <hr></hr>
                    </div>
                ))}
                </Accordion.Body>
                </Accordion.Item>
                </div>
                
                <div className='main-dish-wrapper'>
                <Accordion.Item eventKey="1">
                <Accordion.Header>Danie główne</Accordion.Header> 
                <Accordion.Body>
                {menu.filter(dish => dish.type === "Danie główne").map((filteredDish, key) => (
                    <div className='according-element' key={key} >
                        <div className='dish-wrapper'>
                        <h3 className="order-item"><div className='according-element-btn'><button onClick={() => addToOrder(filteredDish)} className="order-add-dish">+</button></div><div className="order-dish-name">{filteredDish.name} - {filteredDish.price} zł </div></h3>
                        </div>
                        <div className='dish-ingredients'> <p>{filteredDish.ingredients}</p></div>
                        <hr></hr>
                    </div>
                ))}
                </Accordion.Body>
                </Accordion.Item>
                </div>
                <div className='soup-wrapper'>
                <Accordion.Item eventKey="2">
                <Accordion.Header>Zupy</Accordion.Header>
                <Accordion.Body>
                
                {menu.filter(dish => dish.type === "Zupa").map((filteredDish, key) => (
                    <div className='according-element' key={key} >
                        <div className='dish-wrapper'>
                        <h3 className="order-item"><div className='according-element-btn'><button onClick={() => addToOrder(filteredDish)} className="order-add-dish">+</button></div><div className="order-dish-name">{filteredDish.name} - {filteredDish.price} zł </div></h3>
                        </div>
                        <div className='dish-ingredients'><p>{filteredDish.ingredients}</p></div>
                        <hr></hr>
                    </div>
                    
                ))}
                
                </Accordion.Body>
                </Accordion.Item>
                </div>
                </Accordion>

                
            </div>
        </div>
        </div>
        </div>
    )
}

export default NewOrder;