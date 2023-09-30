import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import axios from 'axios';

export default function PartyOrganization() {
  const [mainPrice, setMainPrice] = useState(0);
  const [calculatorData, setCalculatorData] = useState(null);

  const intValueTort = parseInt(calculatorData?.tort || "0");
  const intValueAlcohol = parseInt(calculatorData?.alcohol || "0");
  const intValueCountryTable = parseInt(calculatorData?.countryTable || "0");
  const intValueDrinkBar = parseInt(calculatorData?.drinkBar || "0");
  const intValuekidsMenu = parseInt(calculatorData?.kidsMenu || "0");
  const intValuePremium = parseInt(calculatorData?.premium || "0");
  const intValueTraditional = parseInt(calculatorData?.traditional || "0");
  const intValueVege = parseInt(calculatorData?.vege || "0");
  const intValueVignettes = parseInt(calculatorData?.vignettes || "0");


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

  const [message, setMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      date: '',
      persons: '',
      menu: '',
      kidsMenu: false,
      kids: '',
      tort: false,
      drinkBar: false,
      alcohol: false,
      personDrinkingAlcohol: '',
      vignettes: false,
      countryTable: false,
    },
  });

  const handleReset = () => {
    reset({
      name: '',
      email: '',
      date: '',
      persons: '',
      menu: '',
      kidsMenu: false,
      kids: '',
      tort: false,
      drinkBar: false,
      alcohol: false,
      personDrinkingAlcohol: '',
      vignettes: false,
      countryTable: false,
    });
    setMainPrice(0);
  };

  const onSubmit = (data) => {
    let menuStatus = 0;
    let tortStatus = 0;
    let drinkBarStatus = 0;
    let alcoholStatus = 0;
    let vignettesStatus = 0;
    let countryTableStatus = 0;

    if (calculatorData) {
      if (data.tort === true) {
        tortStatus = intValueTort; // Ustawiłem na stałe 100, dostosuj do swoich potrzeb
      } else {
        tortStatus = 0;
      }

      if (data.drinkBar === true) {
        drinkBarStatus = intValueDrinkBar;
      } else {
        drinkBarStatus = 0;
      }

      if (data.vignettes === true) {
        vignettesStatus = intValueVignettes;
      } else {
        vignettesStatus = 0;
      }

      if (data.countryTable === true) {
        countryTableStatus = intValueCountryTable;
      } else {
        countryTableStatus = 0;
      }

      if (data.menu === 'Tradycyjne menu') {
        menuStatus = intValueTraditional;
      } else if (data.menu === 'Menu wegetariańskie') {
        menuStatus = intValueVege;
      } else if (data.menu === 'Menu Premium') {
        menuStatus = intValuePremium;
      } else {
        menuStatus = 0;
      }
    }

    if (parseInt(data.kids) > parseInt(data.persons)) {
      setError('kids', {
        type: 'manual',
        message: 'Liczba dzieci nie może być większa niż ogólna liczba osób',
      });
      return;
    }

    let price =
      menuStatus * data.persons +
      intValuekidsMenu * data.kids +
      tortStatus +
      drinkBarStatus +
      intValueAlcohol * data.personDrinkingAlcohol +
      vignettesStatus * data.persons +
      countryTableStatus;
    setMainPrice(price);

    var templateParts = {
      data,
      menuStatus,
      tortStatus,
      drinkBarStatus,
      vignettesStatus,
      countryTableStatus,
      costPerPerson: data.persons * menuStatus,
      costPerKids: data.kids * intValuekidsMenu,
      costvignetteStatus: data.persons * vignettesStatus,
      costAlcohol: data.personDrinkingAlcohol * intValueAlcohol,
      price,
    };

    emailjs
      .send('service_zky5ydp', 'template_bijp4nq', templateParts, 'vab5-4Cb_EoliyDQh')
      .then(
        (result) => {
          if (result.text === 'OK') {
            setMessage('Szczegóły oferty zostały wysłane na podany adres e-mail');
          }
        },
        (error) => {
          console.log(error.text);
          setMessage('Coś poszło nie tak nie się wysłać oferty na maila');
        }
      );
      reset({
        name: '',
        email: '',
        date: '',
        persons: '',
        menu: '',
        kidsMenu: false,
        kids: '',
        tort: false,
        drinkBar: false,
        alcohol: false,
        personDrinkingAlcohol: '',
        vignettes: false,
        countryTable: false,
      });
  };

  const minDate = new Date().toISOString().slice(0, 10);
    return (
        <div className="wrapper-party">
           
        <div className="party-organization">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="party-organization-title">Wycena imprezy</h1>

                <div className="calculator-form-div">
                    <label className="calculator-form-label">
                        <span className="calculator-form-span input-span">Imię i nazwisko</span>
                        <input
                            {...register("name", {
                                required: "To pole jest wymagane",
                                minLength: {
                                    value: 5,
                                    message: "Wpisana wartość musi być dłuższa niż 5 znaków"
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Wpisana wartość musi być krótsza niż 100 znaków"
                                },
                            })}
                            aria-invalid={errors["name"] ? "true" : "false"}
                            placeholder="Imię i nazwisko"
                            type="text"
                            className="calculator-form-input"
                        />
                    </label>
                    {errors["name"] && <p className="error" role="alert">{errors["name"]?.message}</p>}
                </div>

                <div className="calculator-form-div">
                    <label className="calculator-form-label">
                        <span className="calculator-form-span input-span">Email</span>
                        <input
                            {...register("email", {
                                required: "To pole jest wymagane",
                                maxLength: {
                                    value: 100,
                                    message: "Wpisana wartość musi być krótsza niż 100 znaków"
                                },
                                pattern: {
                                    value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                    message: "Podany adres E-mail jest niepoprawny."
                                },
                            })}
                            aria-invalid={errors["email"] ? "true" : "false"}
                            placeholder="Email"
                            type="text"
                            className="calculator-form-input"
                        />
                    </label>
                    {errors["email"] && <p className="error" role="alert">{errors["email"]?.message}</p>}
                </div>

                <div className="calculator-form-div">
                    <label className="calculator-form-label">
                        <span className="calculator-form-span input-span">Podaj datę organizacji imprezy</span>
                        <input
                            {...register("date", {
                                required: "Proszę uzupełnić to pole",
                            })}
                            aria-invalid={errors["date"] ? "true" : "false"}
                            type="date"
                            min={minDate}
                            className="calculator-form-input"
                        />
                    </label>
                    {errors["date"] && <p className="error" role="alert">{errors["date"]?.message}</p>}
                </div>

                <div className="calculator-form-div">
                    <label className="calculator-form-label">
                        <span className="calculator-form-span input-span">Podaj liczbę osób</span>
                        <input
                            {...register("persons", {
                                required: "To pole jest wymagane",
                                min: {
                                    value: 20,
                                    message: "Minimalna liczba osób wynosi 20"
                                },
                                max: {
                                    value: 100,
                                    message: "Maksymalna liczba osób wynosi 100"
                                },
                                validate: {
                                    notLessThanChildrenAndDrinkers: (value) => {
                                        const children = parseInt(watch("kids")) || 0
                                        const drinkers = parseInt(watch("personDrinkingAlcohol")) || 0
                                        const total = parseInt(value) || 0;
                                        const sum = children + drinkers;
                                        if (total < sum) {
                                            return "Ogólna liczba osób nie może być mniejsza niż suma objętych kids menu i osób pijących alkohol";
                                        }
                                        return true;
                                    }
                                }
                
                            })}
                            aria-invalid={errors["persons"] ? "true" : "false"}
                            step="1"
                            type="number"
                            className="calculator-form-input"

                        />
                    </label>
                    {errors["persons"] && <p className="error" role="alert">{errors["persons"]?.message}</p>}
                </div>

                <div className="calculator-form-div">
                    <label className="calculator-form-label">
                        <span className="calculator-form-span input-span">Wybierz rodzaj menu</span>
                        <select className="calculator-form-select"
                            {...register("menu", {
                                required: "Proszę wybrać element listy",
                            })}
                            aria-invalid={errors["menu"] ? "true" : "false"}
                        >
                            <option value="Tradycyjne menu">Tradycyjne menu</option>
                            <option value="Menu wegetariańskie">Menu wegetariańskie</option>
                            <option value="Menu Premium">Menu Premium</option>
                        </select>
                        {errors["menu"] && <p className="error" role="alert">{errors["menu"]?.message}</p>}
                    </label>
                </div>

                <div className="calculator-form-div" >
                    <label className="calculator-form-label" >
                        <span className="calculator-form-span input-span" >Menu dla dzieci (Podaj liczbę osób)</span>
                        <input
  {...register("kids", {
    min: {
        value: 0,
        message: "Liczba dzieci nie może być mniejsza niż 0",
    },
    max: {
      value: 100, // Maksymalna liczba dzieci
      message: "Maksymalna liczba dzieci wynosi 100",
    },
    validate: {
        notGreaterThanTotalPersons: (value) => {
            const totalPersons = parseInt(watch("persons")); // Pobierz ogólną liczbę osób
            if (parseInt(value) > totalPersons) {
                return "Liczba dzieci nie może być większa niż ogólna liczba osób";
            }
            return true;
        },
    },
  })}
  aria-invalid={errors["kids"] ? "true" : "false"}
  type="number"
  className="calculator-form-input"
/>
                    </label>
                    {errors["kids"] && <p className="error" role="alert">{errors["kids"]?.message}</p>}
                </div>
                <div className="calculator-form-div" >
                    <label className="calculator-form-label" >
                        <span className="calculator-form-span input-span" >Alkohol (Podaj liczbę osób):</span>
                        <input
                            {...register("personDrinkingAlcohol", {
                                min: {
                                    value: 0,
                                    message: "Liczba osób pijących alkohol nie może być mniejsza niż 0",
                                },
                                max: {
                                    value: 100,
                                    message: "Maksymalna liczba osób wynosi 100"
                                },
                                validate: {
                                    notGreaterThanTotalPersons: (value) => {
                                        const totalPersons = parseInt(watch("persons")); // Pobierz ogólną liczbę osób
                                        if (parseInt(value) > totalPersons) {
                                            return "Liczba osób pijących alkohol nie może być większa niż ogólna liczba osób";
                                        }
                                        return true;
                                    },
                                },
                            })}
                            aria-invalid={errors["personDrinkingAlcohol"] ? "true" : "false"}
                            type="number"
                            className="calculator-form-input"
                        />
                    </label>
                    {errors["personDrinkingAlcohol"] && <p className="error" role="alert">{errors["personDrinkingAlcohol"]?.message}</p>}
                </div>

                <div className="calculator-form-div" >
                    <label className="calculator-form-label" >
                        <span className="calculator-form-span" >Tort</span>
                        <input
                            {...register("tort")}
                            type="checkbox"
                            className="calculator-form-checkbox"
                        />
                    </label>
                </div>

                <div className="calculator-form-div" >
                    <label className="calculator-form-label" >
                        <span className="calculator-form-span" >Drink Bar</span>
                        <input
                            {...register("drinkBar")}
                            type="checkbox"
                            className="calculator-form-checkbox"
                        />
                    </label>
                </div>

                

                <div className="calculator-form-div">
                    <label className="calculator-form-label" >
                        <span className="calculator-form-span" >Winietki na stole</span>
                        <input
                            {...register("vignettes")}
                            type="checkbox"
                            className="calculator-form-checkbox"
                        />
                    </label>
                </div>

                <div className="calculator-form-div" >
                    <label className="calculator-form-label" >
                        <span className="calculator-form-span" >Wiejski stół</span>
                        <input
                            {...register("countryTable")}
                            type="checkbox"
                            className="calculator-form-checkbox"
                        />
                    </label>
                </div>

                <button className="calculated-btn" disabled={isSubmitting}>Oblicz koszt imprezy</button>
                <p className="detail-offer">{message}</p>
            </form>
            <button className="reset-btn"  onClick={handleReset}>Reset</button>

            <p className="main-price">Koszt Całkowity: <strong>{mainPrice} zł</strong></p>
        </div>
        </div>
        
    );
}

