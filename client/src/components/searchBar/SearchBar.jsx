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
    
    
    const setText = (searchTerm) => {
        setValue(searchTerm);
        console.log("search ", searchTerm);
        onSearch(searchTerm)
    }

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

    const onSearch = (searchTerm) => {
        setValue(searchTerm);

        //For destination uid side
        const destination = searchTerm

        // For dates of checkin and checkout
        const startd = date[0].startDate
        const endd = date[0].endDate;

        //language
        const language = "en_US"

        //currecny
        const currency = "SGD" //set laters

        // TODO: country code, need another output json file with the state information.
        // const c_code = country_code.filter(element => {return(element.name == country)});
        // const codez = c_code[0].code

        let path = '/destinations/10' //need change this later
        navigate(path, {state: {id: 1, uid: searchTerm, start: startd, end: endd, lang: language, moneyType: currency} });
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
                        onClick={() => setText(item.uid)}
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
                        onClick={() => onSearch(value)}> Search </button>
                </div>
            </div>

            </div>
        </div>
    </div>
    )
}

export default SearchBar