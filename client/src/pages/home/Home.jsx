import NavBar from "../../components/navbar/Navbar"
import Header from "../../components/header/Header"
import "./home.css"


const Home = () => {
    
    return (
        <div className="bg-container">
            <div><NavBar/></div>
            <div><Header/></div>
        </div>
    )
}

export default Home