import "./destinations.css"
import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import NavBar from "../../components/navBar/Navbar"
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import SearchBar from "../../components/searchBar/SearchBar";
import HotelCard from "../../components/hotelCard/HotelCard";
import { useLocation } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import callApi from "../../components/utils/callApi";
import Error from "../error/Error";
const Destinations = () => {

/** 
    const [destination, setDestination] = useState(location.state.destination)
    const [date, setDate] = useState(location.state.date)
*/

    const location = useLocation();

    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);  
    const [items, setItems] = useState()
    const [pageCount, setPageCount] = useState(0);

    const id = location.pathname.split('/').at(-1)
    // const state = location.state
    const state = {destId: id,
        checkin:"2022-07-25",
        checkout:"2022-07-29",
        lang:"en_US",
        currency:"SGD",
        code:"SG",
        guests:"2"}
    console.log(id);

    useEffect(() => {
        const fetchData = async() => {
            try{
                setLoading(true);
                // TODO: determine actual number of pages
                const data = await callApi('destination/prices', state, '0');
                console.log(data)
                if (data[1] === undefined) {
                    throw Error("Data not found");
                  }
                setItems(data[1])
                setPageCount(data[0]);
                setLoading(false);  
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData()
    }, [id]);

    console.log("items: " + items == undefined);

    // function to handle request to another page.
    const handlePageClick = async(data) => {
        let currentPage = data.selected 
        // console.log(currentPage)
        const newPageData = await callApi('destination/prices', id, currentPage);
        setItems(newPageData[1]);
        window.scrollTo(0,0);
        };


    return (
        <>
        <NavBar />
        {error && <Error/>}
        {/* <SearchBar /> */}
        {loading && <Loader/>}
        {!loading && (items !== undefined) &&  <div className="body">                        
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
                        {items.map((item) => 
                        <HotelCard key={item.id}
                                {...item}/>
                        )}
                        
                        <ReactPaginate
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
                            activeClassName={"paginationActive"}
                        />
                    </div>
                </div>
            </div>
        </div>}
        </>
    )
}


export default Destinations