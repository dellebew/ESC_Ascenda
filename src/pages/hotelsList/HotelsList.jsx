import "./hotelsList.css"
import Navbar from "../../components/navbar/Navbar"
import SearchItem from "../../components/searchItem/SearchItem"
import { DateRange} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import SearchBar from "../../components/searchBar/SearchBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";


const List = () => {
    
    // const [openDate, setOpenDate] = useState(false);

 
    const location = useLocation(); // retrieves data from home page
    // const [destination, setDestination] = useState(location.state.destination)
    // const [date, setDate] = useState(location.state.date)
    // const [options, setOptions] = useState(location.state.option)

    // const x = location.state.searched;
    const y = "hello";
    
    // useEffect(() => {
    //     fetch(`https://hotelapi.loyalty.dev/api/hotels?destination_id=RsBU`)
    //         .then((response) => response.json())
    //         .then((actualData) => console.log(actualData))
    //         .catch((err) => {
    //         console.log(err.message);
    //         });
    //     }, []);

        

    function searchItem(name) {
        return (
            <div className="searchItem">
            <img
                src="https://t-cf.bstatic.com/xdata/images/hotel/square200/28344036.webp?k=72665465d8384e43417e12ab2a6db168f5aa38864bdf1b1183050282ae779711&o=&s=1"
                alt=""
                className="si--image"
            />
            <div className="si--desc">
                <h1 className="si--name">Hellloasda</h1>
                <div className="si--small">
                    <span className="si--address">{name}</span>
                    <span className="si--distance">500m from center</span>
                    <span className="si--cancellation"><b>Free Cancellation</b></span>
                </div>

                <span className="si--description">
                    Grand Copthorne Waterfront is located along the Singapore River. 
                    A 5-minute drive from Orchard Road, the hotel offers an outdoor pool, 4 restaurants and free parking. 
                </span>
            </div>
            <div className="si--details">
                <div className="si--rating"> 
                    <button>8.9</button>
                    <span>Excellent</span>
                </div>
                <div className="si--pricing"> 
                    <span className="si--from">From</span>
                    <span className="si--price">$123</span>
                    <button className="si--check">Show Prices</button>
                </div>
            </div>
        </div>
        )
    }
    

    const [date, setDate] = useState([
        {
        startDate: new Date(),
        endDate: null,
        key: 'selection'
        }
    ]);

    return (
        <div>
            <Navbar />
            <SearchBar />
            <div className="list--container">
                <div className="list--wrapper">
                    <div className="list--search">
                        
                        <div className="search--title">
                            <h2>Filter By</h2>
                        </div>
                        
                        <div className="list--item">
                            <div className="option--item">
                                <span className="option--text">
                                    Min price <small> (per night) </small>
                                </span>
                                <input type='number' min={1} className="option--input" placeholder="WIP"></input>
                            </div>
                            <div className="option--item">
                                <span className="option--text">
                                    Max price <small> (per night) </small>
                                </span>
                                <input type='number' min={1} className="option--input" placeholder="WIP"></input>
                            </div>
                            <div className="option--item">
                                <span className="option--text">
                                    Adult 
                                </span>
                                <input type='number' min={1} className="option--input" placeholder="WIP"></input>
                            </div>
                            <div className="option--item">
                                <span className="option--text">
                                    Children
                                </span>
                                <input type='number' min={0} className="option--input" placeholder="WIP"></input>
                            </div>
                            <div className="option--item">
                                <span className="option--text">
                                    Rooms
                                </span>
                                <input type='number' min={1} className="option--input" placeholder="WIP"></input>
                            </div>
                        </div>
                        <button>Search</button>
                    </div> 
                    <div className="list--result">
                        {searchItem(y)}
                        <SearchItem/>
                        <SearchItem/>
                        <SearchItem/>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default List