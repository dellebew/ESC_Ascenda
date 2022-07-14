import React, {Suspense, useEffect, useState} from 'react'
import "./hotels.css"
import Loader from '../../components/loader/Loader'
import Navbar from '../../components/navbar/Navbar'
import SearchBar from '../../components/searchBar/SearchBar'
import HotelPage from '../../components/hotelPage/HotelPage'

const Hotels = () => {

    const HotelPage = React.lazy(() => import("../../components/hotelPage/HotelPage"));
    const [hotelData, setHotelData] = useState([{}])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   
    const url = "/api/hotel/050G";



    useEffect(() => {
      const fetchData = async () => {
        try { 
          // TODO: fix invalid res reqs
          const res = await fetch(url);
          console.log("res contains", res.ok);
          if (!res.ok) {
            throw Error("Unable to request data for this resource");
          }
          const data = await res.json();
          console.log(data);
          if (data === null) {
            console.log("found null")
            throw Error("Data not found");
          }
          setHotelData(data);
          setError(null);
          setLoading(false);
        } catch(err) {
          setError(err.message);
          console.log(err.message);
          setLoading(false);
        }
      };

        fetchData(); 
    }, [url]);

    return (
        <>
        {error && <h2>Module not found</h2>}
        {loading && <Loader/>}
        {!loading && !error && <div>
            <Navbar />
            <SearchBar />
            <Suspense fallback={<Loader/>}> 
                <HotelPage 
                   key={hotelData._id}
                    {...hotelData}
                />
            </Suspense>
        </div>}
        </>
    )
}

export default Hotels