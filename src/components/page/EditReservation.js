import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function EditReservation() {
    // const [auth, setAuth] = useState('');
    // let nav = useNavigate();
    // useEffect(() => {
    //     var auth = localStorage.getItem('email');
    //     setAuth(auth);
    // }, []);

    // if (auth === null) {
    //     nav(`/admin`);
    // }

    const navigate = useNavigate();
    const { id, name } = useParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            surname: "",
            guests: "",
            email: "",
            phone: "",
            date: "",
            time: "",
            status: "",
        },
    });

    useEffect(() => {
        getReservation();
    }, []);

    function getReservation() {
        axios.get(`http://localhost:80/api/reservation.php/${id}`).then(function (response) {
            reset(response.data);
        });
    }

    const hadnleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        reset((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const onSubmit = (data) => {
        axios.put(`http://localhost:80/api/reservation.php/${id}/edit`, data).then(function (response) {
            navigate('/dashboard');
        });
    };

    const date = new Date();
    date.setDate(date.getDate());
    const minDate = date.toISOString().slice(0, 10);

    return (
        <div className="modalBackground">
            <div className="modalContainer container-edit-reservation">
                <div className="title"><h3>Edytuj rezerwację</h3></div>
                <div className="body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label>Podaj Imię:</label><br />
                        <input
                            type="text"
                            name="name"
                            onChange={hadnleChange}
                            {...register("name", {
                                required: "To pole jest wymagane",
                                minLength: {
                                    value: 3,
                                    message: "Minimalna długość to 3.",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Maksymalna długość to 50.",
                                },
                            })}
                            placeholder="Imię"
                            className={errors["name"] ? "error" : ""}
                        />
                        {errors["name"] && <p className="error">{errors["name"]?.message}</p>}
                        <br />

                        <label>Podaj Nazwisko:</label><br />
                        <input
                            type="text"
                            name="surname"
                            onChange={hadnleChange}
                            {...register("surname", {
                                required: "To pole jest wymagane",
                                minLength: {
                                    value: 3,
                                    message: "Minimalna długość to 3.",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Maksymalna długość to 50.",
                                },
                            })}
                            placeholder="Nazwisko"
                            className={errors["surname"] ? "error" : ""}
                        />
                        {errors["surname"] && <p className="error">{errors["surname"]?.message}</p>}
                        <br />

                        <label>Wybierz liczbę osób:</label><br />
                        <select
                            name="guests"
                            onChange={hadnleChange}
                            {...register("guests", {
                                required: "To pole jest wymagane",
                            })}
                            className={errors["guests"] ? "error" : ""}
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                        {errors["guests"] && <p className="error">{errors["guests"]?.message}</p>}
                        <br />

                        <label>Podaj adres Email:</label><br />
                        <input
                            type="text"
                            name="email"
                            onChange={hadnleChange}
                            {...register("email", {
                                required: "To pole jest wymagane",
                                pattern: {
                                    value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                    message: "Proszę wpisać poprawny adres e-mail",
                                },
                            })}
                            placeholder="E-mail"
                            className={errors["email"] ? "error" : ""}
                        />
                        {errors["email"] && <p className="error">{errors["email"]?.message}</p>}
                        <br />

                        <label>Podaj numer Telefonu:</label><br />
                        <input
                            type="text"
                            name="phone"
                            onChange={hadnleChange}
                            {...register("phone", {
                                required: "To pole jest wymagane",
                                pattern: {
                                    value: /^\d{9}$/,
                                    message: "Proszę wpisać poprawnie numer telefonu (bez przerw i myślników)",
                                },
                            })}
                            placeholder="Telefon"
                            className={errors["phone"] ? "error" : ""}
                        />
                        {errors["phone"] && <p className="error">{errors["phone"]?.message}</p>}
                        <br />

                        <label>Wybierz Datę i Godzinę rezerwacji:</label><br />
                        <input
                            type="date"
                            name="date"
                            onChange={hadnleChange}
                            {...register("date", {
                                required: "To pole jest wymagane",
                            })}
                            placeholder="Data"
                            min={minDate}
                            className={errors["date"] ? "error" : ""}
                        />
                        {errors["date"] && <p className="error">{errors["date"]?.message}</p>}
                        <select
                            name="time"
                            onChange={hadnleChange}
                            {...register("time", {
                                required: "To pole jest wymagane",
                            })}
                            placeholder="Godzina"
                            className={errors["time"] ? "error" : ""}
                        >
                            <option value="9:00">9:00</option>
                            <option value="9:30">9:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
                            <option value="11:00">11:00</option>
                            <option value="11:30">11:30</option>
                            <option value="12:00">12:00</option>
                            <option value="12:30">12:30</option>
                            <option value="13:00">13:00</option>
                            <option value="13:30">13:30</option>
                            <option value="14:00">14:00</option>
                            <option value="14:30">14:30</option>
                            <option value="15:00">15:00</option>
                            <option value="15:30">15:30</option>
                            <option value="16:00">16:00</option>
                            <option value="16:30">16:30</option>
                            <option value="17:00">17:00</option>
                            <option value="17:30">17:30</option>
                            <option value="18:00">18:00</option>
                            <option value="18:30">18:30</option>
                            <option value="19:00">19:00</option>
                            <option value="19:30">19:30</option>
                            <option value="20:00">20:00</option>
                        </select>
                        {errors["time"] && <p className="error">{errors["time"]?.message}</p>}
                        <br />

                        <select
                            name="status"
                            onChange={hadnleChange}
                            {...register("status", {
                                required: "To pole jest wymagane",
                            })}
                            placeholder="Status Rezerwacji"
                            className={errors["status"] ? "error" : ""}
                        >
                            <option value="">Status Rezerwacji</option>
                            <option value="NIEPOTWIERDZONE">NIEPOTWIERDZONE</option>
                            <option value="POTWIERDZONA">POTWIERDZONA</option>
                        </select>
                        {errors["status"] && <p className="error">{errors["status"]?.message}</p>}

                        <button>Edytuj rezerwację</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditReservation;
