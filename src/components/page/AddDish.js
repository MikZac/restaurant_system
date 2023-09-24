import axios from 'axios';
import React, { useState } from 'react';
import './Home.css';
import { Link, useNavigate } from 'react-router-dom';

export default function AddDish() {
    const navigate = useNavigate();

    const [inputs, setInputs] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const name = event.target.name;
        let value = event.target.value;

        if (name === 'price' && value !== '') {
            value = parseFloat(value.replace(',', '.'));
        }

        setInputs(values => ({ ...values, [name]: value }));

        console.log(inputs);
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!inputs.name || !inputs.price || !inputs.ingredients || !inputs.type) {
            setErrorMessage('Wypełnij wszystkie pola przed zapisaniem.');
            return;
        }

        setErrorMessage('');

        axios.post('http://localhost:80/api/index.php/save/', inputs)
            .then(function (response) {
                console.log(response.data);
                navigate('/dashboard-menu');
            })
            .catch(function (error) {
                console.error(error);
                setErrorMessage('Wystąpił błąd podczas zapisywania dania. Spróbuj ponownie później.');
            });
    }

    return (
        <div className='add-dish-wrapper'>
            <div className='add-dish-form'>
                <h3>Dodaj danie do menu</h3>
                <form onSubmit={handleSubmit}>
                    <label>Nazwa dania</label>
                    <input name='name' type='text' placeholder='Nazwa' onChange={handleChange} /><br />
                    <label>Cena</label>
                    <input name='price' type='text' onChange={handleChange} /><br />
                    <label>Składniki wymieniać po przecinku:</label>
                    <input name='ingredients' type='text' onChange={handleChange} /><br />
                    <select name='type' onChange={handleChange}>
                        <option>Wybierz pozycję</option>
                        <option>Przystawka</option>
                        <option>Danie główne</option>
                        <option>Zupa</option>
                    </select>
                    <button>Dodaj danie</button>
                </form>
                {errorMessage && (
                    <span className='error-message'>{errorMessage}</span>
                )}
                <Link className='add-dish-go-back-link' to='/dashboard-menu'>Powrót do poprzedniej strony</Link>
            </div>
        </div>
    );
}