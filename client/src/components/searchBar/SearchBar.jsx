import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons'
import { DateRange} from 'react-date-range';
import { useState } from "react";
import { format } from "date-fns"
import "./searchBar.css"
var data = require("../../database/MOCK_DATA.json");

const SearchBar = () => {
    
    const [value, setValue] = useState("");

    const onChange = (event) => {
      setValue(event.target.value);
    };
    
    const onSearch = (searchTerm) => {
        setValue(searchTerm);
        // our api to fetch the search result
        console.log("search ", searchTerm);
    };
    
    /** FOR DATE-RANGE */
    const [openDate, setOpenDate] = useState(false);

    const [date, setDate] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ]);

    /** FOR PEOPLE DROPDOWN */
    const [openOptions, setOpenOptions] = useState(false);

    const [options, setOptions] = useState(
        {
          adult: 2,
          children: 0,
          room: 1,
        });
    
    const handleOption = (name, operation) => {
        setOptions(prev=> {return {
            ...prev, 
            [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
        };
    });
    };

    
    return (
        <div className="searchBar">
        <div className="search--wrapper">
            <h1 className="search--title">Where to?</h1>

            <div className="search--container">
            {/*Work with this for now, considering slack API right now, google seacrh API apparently is only for places, perhaps
            when create the places search bar, this can be implemented*/}

            <div className="search--item">
                <FontAwesomeIcon icon={faBed} className="search--icon"/>
                <input 
                    type="text" 
                    value={value} 
                    onChange={onChange}
                    placeholder="Temporarily People Only"
                    className="search--input" 
                />
                
                {/*Dropdown bar for suggestions*/}
                <div className="dropdown"> 
                    {data
                    .filter((item) => {
                        const searchTerm = value.toLowerCase();
                        const fullName = item.full_name.toLowerCase();

                        return (
                        searchTerm &&
                        fullName.startsWith(searchTerm) &&
                        fullName !== searchTerm
                        );
                    })
                    .slice(0, 10) // Displays top 10 in json file, can be mmodified to show more/less
                    .map((item) => (
                        <div
                        onClick={() => onSearch(item.full_name)} // searches by item key
                        className="dropdown-row" 
                        key={item.full_name}
                        >
                        {item.full_name}
                        </div>
                    ))}
                </div>
            </div>

            <div className="search--item">
                <FontAwesomeIcon icon={faCalendarDays} className="search--icon"/>
                <span 
                    onClick={()=>setOpenDate(!openDate)} 
                    className="search--text">
                    {format(date[0].startDate, "MM/dd/yyyy")} to {format(date[0].endDate, "MM/dd/yyyy")}
                </span>
                {openDate && (<DateRange
                    editableDateInputs={true}
                    onChange={item => setDate([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    className="date"
                />)}
            </div>

            <div className="search--item">
                <FontAwesomeIcon icon={faPerson} className="search--icon"/>
                <span className="search--text" onClick={() => setOpenOptions(!openOptions)}>
                    {`${options.adult} adults ${options.children} children ${options.room} room`}
                </span>
                {openOptions && (<div className="options">
                    <div className="options--item">
                        <span className="options--text">Adult</span>
                        <div className="options--counter">
                            <button 
                                onClick={() => handleOption("adult", "d")}
                                disabled={options.adult<=1}>-</button>
                            <span>{options.adult}</span>
                            <button onClick={() => handleOption("adult", "i")}>+</button>
                        </div>
                        
                    </div>
                    <div className="options--item">
                        <span className="options--text">Children</span>
                        <div className="options--counter">
                            <button 
                                onClick={() => handleOption("children", "d")}
                                disabled={options.children<=0}>-</button>
                            <span>{options.children}</span>
                            <button onClick={() => handleOption("children", "i")}>+</button>
                        </div>
                    </div>
                    <div className="options--item">
                        <span className="options--text">Room</span>
                        <div className="options--counter">
                            <button 
                                onClick={() => handleOption("room", "d")}
                                disabled={options.room<=1}>-</button>
                            <span>{options.room}</span>
                            <button onClick={() => handleOption("room", "i")}>+</button>
                        </div>
                    </div>
                </div>)}
            </div>

            {/*Button onClick needs to call out display page, clear this comment after doing it*/}
            <button className="search--button"
                    onClick={() => onSearch(value)}> Search </button>
            </div>
        </div>
    </div>
    )
}

export default SearchBar