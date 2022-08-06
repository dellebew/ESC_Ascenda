import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons'
import { DateRange} from 'react-date-range';
import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import "./Hotel_searchBar.css"
import {useNavigate} from 'react-router-dom';
var country_code = require("../../database/countries.json");
var hotel_uids = require("../../database/trial_destination.json");


const Hotel_SearchBar = () => {
    
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    

    const onChange = (event) => {
      setValue(event.target.value);
    };
    
    /** FOR DATE-RANGE */
    const [openDate, setOpenDate] = useState(false);

    const [date, setDate] = useState([
        {
          startDate: new Date(),
          endDate: addDays(new Date(), 1),
          key: 'selection'
        }
      ]);

    /** FOR PEOPLE DROPDOWN */
    const [openOptions, setOpenOptions] = useState(false);

    const [options, setOptions] = useState(
        {
          adult: 2,
          children: 0,
        //   room: 1,
        });
    
    const handleOption = (name, operation) => {
        setOptions(prev=> {return {
            ...prev, 
            [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
        };
    });
    };

    const setText = (id, searchTerm) => {
        setValue(searchTerm);
        console.log("search ", searchTerm);
        onSearch(id, searchTerm)
    }


    const onSearch = (id, searchTerm) => {
        setValue(searchTerm);

        //For destination name and uid side
        const hotel_name = searchTerm
        const hotel_uid = id

        // For dates of checkin and checkout
        const extractDates = (oldDate) => {
            const newDate = addDays(oldDate, 1)
            return (JSON.stringify(newDate).slice(1,11))
        } 
        const startd = extractDates(date[0].startDate)
        const endd = extractDates(date[0].endDate)      

        //language
        const language = "en_US"

        //currency
        const currency = "SGD"

        // number of guests & rooms
        const {adult, children} = options

        const c_code = "IT"

        // let path = "/destinations/P4FZ/2022-07-25/2022-07-29/en_US/SGD/SG/3/0"
        // let path = `/destinations/${destination_uid}/${startd}/${endd}/${language}/${currency}/SG/2/0`
        let path = `/hotels/${hotel_uid}/A6Dz/${startd}/${endd}/${language}/${currency}/${c_code}/${adult}/${children}`
        navigate(path)

    };


    return (
        <div className="searchBar">
        <div className="search--wrapper">
            <div className="search--container">
            <div className="search--item">
                <FontAwesomeIcon icon={faBed} className="search--icon"/>
                <input 
                    type="text" 
                    value={value} 
                    onChange={onChange}
                    placeholder="e.g. Fullerton Hotel"
                    className="search--input" 
                    id="search--hotels"
                />
                
                {/*Dropdown bar for suggestions*/}
                <div className="dropdown"> 
                    {hotel_uids
                    .filter((item) => {
                        let searchTerm = value.toLowerCase();
                        let modified = item.term.toLowerCase();

                        
                        return (
                        searchTerm &&
                        modified.startsWith(searchTerm) &&
                        modified.includes(searchTerm)
                        );
                    })
                    .slice(0, 10)
                    .map((item) => (
                        <div
                        onClick={() => setText(item.id, item.name)}
                        className="dropdown-row" 
                        key={item.id}
                        >
                        {item.name}
                        </div>
                    ))}
                </div>
            </div>

            <div className="search--item2">
                <div className="search--date" >
                <FontAwesomeIcon icon={faCalendarDays} className="search--icon"/>
                <div className="date-wrapper">
                <span className="search--text" onClick={()=>setOpenDate(!openDate)}>
                    {format(date[0].startDate, "MM/dd/yyyy")} to {format(date[0].endDate, "MM/dd/yyyy")}
                </span>
                {openDate && (<span onMouseLeave={()=>setOpenDate(!openDate)}>
                    <DateRange
                    editableDateInputs={true}
                    minDate={new Date()}
                    onChange={item => setDate([item.selection])}
                    moveRangeOnFirstSelection={true}
                    ranges={date}
                    className="date-range"
                /></span>)}
                </div>
                </div>

                <div className="search--item">
                <FontAwesomeIcon icon={faPerson} className="search--icon"/>
                <span className="search--text" onClick={() => setOpenOptions(!openOptions)}>
                    {`${options.adult} adults ${options.children} children`}
                </span>
                {openOptions && (<div className="options" onMouseLeave={() => setOpenOptions(!openOptions)}>
                    <div className="options--item">
                        <span className="options--text">Adult</span>
                        <div className="options--counter">
                            <button 
                                onClick={() => handleOption("adult", "d")}
                                disabled={options.adult<=1}>-</button>
                            <span>{options.adult}</span>
                            <button onClick={() => handleOption("adult", "i")}
                                     disabled={options.adult>=6}>+</button>
                        </div>
                        
                    </div>
                    <div className="options--item">
                        <span className="options--text">Children</span>
                        <div className="options--counter">
                            <button 
                                onClick={() => handleOption("children", "d")}
                                disabled={options.children<=0}>-</button>
                            <span>{options.children}</span>
                            <button onClick={() => handleOption("children", "i")}
                                    disabled={options.children>=6}>+</button>
                        </div>
                    </div>
                    {/* <div className="options--item">
                        <span className="options--text">Room</span>
                        <div className="options--counter">
                            <button 
                                onClick={() => handleOption("room", "d")}
                                disabled={options.room<=1}>-</button>
                            <span>{options.room}</span>
                            <button onClick={() => handleOption("room", "i")}>+</button>
                        </div>
                    </div> */}
                </div>)}
                </div>

                {/*Button onClick needs to call out display page, clear this comment after doing it*/}
                <div className="search--item">
                    <button className="search--button"
                        onClick={() => onSearch(value, "")}> Search </button>
                </div>
            </div>

            </div>
        </div>
    </div>
    )
}

export default Hotel_SearchBar