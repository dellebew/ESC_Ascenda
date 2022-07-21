import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons'
import { DateRange} from 'react-date-range';
import { useEffect, useState } from "react";
import { format } from "date-fns";
import useFetch from '../utils/useFetch.js'
import "./searchBar.css"
import {useNavigate} from 'react-router-dom';
import { nextDay } from "date-fns/esm";
var country_code = require("../../database/countries.json");
var destination_ids = require("../../database/output.json");

const SearchBar = () => {
    
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const [dest, setDest] = useState([destination_ids])
    

    const onChange = (event) => {
      setValue(event.target.value);
    };

    /** FOR FIXING SEARCH BAR */
    const [fixedBar, setFixedBar] = useState(false);

    const fixNav = (nav) => {
        if (window.scrollY >= nav.offsetTop) {
            document.body.style.paddingTop = nav.offsetHeight + 'px';
            document.body.classList.add('fixed-nav');
        } else {
            document.body.style.paddingTop = 0;
            document.body.classList.remove('fixed-nav');
        }
    }
    
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

    const setText = (id, searchTerm) => {
        setValue(searchTerm);
        console.log("search ", searchTerm);
        onSearch(id, searchTerm)
    }

    const onSearch = (id, searchTerm) => {
        setValue(searchTerm);

        //For destination name and uid side
        const destination_name = searchTerm
        const destination_uid = id

        // For dates of checkin and checkout
        const startd = JSON.stringify(date[0].startDate).slice(1,11)
        const endd = JSON.stringify(date[0].endDate).slice(1,11)

        //language
        const language = "en_US"

        //currency
        const currency = "SGD"

        // total number of guests
        const adults = options.adult
        const children = options.children
        const no_of_rooms = options.room
        const total_ppl = adults + children

        // c_code is the country code
        const c_code = country_code.filter(element => {
            const destination_title = searchTerm;

            if (destination_title.includes(element.name) || destination_title == element.name) {
                return element.code
            } else {
                return 0
            }
        })[0].code;

        //http://localhost:3000/destinations/11fD/2022-07-25/2022-07-29/en_US/SGD/SG/2/0

        let path = `/destinations/${destination_uid}/`
        navigate(path, {state: {id: 1, uid: destination_uid, c_id: c_code, start: startd, end: endd, lang: language,
             moneyType: currency, people: total_ppl,rooms: no_of_rooms} });
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
                    placeholder="e.g. Singapore"
                    className="search--input" 
                />
                
                {/*Dropdown bar for suggestions*/}
                <div className="dropdown"> 
                    {destination_ids
                    .filter((item) => {
                        const searchTerm = value;

                        
                        return (
                        searchTerm &&
                        item.term.includes(searchTerm)
                        );
                    })
                    .slice(0, 10)
                    .map((item) => (
                        <div
                        onClick={() => setText(item.uid, item.term)}
                        className="dropdown-row" 
                        key={item.uid}
                        >
                        {item.term}
                        </div>
                    ))}
                </div>
            </div>

            <div className="search--item2">
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
                    daySize="100"
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
                <div className="search--item">
                    <button className="search--button"
                        onClick={() => onSearch(value, 0)}> Search </button>
                </div>
            </div>

            </div>
        </div>
    </div>
    )
}

export default SearchBar