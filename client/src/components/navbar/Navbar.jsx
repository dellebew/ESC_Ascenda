import "./navbar.css"
import { Link } from "react-router-dom"

const NavBar = () => {
    return (
        <div className="navbar">
            <div className="navbar--container">
                <Link to="/">
                    <button className="navbar--logo">AscendaBooking</button>
                </Link>
                <div className="navbar--items">
                    <img src="/singapore.png"/>
                    <button className="navbar--currency">SGD</button>
                </div>
            </div>
        </div>
    )
}

export default NavBar