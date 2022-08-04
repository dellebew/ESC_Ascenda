import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons'
import { DateRange} from 'react-date-range';
import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import "./searchBar.css"
import {useNavigate} from 'react-router-dom';
var country_code = require("../../database/countries.json");
var destination_ids = require("../../database/output.json");
var test1 = require("../../database/uids.json");    


const SearchBar = () => {
    
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const [dest, setDest] = useState(0)
    

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
        setDest(id)
        
        console.log("search ", searchTerm);
    }

    const onSearch = (searchTerm) => {
        setValue(searchTerm);

        //For destination name and uid side
        const destination_name = searchTerm
        const destination_uid = dest;

        // For dates of checkin and checkout  
        const extractDates = (oldDate) => {
            // const newDate = addDays(oldDate, 1)
            return (JSON.stringify(oldDate).slice(1,11))
        } 
        const startd = extractDates(date[0].startDate)
        const endd = extractDates(date[0].endDate)

        // language
        const language = "en_US"

        // currency
        const currency = "SGD"

        // number of guests & rooms
        const {adult, children} = options

        if (destination_uid != 0) {

            // c_code is the country code
            const c_code = country_code.filter(element => {
                const destination_title = destination_name;
    
                if (destination_title.includes(element.name) || destination_title == element.name) {
                    return element.code
                } else {
                    return 0
                }
            })[0].code;

            const path = `/destinations/${destination_uid}/${startd}/${endd}/${language}/${currency}/${c_code}/${adult}/${children}/0`
            navigate(path);

        } else {
            const incompleteSearch = destination_ids.filter((item) => {
                let searchTerm = value.toLowerCase();
                let modified = item.term.toLowerCase();
     
                return (
                    searchTerm &&
                    modified.includes(searchTerm)
                    );
                }).slice(0,1)
            const incomplete_name = incompleteSearch[0].term
            const incomplete_uid = incompleteSearch[0].uid;

            const incomplete_country_code = country_code.filter(element => {
                const destination_title = incomplete_name;
    
                if (destination_title.includes(element.name) || destination_title == element.name) {
                    return element.code
                } else {
                    return 0
                }
            })[0].code;

            let path = `/destinations/${incomplete_uid}/${startd}/${endd}/${language}/${currency}/${incomplete_country_code}/${adult}/${children}/0`
            navigate(path);

        }
    };

    function ontest() {
        let path = "/hotels"
        navigate(path)
    }


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
                    id="search--destinations" 
                />
                
                {/*Dropdown bar for suggestions*/}
                <div className="dropdown"> 
                    {destination_ids
                    .filter((item) => {
                        let searchTerm = value.toLowerCase();
                        let modified = item.term.toLowerCase();

                        
                        return (
                        searchTerm &&
                        modified.includes(searchTerm)
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
                <div className="search--date" >
                <FontAwesomeIcon icon={faCalendarDays} className="search--icon"/>
                <div className="date-wrapper">
                <span className="search--text" id="search--date" onClick={()=>setOpenDate(!openDate)}>
                    {format(date[0].startDate, "MM/dd/yyyy")} to {format(date[0].endDate, "MM/dd/yyyy")}
                </span>
                {openDate && (<span onMouseLeave={() => setOpenDate(!openDate)}>
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
                <span className="search--text" id="search--people" onClick={() => setOpenOptions(!openOptions)}>
                    {`${options.adult} adults ${options.children} children`}
                </span>
                {openOptions && (<div className="options" onMouseLeave={() => setOpenOptions(!openOptions)}>
                    <div className="options--item">
                        <span className="options--text">Adult</span>
                        <div className="options--counter adult">
                            <button 
                                className="decrease"
                                onClick={() => handleOption("adult", "d")}
                                disabled={options.adult<=1}>-</button>
                            <span>{options.adult}</span>
                            <button 
                                className="increase"
                                onClick={() => handleOption("adult", "i")}
                                disabled={options.adult>=6}>+</button>
                        </div>
                        
                    </div>
                    <div className="options--item">
                        <span className="options--text">Children</span>
                        <div className="options--counter children">
                            <button 
                                className="decrease"   
                                onClick={() => handleOption("children", "d")}
                                disabled={options.children<=0}>-</button>
                            <span>{options.children}</span>
                            <button 
                                className="increase"
                                onClick={() => handleOption("children", "i")}
                                disabled={options.children>=6}>+</button>
                        </div>
                    </div>
                    {/* <div className="options--item">
                        <span className="options--text">Room</span>
                        <div className="options--counter room">
                            <button 
                                className="decrease"
                                onClick={() => handleOption("room", "d")}
                                disabled={options.room<=1}>-</button>
                            <span>{options.room}</span>
                            <button 
                                className="increase"
                                onClick={() => handleOption("room", "i")}
                                disabled={options.room>=6}>+</button>
                        </div>
                    </div> */}
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