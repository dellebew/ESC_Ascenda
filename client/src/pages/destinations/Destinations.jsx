import "./destinations.css"
import React, { useState, useEffect, Suspense, lazy } from 'react'
import Navbar from "../../components/navbar/Navbar"
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import SearchBar from "../../components/searchBar/SearchBar";
import HotelCard from "../../components/hotelCard/HotelCard";
import Loader from '../../components/loader/Loader'
// import { useLocation } from "react-router-dom";


const Destinations = () => {

    const HotelCard = React.lazy(() => import("../../components/hotelCard/HotelCard"));

    const [openDate, setOpenDate] = useState(false);

    const [destData, setDestData] = useState([{}])

    
    useEffect(() => {
        const getData = async() => {
            const data = await fetch("/api/destination/hotels/WD0M");
            const json = await data.json();
            setDestData(json);
        };

        getData()
            .catch(console.error);
    }, []);
    
    // fetch("/api/destination/hotels/WD0M").then(
    //     response => response.json()
    //     ).then(
    //     data => {
    //         setDestData(data)
    //     })}, [])


    // sample static api url fetch 
    // useEffect(() => {
    //     fetch("/api/destination/hotels/WD0M").then(
    //     response => response.json()
    //     ).then(
    //     data => {
    //         setDestData(data)
    //     })}, [])
    
    const hotelcards = destData.map(item => {
        return (
            <HotelCard
                key={item.id}
                {...item}
            />  
        )})
    
    
    

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
                        <React.Suspense fallback={<Loader/>}>
                            {/* {destData.map(item => (
                                <HotelCard key={item.id} {...item}/>  
                            ))} */}
                            {hotelcards}
                        </React.Suspense> 
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default Destinations