import "./destinations.css"
import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import NavBar from "../../components/navBar/NavBar"
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import SearchBar from "../../components/searchBar/SearchBar";
import HotelCard from "../../components/hotelCard/HotelCard";
import { useLocation } from "react-router-dom";
import Loader from "../../components/loader/Loader";


const Destinations = () => {

    const [openDate, setOpenDate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState()
    const [pageCount, setPageCount] = useState(0);
    
    async function callApi(page){
        const response = await fetch(`/api/destination/prices/WD0M/${page}`);
        const data = await response.json()
        // console.log("data: " + data)
        return data
    }

    useEffect(() => {
        const getData = async() => {
            setLoading(true);
            const data = await callApi(0);
            setItems(data[1])
            setPageCount(data[0]);
            setLoading(false);
        };

        getData()
            .catch(console.error);
    }, [pageCount]);

    // console.log("items: " + items);

    // function to handle request to another page.
    const handlePageClick = async(data) => {
        let currentPage = data.selected 
        // console.log(currentPage)
        const newPageData = await callApi(currentPage);
        setItems(newPageData[1]);
        window.scrollTo(0,0);
        };

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
        <>
        <NavBar />
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