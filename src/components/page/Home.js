import React from "react";
import { Link } from 'react-router-dom';
import './Home.css';
import { Carousel } from "react-bootstrap";

import CarouselImageFirst from './image/carusel-image-1.jpg';
import CarouselImageSecond from './image/carusel-image-2.jpg';
import CarouselImageThird from './image/carusel-image-3.jpg';
import Carusel1 from './image/carusel-1.jpg';
import Carusel2 from './image/carusel-2.jpg';
import Carusel3 from './image/carusel-3.jpg';
import Carusel4 from './image/carusel-4.jpg';
import Carusel5 from './image/carusel-5.jpg';

import ReservationPhoto from './image/home-reservation-photo.jpg';
import ReservationPhotoSecond from './image/home-reservation-photo-2.jpg';
const Home = () => {
    return (
        <div className="home">
            <div className="home-carusel">


                <Carousel fade>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 carusel-image"
                            src={CarouselImageFirst}
                            alt="First slide"
                        />
                        <Carousel.Caption className="text">
                            <h2 className="slider-heading">Nova Restaurant</h2>
                            <div className="slider-text-underline"></div>
                            <p className="slider-text">Restauracja wielu smaków</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 carusel-image"
                            src={CarouselImageSecond}
                            alt="Second slide"
                        />

                        <Carousel.Caption className="text">
                            <h2 className="slider-heading">Nova Restaurant</h2>
                            <div className="slider-text-underline"></div>
                            <p className="slider-text">Restauracja wielu smaków</p>

                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100 carusel-image"
                            src={CarouselImageThird}
                            alt="Third slide"
                        />

                        <Carousel.Caption className="text">
                            <h2 className="slider-heading">Nova Restaurant</h2>
                            <div className="slider-text-underline"></div>
                            <p className="slider-text">Restauracja wielu smaków</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
            <section className="home-section-first">
                <div className="home-section-menu">
                    <div className="section-menu-text">
                        <h2>- Zobacz nasze menu -</h2>
                        <p>Nova Restaurant to zupełnie
                            nowe miejsce na kulinarnej i kulturalnej
                            mapie Polski. Zapraszamy do restauracji
                            na pyszne dania kuchni europejskiej.</p>
                        <Link to='/menu'><button>Zobacz nasze menu</button></Link>
                    </div>
                    <div className="section-menu-image">
                        <img src={require('./image/home-section-menu.jpg')} />
                    </div>
                </div>
            </section>
            <section className="home-section-second">
                <div className="section-second-wrapper">
                <div className="section-second-text">
                <h2>- Restauracja -</h2>
                <p>Nova Restaurant to wyjątkowe miejsce, gdzie
                    kuchnia europejska staje się prawdziwą ucztą dla zmysłów.
                    Nasza restauracja to połączenie tradycji i nowoczesności,
                    gdzie aromaty i smaki z całego kontynentu tworzą
                    niepowtarzalne doświadczenie kulinarne.
                    Zanurz się w naszym eleganckim wnętrzu i pozwól sobie
                    na podróż przez smaki Europy.</p>
                    </div>
                <Carousel pause="hover">
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={Carusel1}
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={Carusel2}
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={Carusel3}
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={Carusel4}
                            alt="First slide"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src={Carusel5}
                            alt="First slide"
                        />
                    </Carousel.Item>
                </Carousel>
                <Link to='/organizacja-imprez'><button>Zorganizuj imprezę</button></Link>
                </div>
            </section>
            <section className="home-section-first">
                <div className="home-section-third">
                    <div className="section-menu-text">                    
                <h2>- Gdzie nas znajdziecie? -</h2>
                <div className="contact-details">
                <p><strong>Adres:</strong> Wałbrzyska 11/250C 02-739 Warszawa</p>
                <p><strong>Tel:</strong> 666-444-333</p>
                <p><strong>Email:</strong> kontakt@novares.pl</p>
                <p>Zarezerwuj stolik już teraz i przygotuj się na wyjątkową
                    podróż przez smaki kuchni europejskiej w naszej restauracji.
                    Czekamy na Ciebie z niezapomnianymi doświadczeniami kulinarymi!</p>
                </div>
                <Link to='/rezerwacja'><button>Zarezerwuj stolik</button></Link>
                </div>
                <div className="section-menu-image reservation-image">
                        <img src={ReservationPhoto} />
                        <img src={ReservationPhotoSecond} />
                    </div>
                </div>
            </section>

        </div>

    );
}

export default Home;