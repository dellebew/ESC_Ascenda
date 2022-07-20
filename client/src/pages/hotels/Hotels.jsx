import React, { useEffect, useState} from 'react'
import "./hotels.css"
import NavBar from '../../components/navBar/NavBar'
import HotelPage from '../../components/hotelPage/HotelPage'
import { useLocation } from 'react-router-dom'
import Error from '../error/Error'
import Loader from '../../components/loader/Loader'

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
        {error && <Error/>}
        {loading && <Loader/>}
        {!loading && !error && <div>
            <NavBar/>
                <HotelPage 
                   key={hotelData._id}
                    {...hotelData}
                />
        </div>}
        </>
    )
}

export default Hotels