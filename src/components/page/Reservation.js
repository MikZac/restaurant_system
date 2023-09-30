import * as React from "react";
import { useForm } from "react-hook-form";
import { useState } from 'react';
import axios from "axios";
import './Home.css'

export default function Reservation() {
    const [message, setMessage] = useState("")
    const [messageClass, setMessageClass] = useState("");
    const {
        register,
        handleSubmit,
        reset,
        control,
        submissionId,
        formState: {
            errors,
            isSubmitting,
        }
    } = useForm({
        defaultValues: {
            "name": "",
            "surname": "",
            "guests": "",
            "email": "",
            "date": "",
            "time": ""
        }
    });

    const onSubmit = (data) => {
        axios.post('http://localhost:80/api/reservation.php/', data)
            .then(function (response) {
                if (response.status === 200) {
                    setMessage("Twoja rezerwacja została wysłana.")
                    reset({
                        "name": "",
                        "surname": "",
                        "guests": "",
                        "email": "",
                        "date": "",
                        "time": ""
                    })
                    setMessageClass("success-message");
                    setTimeout(() => {
                        setMessage("");
                        setMessageClass("");
                    }, 10000)
                }
                else {
                    setMessage("Coś poszło nie tak, spróbuj ponownie.")
                    setMessageClass("error-message");
                }
            })
    }

    if (submissionId) {
        return <p>Thank you! Submission Id: {submissionId}</p>;
    }
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const minDate = date.toISOString().slice(0, 10);

    // Oblicz minimalną i maksymalną wartość dla pola czasu
    const currentTime = new Date();
    currentTime.setHours(10, 0, 0); // Ustawić aktualny czas na 10:00
    const minTime = currentTime.toISOString().slice(0, 16); // Minimalna godzina (10:00)
    currentTime.setHours(20, 0, 0); // Ustawić aktualny czas na 20:00
    const maxTime = currentTime.toISOString().slice(0, 16);


    return (
        <div className="reservation">
        <div className="form-wrapper">


            <form onSubmit={handleSubmit(onSubmit)}>
                <h1>Złóż rezerwację</h1>

                <div>
                    <label>
                        <span className="form-label-text">Podaj imię: </span>
                        <input
                            {...register("name", {
                                required: "To pole jest wymagane",
                                minLength: {
                                    value: 3,
                                    message: "Minimalna długość to 3."
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Maksymalna długość to 5."
                                },
                            })}
                            aria-invalid={errors["name"] ? "true" : "false"}
                            placeholder="Imię"
                            type="text"
                            className={errors["name"]? "error" : ""}
                        />
                    </label>
                    {errors["name"] && <p className="error" role="alert">{errors["name"]?.message}</p>}
                </div>

                <div>
                    <label>
                        <span className="form-label-text" >Podaj nazwisko: </span>
                        <input
                            {...register("surname", {
                                required: "To pole jest wymagane",
                                minLength: {
                                    value: 3,
                                    message: "Minimalna długość to 3."
                                },
                                maxLength: {
                                    value: 50,
                                    message: "Maksymalna długość to 5."
                                },
                            })}
                            aria-invalid={errors["surname"] ? "true" : "false"}
                            placeholder="Nazwisko"
                            type="text"
                            className={errors["surname"]? "error" : ""}
                        />
                    </label>
                    {errors["surname"] && <p className="error" role="alert">{errors["surname"]?.message}</p>}
                </div>

                <div>
                    <label>
                        <span >Wybierz liczbę osób: </span>
                        <select
                            {...register("guests", {
                                required: "To pole jest wymagane",
                            })}
                            aria-invalid={errors["guests"] ? "true" : "false"}
                            className={errors["guests"]? "error" : ""}
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
                        {errors["guests"] && <p className="error" role="alert">{errors["guests"]?.message}</p>}
                    </label>
                </div>

                <div>
                    <label>
                        <span className="form-label-text" >Podaj adres E-mail: </span>
                        <input
                            {...register("email", {
                                required: "To pole jest wymagane",
                                pattern: {
                                    value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                    message: "Proszę wpisać poprawny adres e-mail"
                                },
                            })}
                            aria-invalid={errors["email"] ? "true" : "false"}
                            placeholder="E-mail"
                            type="text"
                            list="email"
                            className={errors["email"]? "error" : ""}
                        />
                    </label>
                    {errors["email"] && <p className="error" role="alert">{errors["email"]?.message}</p>}
                </div>

                <div>
                    <label>
                        <span className="form-label-text" >Podaj numer Telefonu: </span>
                        <input
                            {...register("phone", {
                                required: "To pole jest wymagane",
                                pattern: {
                                    value: /^\d{9}$/,
                                    message: "Proszę wpisać poprawnie numer telefonu (bez przerw i myślników)"
                                },
                            })}
                            aria-invalid={errors["phone"] ? "true" : "false"}
                            placeholder="Telefon"
                            type="text"
                            className={errors["phone"]? "error" : ""}
                        />
                    </label>
                    {errors["phone"] && <p className="error" role="alert">{errors["phone"]?.message}</p>}
                </div>

                <div>
                    <label>
                        <span>Data: </span>
                        <input
                            {...register("date", {
                                required: "To pole jest wymagane",
                            })}
                            aria-invalid={errors["date"] ? "true" : "false"}
                            type="date"
                            min={minDate}
                            className={errors["date"]? "error" : ""}
                        />
                    </label>
                    {errors["date"] && <p className="date" role="alert">{errors["date"]?.message}</p>}
                </div>

                <div>
                    <label>
                        <span>Wybierz godzinę: </span>
                        <select
                            {...register("time", {
                                required: "To pole jest wymagane",
                            })}
                            aria-invalid={errors["time"] ? "true" : "false"}
                            className={errors["time"]? "error" : ""}
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
                        {errors["time"] && <p className="error" role="alert">{errors["time"]?.message}</p>}
                    </label>
                </div>

                <button className="send-reservation-form" disabled={isSubmitting}>Złóż rezerwację</button>
                <p className={messageClass}>{message}</p>
            </form>
        </div>
        </div>
    );

}