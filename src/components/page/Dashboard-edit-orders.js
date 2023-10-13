import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function EditOrder() {
  // const [auth, setAuth] = useState('');
  const [menu, setMenu] = useState([]);
  const [order, setOrder] = useState({
    nr_zamowienia: '',
    nr_stolika: '',
    data_zamowienia: '',
    notatki: '',
    dania: [],
  });
  const [totalPrice, setTotalPrice] = useState(0.0);
  const { id } = useParams();
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [position, setPosition] = useState([])
  const [tableNumberError, setTableNumberError] = useState(false);
  const [menuError, setMenuError] = useState(false); 

  let nav = useNavigate();

  // useEffect(() => {
  //   const auth = localStorage.getItem('email');
  //   setAuth(auth);
  // }, []);

  useEffect(() => {
    getMenu();
    getOrder();
    getPosition();
  }, []);

  function getMenu() {
    axios.get('http://localhost:80/api/menu/').then(function (response) {
      setMenu(response.data);
    });
  }
  function getPosition() {
    axios.get(`http://localhost:80/api/orders-position.php?id_zamowienia=${id}`).then(function (response) {
      setPosition(response.data);
    });
  }

  const getOrder = () => {
    axios
      .get(`http://localhost:80/api/orders.php?id_zamowienia=${id}`)
      .then(function (response) {
        const data = response.data;
  
        // Sprawdzanie, czy są dane zamówienia
        if (data.length === 0) {
          console.error('Brak danych zamówienia.');
          return;
        }
  
        // Tworzenie obiektu zamówienia
        const orderObject = {
          nr_zamowienia: data[0].nr_zamowienia,
          nr_stolika: data[0].nr_stolika,
          data_zamowienia: data[0].data_zamowienia,
          notatki: data[0].notatki,
          dania: data.map((item) => ({
            id: item.id_dania,
            name: item.nazwa_dania,
            price: parseFloat(item.cena_dania),
            ilosc: parseInt(item.ilosc, 10),
            ingredients: item.opis_dania,
            type: item.typ_dania,
            status: item.status,
            wartosc: item.wartosc,
          })),
        };
  
        setOrder(orderObject);
  
        // Ustawienie domyślnych wartości
        setTableNumber(orderObject.nr_stolika || '');
        setTotalPrice(calculateTotalPrice(orderObject.dania));
        setNotes('');
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const calculateTotalPrice = (dishes) => {
    if (!dishes) return 0;
  
    const totalPrice = dishes.reduce((total, item) => {
      return total + parseFloat(item.price) * parseFloat(item.ilosc);
    }, 0);
  
    return totalPrice.toFixed(2);
  };

  const updateNotes = (event) => {
    const newNotes = event.target.value;
    setOrder({ ...order, notatki: newNotes });
  };

  const addToOrder = (dish) => {
    const updatedOrder = [...order.dania];

    const existingDishIndex = updatedOrder.findIndex(
      (item) => item.name === dish.name
    );

    if (existingDishIndex !== -1) {
      updatedOrder[existingDishIndex].ilosc += 1;
    } else {
      updatedOrder.push({ ...dish, ilosc: 1 });
    }

    setOrder({ ...order, dania: updatedOrder });
    setTotalPrice(calculateTotalPrice(updatedOrder));
  };

  const removeFromOrder = (dish) => {
  const updatedOrder = [...order.dania];

  const existingDishIndex = updatedOrder.findIndex(
    (item) => item.name === dish.name
  );

  if (existingDishIndex !== -1) {
    if (updatedOrder[existingDishIndex].ilosc === 1) {
      updatedOrder.splice(existingDishIndex, 1);
    } else {
      updatedOrder[existingDishIndex].ilosc -= 1;
    }

    setOrder({ ...order, dania: updatedOrder });
    setTotalPrice(calculateTotalPrice(updatedOrder));
  }
};

const validateTableNumber = () => {
  if (tableNumber < 1 || tableNumber > 30) {
    return false;
  }
  return true;
};

const validateOrder = () => {
  if (order.dania.length === 0) {
    return false;
  }
  return true;
};

const sendOrder = () => {
  // Sprawdź poprawność numeru stolika
  if (!validateTableNumber()) {
    setTableNumberError(true);
    return;
  } else {
    setTableNumberError(false);
  }

  // Sprawdź czy zamówienie zawiera co najmniej jedno danie
  if (!validateOrder()) {
    setMenuError(true);
    return;
  } else {
    setMenuError(false);
  }

  const orderData = {
    id_zamowienia: id,
    tableNumber: tableNumber,
    notes: order.notatki,
    items: order.dania.map((item) => {
      const matchingPosition = position.find(
        (positionItem) => positionItem.id_dania === item.id
      );
      return {
        id_dania: item.id,
        id_pozycji: matchingPosition ? matchingPosition.id : null,
        ilosc: item.ilosc || 1,
        dishName: item.name,
      };
    }),
    totalPrice: totalPrice,
  };

  axios
    .put(`http://localhost:80/api/orders.php?id_zamowienia=${id}`, orderData)
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
      <h1 className="new-order-headline">Edytuj zamówienie</h1>
      <Link className="btn-go-back" to="/dashboard-orders">
        Powrót do zamówień
      </Link>
      <div className="new-order-wrapper">
        <div className="new-order">
          <h2>Zamówione dania:</h2>
          <div className="table-number">
            <label>Numer stolika</label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
            ></input>
            {!validateTableNumber() && (
              <p className="error-message">
                Numer stolika musi być w przedziale 1-30
              </p>
            )}
          </div>
          <h2>Lista zamówionych dań: </h2>
          <ul>
            {order.dania &&
              order.dania.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.price} ({item.ilosc}x){' '}
                  <button
                    className="remove-dish-from-order"
                    onClick={() => removeFromOrder(item)}
                  >
                    -
                  </button>{' '}
                </li>
              ))}
          </ul>
          {menuError && (
            <p className="error-message">
              Dodaj co najmniej jedno danie do zamówienia
            </p>
          )}
          <h2>Uwagi</h2>
          <textarea
            rows="4"
            cols="50"
            value={order.notatki}
            onChange={updateNotes}
          ></textarea>
          <p className="total-price">
            Łączna cena zamówienia:<strong> {totalPrice} zł</strong>
          </p>
          <button className="btn-add-dish" onClick={sendOrder}>
            Edytuj zamówienie
          </button>
        </div>

      <div className="dashboard-menu-wrapper">
        <Accordion defaultActiveKey="0">
          <div className="starters-wrapper">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Przystawki</Accordion.Header>
              <Accordion.Body>
                {menu
                  .filter((dish) => dish.type === 'Przystawka')
                  .map((filteredDish, key) => (
                    <div className="according-element" key={key}>
                      <div className="dish-wrapper">
                      <h3 className="order-item">
                        <div className='according-element-btn'>
                          <button onClick={() => addToOrder(filteredDish)} 
                          className="order-add-dish">+</button>
                          </div>
                          <div className="order-dish-name">{filteredDish.name} - {filteredDish.price} zł 
                          </div>
                          </h3>
                      </div>
                      <div className="dish-ingredients">
                        <p>{filteredDish.ingredients}</p>
                      </div>
                      <hr></hr>
                    </div>
                  ))}
              </Accordion.Body>
            </Accordion.Item>
          </div>

          <div className="main-dish-wrapper">
            <Accordion.Item eventKey="1">
              <Accordion.Header>Danie główne</Accordion.Header>
              <Accordion.Body>
                {menu
                  .filter((dish) => dish.type === 'Danie główne')
                  .map((filteredDish, key) => (
                    <div className="according-element" key={key}>
                      <div className="dish-wrapper">
                      <h3 className="order-item">
                        <div className='according-element-btn'>
                          <button onClick={() => addToOrder(filteredDish)} 
                          className="order-add-dish">+</button>
                          </div>
                          <div className="order-dish-name">{filteredDish.name} - {filteredDish.price} zł 
                          </div>
                          </h3>
                      </div>
                      <div className="dish-ingredients">
                        <p>{filteredDish.ingredients}</p>
                      </div>
                      <hr></hr>
                    </div>
                  ))}
              </Accordion.Body>
            </Accordion.Item>
          </div>

          <div className="soup-wrapper">
            <Accordion.Item eventKey="2">
              <Accordion.Header>Zupy</Accordion.Header>
              <Accordion.Body>
                {menu
                  .filter((dish) => dish.type === 'Zupa')
                  .map((filteredDish, key) => (
                    <div className="according-element" key={key}>
                      <div className="dish-wrapper">
                      <h3 className="order-item">
                        <div className='according-element-btn'>
                          <button onClick={() => addToOrder(filteredDish)} 
                          className="order-add-dish">+</button>
                          </div>
                          <div className="order-dish-name">{filteredDish.name} - {filteredDish.price} zł 
                          </div>
                          </h3>
                      </div>
                      <div className="dish-ingredients">
                        <p>{filteredDish.ingredients}</p>
                      </div>
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
  );
}

export default EditOrder;