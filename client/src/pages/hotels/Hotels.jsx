import React, { useEffect, useState} from 'react'
import "./hotels.css"
import Navbar from '../../components/navbar/Navbar'
import HotelPage from '../../components/hotelPage/HotelPage'
import { useLocation } from 'react-router-dom'
import ErrorPage from '../../components/errorPage/ErrorPage'

const Hotels = () => {

    const [hotelData, setHotelData] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   
    const location = useLocation().pathname;
    
    const id = location.split('/').at(-1)
    console.log(id)

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
          const data = await callApi(id)
          console.log("data" + data)
          if (data === null) {
            throw Error("Data not found");
          }
          setHotelData(data);
          setError(null);
          setLoading(false);
        } catch(err) {
          setError(err.message);
          setLoading(false);
        }
      };

        fetchData()
    }, []);

    return (
        <>
        {error && <ErrorPage/>}
        {loading && <div className='loader-container'/>}
        {!loading && !error && <div>
            <Navbar/>
                <HotelPage 
                   key={hotelData._id}
                    {...hotelData}
                />
        </div>}
        </>
    )
}

export default Hotels