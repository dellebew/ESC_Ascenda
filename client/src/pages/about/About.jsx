import NavBar from "../../components/navbar/Navbar"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHotel } from '@fortawesome/free-solid-svg-icons';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { faCab } from '@fortawesome/free-solid-svg-icons';
import { faEarthAmericas } from '@fortawesome/free-solid-svg-icons';
import { faMartiniGlass } from '@fortawesome/free-solid-svg-icons';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { faHelicopterSymbol } from '@fortawesome/free-solid-svg-icons';
import { faMountainCity } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faMonument } from '@fortawesome/free-solid-svg-icons';
import { faBicycle } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faElevator } from '@fortawesome/free-solid-svg-icons';
import { faHotTub } from '@fortawesome/free-solid-svg-icons';
import { faMapLocation } from '@fortawesome/free-solid-svg-icons';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { faAirFreshener } from '@fortawesome/free-solid-svg-icons';
import { faPerson } from '@fortawesome/free-solid-svg-icons';


import "./About.css"


const About = () => {

    
    return (
        <div>
            <div><NavBar/></div>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
            integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous"></link>
            <body>
                <section>
                    <div class = "row">
                        <div class = "icons-container">
                            <i><FontAwesomeIcon icon={faHotel}/></i>
                            <i><FontAwesomeIcon icon={faBagShopping}/></i>
                            <i><FontAwesomeIcon icon={faCab} /></i>
                            <i><FontAwesomeIcon icon={faEarthAmericas} /></i>
                            <i><FontAwesomeIcon icon={faMartiniGlass} /></i>
                            <i><FontAwesomeIcon icon={faAddressBook} /></i>
                            <i><FontAwesomeIcon icon={faHelicopterSymbol} /></i>
                            <i><FontAwesomeIcon icon={faMountainCity} /></i>
                            <i><FontAwesomeIcon icon={faKey} /></i>
                            <i><FontAwesomeIcon icon={faMonument} /></i>
                            <i><FontAwesomeIcon icon={faBicycle} /></i>
                            <i><FontAwesomeIcon icon={faStar} /></i>
                            <i><FontAwesomeIcon icon={faElevator} /></i>
                            <i><FontAwesomeIcon icon={faHotTub} /></i>
                            <i><FontAwesomeIcon icon={faMapLocation} /></i>
                            <i><FontAwesomeIcon icon={faCar} /></i>
                            <i><FontAwesomeIcon icon={faPlane} /></i>
                            <i><FontAwesomeIcon icon={faAddressCard} /></i>
                            <i><FontAwesomeIcon icon={faPerson} /></i>
                            <i><FontAwesomeIcon icon={faAirFreshener} /></i>
                        </div>
                    </div>
                </section>
            </body>
        </div>
    )
}

export default About