import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios';
import './Home.css'

const DashboardMenu = () => {
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

    useEffect(() => {
        getMenu();
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
    return (
        <div className='panel-admin-menu'>
           
            <div className='dashboard-menu-wrapper'>
                <h1>Zarządzanie menu</h1>
                <Link className='btn-add-dish' to="/dashboard/add-dish">Dodaj Danie +</Link>
                <Accordion defaultActiveKey="0">
                <div className='starters-wrapper'>
                <Accordion.Item eventKey="0">
                <Accordion.Header>Przystawki</Accordion.Header>  
                <Accordion.Body>
                {menu.filter(dish => dish.type === "Przystawka").map((filteredDish, key) => (
                    <div className='according-element' key={key} >
                        <div className='dish-name'>
                            <h3 >{filteredDish.name} - {filteredDish.price} zł </h3>
                        </div>
                        <div className='dish-ingredients'> <p>{filteredDish.ingredients} </p></div>
                            <Link className='edit-link' to={`menu/${filteredDish.id}/edit`} style={{ marginRight: "10px" }}>Edit</Link>
                            <button className='btn-delete' onClick={() => deleteDish(filteredDish.id)}>Delete</button>
                        
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
                        <div className='dish-name'>
                        <h3 >{filteredDish.name} - {filteredDish.price} zł </h3>
                        </div>
                        <div className='dish-ingredients'> <p>{filteredDish.ingredients}</p></div>
                        <Link className='edit-link' to={`menu/${filteredDish.id}/edit`} style={{ marginRight: "10px" }}>Edit</Link>
                        <button className='btn-delete' onClick={() => deleteDish(filteredDish.id)}>Delete</button>
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
                        <div className='dish-name'>
                        <h3 >{filteredDish.name} - {filteredDish.price} zł </h3>
                        </div>
                        <div className='dish-ingredients'><p>{filteredDish.ingredients}</p></div>
                        <Link className='edit-link' to={`menu/${filteredDish.id}/edit`} style={{ marginRight: "10px" }}>Edit</Link>
                        <button className='btn-delete' onClick={() => deleteDish(filteredDish.id)}>Delete</button>
                        <hr></hr>
                    </div>
                    
                ))}
                
                </Accordion.Body>
                </Accordion.Item>
                </div>
                </Accordion>

                <Link className='btn-go-back' to='/dashboard'>Powrót do dashboard</Link>
            </div>
        </div>
    )
}
export default DashboardMenu;