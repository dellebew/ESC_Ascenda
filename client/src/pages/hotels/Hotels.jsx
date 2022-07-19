import React, { useEffect, useState} from 'react'
import "./hotels.css"
import Loader from '../../components/loader/Loader'
import Navbar from '../../components/navbar/Navbar'
import HotelPage from '../../components/hotelPage/HotelPage'
import { useLocation } from 'react-router-dom'

const Hotels = () => {

    const [hotelData, setHotelData] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   
    const url = "/api/hotel/11fD";
    const location = useLocation();
    console.log(location)

    async function callApi(id){
      const response = await fetch(`/api/hotel/${id}`);
      const data = await response.json()
      console.log("data: " + data)
      return data
  }

    useEffect(() => {
      const fetchData = async () => {
        try { 
          setLoading(true);
          const data = await callApi("11fd")
          console.log("data" + data)
          if (data === null) {
            console.log("found null")
            throw Error("Data not found");
          }
          setHotelData(data);
          setError(null);
          setLoading(false);
        } catch(err) {
          setError(err.message);
        }
      };

        fetchData()
    }, []);

    return (
        <>
        {error && <h2>Module not found</h2>}
        {loading && <div className='loader-container'/>}
        {!loading && !error && <div>
            <Navbar />
                <HotelPage 
                   key={hotelData._id}
                    {...hotelData}
                />
        </div>}
        </>
    )
}

export default Hotels