import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import '../page/Home.css';
import logoFooter from '../page/image/logo-footer.png';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="footer-wrapper">
        <Container className="footer">
      <Row>
        <Col md={3}>
          <div className="footer-headline"><h3>Nova Restaurant</h3></div>
          <p className="footer-text">Dzięki Nova Restaurant poznasz najciekawsze dania kuchni europejskiej i spędzisz niesamowite chwile.</p>
        </Col>
        <Col md={3}>
        <div className="footer-headline"> <h3>Adres</h3></div>
            <p className="footer-text">Wałbrzyska 11/250C <br/>
            02-739 Warszawa</p>
        </Col>
        <Col md={3}>
        <div className="footer-headline"><h3>Przydatne Strony</h3></div>
        <p><a href='/menu'>Menu</a></p>
        <p><a href='/menu'>Organizacja imprez</a> </p>
        <p><a href='/menu'>Rezerwacja</a></p>
        </Col>
        <Col md={3}>
        <div className="footer-headline"><h3>Kontakt</h3></div>
        <p><a href="tel:666-444-333">Tel: 666-444-333</a></p>
        <p><a href="mailto:kontakt@novares.pl">Email: kontakt@novares.pl</a></p>
        </Col>
      </Row>
    </Container>
    </div>
    )
}
export default Footer;