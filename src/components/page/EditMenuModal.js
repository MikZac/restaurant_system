import React, { useState, useEffect } from "react";
import './Home.css'
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function EditMenu() {
    const [auth, setAuth] = useState('');
    let nav = useNavigate(); // Use for Navigate on Previous

    useEffect(() => {
        var auth = localStorage.getItem('email');
        setAuth(auth);
    }, []);

    if (auth === null) {
        nav(`/admin`);
    }

    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        name: "",
        price: "",
        ingredients: "",
        type: "Wybierz pozycję", // Ustaw domyślną wartość
    });

    const { id, name } = useParams();

    useEffect(() => {
        getMenu();
    }, []);

    function getMenu() {
        axios.get(`http://localhost:80/api/menu/${id}`).then(function (response) {
            const menuData = response.data;
            menuData.price = parseFloat(menuData.price.replace(',', '.'));
            setInputs(menuData);
        });
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (inputs.price !== null && inputs.price !== undefined) {
            inputs.price = parseFloat(inputs.price.toString().replace(',', '.'));
        }

        axios.put(`http://localhost:80/api/menu/${id}/edit`, inputs).then(function (response) {
            navigate('/dashboard');
        });
    }

    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="title"><h3>Edytuj pozycję</h3></div>
                <div className="body">
                    <form onSubmit={handleSubmit}>
                        <label> Nazwa dania </label>
                        <input name="name" type="text" value={inputs.name} onChange={handleChange} /><br />
                        <label> Cena </label>
                        <input name="price" type="text" value={inputs.price} onChange={handleChange} /><br />
                        <label>Składniki wymieniać po przecinku: </label>
                        <input name="ingredients" type="text" value={inputs.ingredients} onChange={handleChange} /><br />
                        <select name="type" value={inputs.type} onChange={handleChange}>
                          
                            <option value="Przystawka">Przystawka</option>
                            <option value="Danie główne">Danie główne</option>
                            <option value="Zupa">Zupa</option>
                        </select>
                        <button>Edytuj pozycję</button>
                    </form>
                    <Link className="modal-container-back-link" to='/dashboard-menu'>Powrót do zarządzania menu</Link>
                </div>
            </div>
        </div>
    )
}

export default EditMenu;