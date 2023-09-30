
import './Home.css'
import { Link, useNavigate } from "react-router-dom";

function NotFound() {

    return (
        <div className='not-found-wrapper'>
            <div>
            <h1>Nie znaleźliśmy strony o takim adresie</h1>
            <Link to='/'>Powrót do strony głównej</Link>
            </div>
        </div>
    
    )
}

export default NotFound;