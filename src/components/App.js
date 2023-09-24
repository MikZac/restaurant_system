import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Navigation from './navigation/Navigation'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"
import Home from "./page/Home";
import Menu from "./page/Menu";
import Reservation from "./page/Reservation";
import PartyOrganization from "./page/PartyOrganization";
import Admin from "./page/Admin";
import Dashboard from "./page/Dashboard";
import EditMenu from './page/EditMenuModal';
import AddDish from './page/AddDish';
import EditReservation from "./page/EditReservation";
import DashboardMenu from "./page/Dashboard-menu";
import DashboardReservation from "./page/Dashboard-reservation";
import Footer from "./footer/Footer";
const App = () => {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/rezerwacja" element={<Reservation />} />
            <Route path="/organizacja-imprez" element={<PartyOrganization />} />
            <Route path="/admin" element={<Admin />}></Route>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/dashboard-menu" element={<DashboardMenu />}></Route>
            <Route path="/dashboard-reservation" element={<DashboardReservation />}></Route>
            <Route path="/dashboard-menu/menu/:id/edit" element={<EditMenu />} />
            <Route path="/dashboard/add-dish" element={<AddDish />} />
            <Route path="/dashboard-reservation/reservation/:id/edit" element={<EditReservation />} />
          </Routes>
        </div>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;