import React, { useEffect, useState } from "react";
import axios from "axios";
import './Home.css'
function Menu() {


    const [menu, setMenu] = useState([]);

    useEffect(() => {
        getMenu();
    }, []);

    function getMenu() {
        axios.get('http://localhost:80/api/menu/').then(function (response) {
            setMenu(response.data);
        });
    }

    return (
        <div className="menu-wrapper">

            <h1>Sprawdź menu naszej restauracji</h1>

            <div className="menu">
                <h2>Przystawki</h2>
                {menu.filter(dish => dish.type === "Przystawka").map((filteredDish, key) => (
                    <div key={key} >
                        <div class="dishWrapper">
                            <div className="dishName"><h3>{filteredDish.name}</h3></div>
                            <div className="dishPrice"><h3> {filteredDish.price}</h3></div>
                            </div>
                            <p className="dishIngredients">{filteredDish.ingredients}</p>
                            <hr></hr>
                    </div>
                ))}
                <h2>Dania Główne</h2>
                {menu.filter(dish => dish.type === "Danie główne").map((filteredDish, key) => (
                    <div key={key} >
                    <div class="dishWrapper">
                        <div className="dishName"><h3>{filteredDish.name}</h3></div>
                        <div className="dishPrice"><h3> {filteredDish.price}</h3></div>
                        </div>
                        <p className="dishIngredients">{filteredDish.ingredients}</p>
                    <hr></hr>
                </div>
                ))}

                <h2>Zupy</h2>
                {menu.filter(dish => dish.type === "Zupa").map((filteredDish, key) => (
                    <div key={key} >
                    <div class="dishWrapper">
                        <div className="dishName"><h3>{filteredDish.name}</h3></div>
                        <div className="dishPrice"><h3> {filteredDish.price}</h3></div>
                        </div>
                        <p className="dishIngredients">{filteredDish.ingredients}</p>
                        <hr></hr>
                </div>
                ))}
            </div>


        </div>
    );
}

export default Menu;