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
    const [items, setItems] = useState()
    const [pageCount, setPageCount] = useState(0);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchData = async() => {
            try{
                setLoading(true);
                const data = await callApi('destination/prices', state);
                setItems(data[1])
                setPageCount(data[0]);
                setLoading(false);  
            } catch (err) {
                setLoading(false);
            }
        };
        fetchData()
    }, [page]);

    function handlePageClick(data) {
        let currentPage = data.selected 
        // state.page = currentPage;
        // navigate(`../destinations/${state.destId}/${state.checkin}/${state.checkout}/${state.lang}/${state.currency}/${state.code}/${state.adultsQty}/${state.childrenQty}/${state.roomQty}/${state.page}`)
        navigate(`../destinations/${state.destId}/${state.checkin}/${state.checkout}/${state.lang}/${state.currency}/${state.code}/${state.adultsQty}/${state.childrenQty}/${state.roomQty}/${currentPage}`)
        window.scrollTo(0, 0)
        setPage(currentPage)
    }

    return (
        <>
        <NavBar />
        <div className= "bg-container">
        {loading && <Loader/>}
        {!loading && items === "404" && <div className="server_404"><Error {...{img:"/404-invalid-dest.png"}}/></div>}
        {!loading && items === "429" && <div className="server_429"><Error {...{img:"/404-429-error.png"}}/></div>}
        {!loading && items !== undefined && items !== "404" && items !== "429" &&  <div className="body">                        
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