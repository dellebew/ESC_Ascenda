import React, {Suspense, useEffect, useState} from 'react'
import "./hotels.css"
import Navbar from '../../components/navbar/Navbar'
import HotelPage from '../../components/hotelPage/HotelPage'

const Hotels = () => {

    const [hotelData, setHotelData] = useState([{}])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try { 
          // TODO: fix invalid res reqs
          const res = await fetch("/api/hotel/11fD");
          // console.log("res contains", res.ok);
          if (!res.ok) {
            throw Error("Unable to request data for this resource");
          }
          const data = await res.json();
          // console.log(data);
          if (data === null) {
            console.log("found null")
            throw Error("Data not found");
          }
          setHotelData(data);
          setError(null);
          setLoading(false);
        } catch(err) {
          setError(err.message);
          // console.log(err.message);
          setLoading(false);
        }
      };

        fetchData(); 
    }, []);

    return (
      <div className="container">
        {/* {/* {error && <h2>Module not found</h2>} */}
        {loading ? (
          <div className="loader-container"/>
        ) : (
          <div className="main-content">
            <Navbar /> 
            <HotelPage 
                key={hotelData._id}
                {...hotelData}
            />
          </div>
        )}
      </div>) 
}

export default Hotels