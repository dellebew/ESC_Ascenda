import React, {Suspense, useEffect, useState} from 'react'
import "./hotels.css"
import Loader from '../../components/loader/Loader'
import Navbar from '../../components/navbar/Navbar'
import SearchBar from '../../components/searchBar/SearchBar'
import HotelPage from '../../components/hotelPage/HotelPage'

const Hotels = () => {

    const HotelPage = React.lazy(() => import("../../components/hotelPage/HotelPage"));
    const [hotelData, setHotelData] = useState([{}])

    // sample static api url fetch 
    useEffect(() => {
        const getData = async() => {
            const data = await fetch("/api/hotel/diH7");
            const json = await data.json();
            setHotelData(json);
        };

        getData()
            .catch(console.error);
    }, []);



    return (
        <div>
            <Navbar />
            <SearchBar />
            <Suspense fallback={<Loader/>}> 
                <HotelPage 
                   key={hotelData._id}
                    {...hotelData}
                />
            </Suspense>
    </div>
    )
}

export default Hotels