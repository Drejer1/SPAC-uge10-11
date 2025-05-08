// Navbar.tsx
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Canvases</Link> </li>
                <li><Link to="/"> (Temp) Create new</Link></li>
                <li><Link to="/"> (Temp) Delete</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
