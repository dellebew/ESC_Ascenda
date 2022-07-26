import "./destinations.css"
import React, { useState, useEffect } from 'react'
import ReactPaginate from 'react-paginate';
import NavBar from "../../components/navbar/Navbar"
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import HotelCard from "../../components/hotelCard/HotelCard";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import callApi from "../../components/utils/callApi";
import Error from "../../components/error/Error";

const Destinations = () => { 

    const state = useParams();
    const navigate = useNavigate();
    console.log(state);
    
    const [page, setPage] = useState(state.page)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);  
    const [items, setItems] = useState()
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        const fetchData = async() => {
            try{
                setLoading(true);
                console.log(state)
                // if (state.adultsQty < 1 || state.childrenQty < 0 || state.roomQty < 0 || state.page < 0) {
                //     throw Error("URL is not valid");
                // }
                const data = await callApi('destination/prices', state);
                console.log(data[1].length < 1)
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
        navigate(`../destinations/${state.destId}/${state.checkin}/${state.checkout}/${state.lang}/${state.currency}/${state.code}/${state.adultsQty}/${state.childrenQty}/${state.roomQty}/${state.page}`)
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
        {loading && <Loader/>}
        {!loading && (items !== undefined) &&  <div className="body">                        
            <div className="list--container">
                <div className="list--wrapper">
                    
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