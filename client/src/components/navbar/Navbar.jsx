import "./navbar.css"

const NavBar = () => {
    
    return (
        <nav className="menu">
            <ol>
                <li className="menu-item"><a href="/" >Home</a></li>
                <li className="menu-item"><a href="/About">About</a></li>
                <li className="menu-item"><a href="#/">Services</a>
                <ol className="sub-menu">
                <li className="menu-item"><a href="/">Destination Search</a></li>
                <li className="menu-item"><a href="/hotels">Hotel Search</a></li>
            </ol>
            </li>
            </ol>
        </nav>
    )
}

export default NavBar