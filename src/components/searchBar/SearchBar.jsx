import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons'
import { DateRange} from 'react-date-range';
import React, { useEffect, useState } from "react";
import { format } from "date-fns"
import {useNavigate} from 'react-router-dom';
import ReactDOM from "react-dom";
import "./searchBar.css";
import axios from 'axios';
var data = require("../../database/MOCK_DATA.json");


const SearchBar = () => {
    
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    // const api_url = 'https://hotelapi.loyalty.dev/api/hotels?destination_id=RsBU'

    // 
    

    const onChange = (event) => {
      setValue(event.target.value);
    };
    
    const onSearch = (searchTerm) => {
        setValue(searchTerm);
        // our api to fetch the search result
        const allDaDates = {date}
        const allOfIt = {x}

        const arrayOfSimilarItems = x.filter((item) => {
            const similarItem = searchTerm

            return item.name.includes(similarItem)
        })

        console.log(arrayOfSimilarItems)
        console.log(allDaDates)
        console.log(allOfIt)
        console.log(searchTerm)

        //How it work:
        // 1. searchedTerm sends an array if searched value is vague, outputting out an array of names that match the term,
        // otherwise it returns an empty array
        // 2. allDaDates sends the date data to the hotels page
        // 3. allOfIt sends the full array fetched directly from the API
        // 4. arrayOfSimilar Items sends the particular word if vague but the exact array if selected


        let path = '/hotels'
        navigate(path, {state: {id: 1, searched: searchTerm, dateRange: allDaDates, fullArray: allOfIt}});
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

    // Temp for API
    const RetrieveEverything = (url) => {
        const [output, setOutput] = useState([]);
        const fetchFromAPI = async () => {
          try {
            const res = await axios.get(url);
            setOutput(res.data);
            console.log("Success");
          } catch (error) {
            console.log(error);
          }
        };
        useEffect(() => {
          fetchFromAPI();
        }, []);
        return { output };
      };
 
    const { output: x } = RetrieveEverything('https://hotelapi.loyalty.dev/api/hotels?destination_id=RsBU');
    
    return (
        <div className="searchBar">
        <div className="search--wrapper">
            <h1 className="search--title">Where to?</h1>

            <div className="search--container">
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
                    {x
                    .filter((item) => {
                        const searchTerm = value;

                        return (
                        searchTerm &&
                        item.name.includes(searchTerm)
                        );
                    })
                    .slice(0, 10) 
                    .map((item) => (
                        <div
                        onClick={() => onSearch(item)} // searches by item key
                        className="dropdown-row" 
                        key = {item.name}
                        >
                        {item.name}
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

            {/*modify it to send an array of hotels if non specific hotel selected*/}
            <button className="search--button"
                    onClick={() => onSearch(value)}> Search </button>
            </div>
        </div>
    </div>
    )
}

export default SearchBar