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
                const data = await callApi('destination/prices', state);
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

    return (
        <>
        <NavBar />
        <div class = "bg-container">
        {error && <Error {...{img:"/404-invalid-dest.png"}}/>}
        {loading && <Loader/>}
        {!loading && items === undefined && <Error {...{img:"/404-429-error.png"}}/>}
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
        </div>
        </>
    )
}


export default Destinations