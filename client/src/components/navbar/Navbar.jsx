import "./navbar.css"

const NavBar = () => {
    return (
        <nav class="menu">
            <ol>
                <li class="menu-item"><a href="/">Home</a></li>
                <li class="menu-item"><a href="#/">About</a></li>
                <li class="menu-item"><a href="#/">Services</a>
                <ol class="sub-menu">
                <li class="menu-item"><a href="/">Destination Search</a></li>
                <li class="menu-item"><a href="/hotels">Hotel Search</a></li>
            </ol>
            </li>
            <li class="menu-item">
                <a href="#/">Currency</a>
                <ol class="sub-menu">
                <li class="menu-item"><a href="#/">SGD</a></li>
                <li class="menu-item"><a href="#/">JPY</a></li>
                <li class="menu-item"><a href="#/">EUR</a></li>
                </ol>
            </li>
            </ol>
        </nav>
    )
}

export default NavBar