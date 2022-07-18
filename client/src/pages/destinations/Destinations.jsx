import "./destinations.css"
import React, { useState, useEffect } from 'react'
import Navbar from "../../components/navbar/Navbar"
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ReactPaginate from 'react-paginate';
import SearchBar from "../../components/searchBar/SearchBar";
import axios from "axios";
import HotelCard from "../../components/hotelCard/HotelCard";
import { useLocation } from "react-router-dom";
import useFetch from "../../components/utils/useFetch";


const Destinations = () => {

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([{}])
    const [pageCount, setPageCount] = useState(0);
    
    const pageLimit = 10
    
    useEffect(() => {
        const getData = async() => {
            setLoading(true);
            const res = await fetch("/api/destination/hotels/4FBY/1");
            // const res = await axios.get("https://hotelapi.loyalty.dev/api/hotels?destination_id=RsBU");
            const data = await res.json();
            setPageCount(pageLimit);
            setLoading(false);
        };

        getData()
            .catch(console.error);
    }, [pageLimit]);
    
    const hotelcards = items.map(item => {
        return (
            <HotelCard
                key={item.id}
                {...item}
            />  
    )})
    
    // const handlePageClick = async(data) => {
    //     let currentPage = data.selected 
    //     const newPageData = await fetchPage(currentPage);
    //     setItems(newPageData);
    //     window.scrollTo(0,0);
    //     };
    
    
    // const fetchPage = async(currentPage) => {
    //     const res = await fetch(`/api/destination/hotels/WD0M/${currentPage}`);
    //     const data = await res.json();
    //     return data;
    // }
    

/** 
    const location = useLocation(); // retrieves data from home page
    const [destination, setDestination] = useState(location.state.destination)
    const [date, setDate] = useState(location.state.date)
    const [options, setOptions] = useState(location.state.option)
*/

    return (
        <>
        {loading ? (
          <div className="loader-container"/>
        ) : (
          <div className="main-content">
            <Navbar />
            <SearchBar />
            <div className="body">            
                
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
                            {hotelcards}
                            {/* <ReactPaginate
                                breakLabel="..."
                                nextLabel="next >"
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={2}
                                marginPagesDisplayed={2}
                                pageCount={pageCount}
                                previousLabel="< prev"
                                renderOnZeroPageCount={null}
                                containerClassName={"pagination"}
                                disabledClassName={"paginationDisabled"}
                                activeClassName={"paginationActive"}/>   */}
                        </div>
                    </div>
                </div>
            </div>
            </div> )}
        </>
    )
}

export default Destinations