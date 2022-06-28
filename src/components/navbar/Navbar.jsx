import "./navbar.css"

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navbar--container">
                <span className="navbar--logo">AscendaBooking</span>
                <div className="navbar--items">
                    <button className="navbar--currency">SGD</button>
                    <button className="navbar--button">Register</button>
                    <button className="navbar--button">Login</button>
                </div>
            </div>
        </div>
    )
}

export default Navbar