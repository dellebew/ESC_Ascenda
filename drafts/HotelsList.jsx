import "./hotelsList.css"
import React, { useState } from 'react'
import Navbar from "../../components/navbar/Navbar"
import SearchItem from "../../components/searchItem/SearchItem"
import { DateRange} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import SearchBar from "../../components/searchBar/SearchBar";
// import { useLocation } from "react-router-dom";


const List = () => {
    
    const [openDate, setOpenDate] = useState(false);

/** 
    const location = useLocation(); // retrieves data from home page
    const [destination, setDestination] = useState(location.state.destination)
    const [date, setDate] = useState(location.state.date)
    const [options, setOptions] = useState(location.state.option)
*/
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
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                            <h2>Search</h2>
                        </div>
                        <div className="list--item">
                            <label>Destination/Hotel Name:</label>
                            <input type='text' placeholder="WIP"/>
                        </div>

                        <div className="list--item">
                            <label>Check-In/Check-Out Date:</label>
                            <span onClick={()=>setOpenDate(!openDate)}>
                                04/07/1999 to 04/08/1999
                            </span> 
                            {openDate && (<DateRange
                                onChange={(item)=>setImmediate([item.selection])}
                                minDate={new Date()}
                                ranges={date}
                                className="date--picker"
                            />)}
                        </div>
                        
                        <div className="list--item">
                            <label>Filter By:</label>
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
                        <SearchItem/>  
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