import axios from 'axios';
import React, { useState } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    let navigate = useNavigate();

    const [user, setUser] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    const submitForm = (e) => {
        e.preventDefault();
        const sendData = {
            email: user.email,
            password: user.password
        }

        axios.post('http://localhost:80/api/login.php', sendData)
            .then((result) => {
                if (result.data.Status === '200') {
                    window.localStorage.setItem('email', result.data.email);
                    window.localStorage.setItem('userName', (result.data.first_name + ' ' + result.data.first_name));
                    navigate(`/dashboard`);
                } else {
                    setLoginError('Nieprawidłowy użytkownik');
                }
            })
            .catch(error => {
                console.error(error);
                setLoginError('Wystąpił błąd podczas logowania. Spróbuj ponownie później.');
            });
    }

    return (
        <div className='wrapper-admin'>
            <div className="admin-form">
                <form onSubmit={submitForm}>
                    <div className="row admin-form-field">
                        <div className="col-md-12 text-center"> <h1>Logowanie do panelu admina</h1></div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 admin-label">Email:</div>
                        <div className="col-md-12">
                            <input type="email" name="email" onChange={handleChange} value={user.email} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 admin-label">Password:</div>
                        <div className="col-md-12">
                            <input type="password" name="password" onChange={handleChange} value={user.password} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 text-center">
                            {loginError && (
                                <div className="text-danger">{loginError}</div>
                            )}
                            <input type="submit" name="submit" className="btn btn-success" value="Zaloguj się" />
                        </div>
                    </div>
                </form>
                <div className="col-md-12 text-center admin-go-back">
                    <a className='admin-go-back-link' href="/">Powrót do strony głównej</a>
                </div>
            </div>
        </div>
    )
}

export default Login;