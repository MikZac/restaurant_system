import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css'

function CalculatorEdit() {
    const [auth, setAuth] = useState('');
    let nav = useNavigate(); // Use for Navigate on Previous

    useEffect(() => {
        var auth = localStorage.getItem('email');
        setAuth(auth);
    }, []);

    if (auth === null) {
        nav(`/admin`);
    }

    const [calculatorData, setCalculatorData] = useState({
        id: '',
        traditional: 0, // Przekształcone na INT
        vege: 0, // Przekształcone na INT
        premium: 0, // Przekształcone na INT
        tort: 0, // Przekształcone na INT
        kidsMenu: 0, // Przekształcone na INT
        drinkBar: 0, // Przekształcone na INT
        alcohol: 0, // Przekształcone na INT
        vignettes: 0, // Przekształcone na INT
        countryTable: 0, // Przekształcone na INT
    });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios
            .get('http://localhost:80/api/calculator.php')
            .then((response) => {
                setCalculatorData(response.data);
            })
            .catch((error) => {
                console.error('Błąd pobierania danych: ', error);
            });
    }, []);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = parseInt(event.target.value); // Przekształcz na INT

        setCalculatorData((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const isValid = Object.values(calculatorData).every(value => value !== null && value > 0);

        if (isValid) {
            axios.put(`http://localhost:80/api/calculator.php`, calculatorData)
                .then(function (response) {
                    navigate('/dashboard');
                })
                .catch(function (error) {
                    console.error('Błąd podczas wysyłania danych: ', error);
                });
        } else {
            setErrorMessage('Proszę wprowadzić poprawne wartości'); // Ustaw wiadomość o błędzie
        }
    }

    return (
        <div className='calculator-wrapper'>
            <div className="calculator-form">
                <h1>Zarządzanie kalkulatorem</h1>
                <form onSubmit={handleSubmit}>
                    <div >
                        <div>
                            <label>Cena za osobę (Menu Tradycyjne)</label>
                            <input type="number" name="traditional" value={calculatorData.traditional} onChange={handleChange}></input>
                        </div>
                        <div>
                            <label>Cena za osobę (Menu Vege)</label>
                            <input type="number" name="vege" value={calculatorData.vege} onChange={handleChange}></input>
                        </div>
                        <div>
                            <label>Cena za osobę (Menu Premium)</label>
                            <input type="number" name="premium" value={calculatorData.premium} onChange={handleChange}></input>
                        </div>
                        <div>
                            <label>Cena Tortu</label>
                            <input type="number" name="tort" value={calculatorData.tort} onChange={handleChange}></input>
                        </div>
                        <div>
                            <label>Dodatkowe menu dziecięce (za osobę)</label>
                            <input type="number" name="kidsMenu" value={calculatorData.kidsMenu} onChange={handleChange}></input>
                        </div>
                        <div>
                            <label>Drink bar</label>
                            <input type="number" name="drinkBar" value={calculatorData.drinkBar} onChange={handleChange}></input>
                        </div>
                        <div>
                            <label>Alkohol (za osobę)</label>
                            <input type="number" name="alcohol" value={calculatorData.alcohol} onChange={handleChange}></input>
                        </div>
                        <div>
                            <label>Winietki (za sztukę)</label>
                            <input type="number" name="vignettes" value={calculatorData.vignettes} onChange={handleChange}></input>
                        </div>
                        <div>
                            <label>Wiejski stół</label>
                            <input type="number" name="countryTable" value={calculatorData.countryTable} onChange={handleChange}></input>
                        </div>
                    </div>
                    <button>Edytuj pozycję</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <Link to='/dashboard'>Powrót do panelu</Link>
            </div>
        </div>
    )
}

export default CalculatorEdit;