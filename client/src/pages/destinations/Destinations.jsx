import "./destinations.css"
import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import NavBar from "../../components/navBar/Navbar"
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import SearchBar from "../../components/searchBar/SearchBar";
import HotelCard from "../../components/hotelCard/HotelCard";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import callApi from "../../components/utils/callApi";
import Error from "../error/Error";
const Destinations = () => { 

/** 
    const [destination, setDestination] = useState(location.state.destination)
    const [date, setDate] = useState(location.state.date)
*/

    const state = useParams();
    const navigate = useNavigate();
    console.log(state);
    
    const [page, setPage] = useState(state.page)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);  
    const [items, setItems] = useState()
    const [pageCount, setPageCount] = useState(0);

    const location = useLocation();
    const searchBar = location.state;
    const destination_id = searchBar.uid;
    const country_code = searchBar.c_id;
    const start_date = searchBar.start;
    const end_date = searchBar.end;
    const language = searchBar.lang;
    const currency = searchBar.moneyType;
    const total_no_of_guests = searchBar.people;
    const number_of_rooms = searchBar.rooms;

    useEffect(() => {
        const fetchData = async() => {
            try{
                setLoading(true);
                // TODO: determine actual number of pages
                const data = await callApi('destination/prices', state);
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
    }, [page]);

    const handlePageClick = (data) => {
        let currentPage = data.selected 
        state.page = currentPage;
        navigate(`../destinations/${state.destId}/${state.checkin}/${state.checkout}/${state.lang}/${state.currency}/${state.code}/${state.guests}/${state.page}`, {
        })
        setPage(currentPage)
    }

    // function to handle request to another page.
    // const handlePageClick = async(data) => {
    //     let currentPage = data.selected 
    //     state.page = currentPage;
    //     // console.log(currentPage)
    //     const newPageData = await callApi('destination/prices', state);
    //     setItems(newPageData[1]);
    //     window.scrollTo(0,0);
    //     };


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
                            initialPage={parseInt(page)}
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