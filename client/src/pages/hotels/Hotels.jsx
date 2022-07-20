import React, { useEffect, useState} from 'react'
import "./hotels.css"
import NavBar from '../../components/navBar/NavBar'
import HotelPage from '../../components/hotelPage/HotelPage'
import { useLocation } from 'react-router-dom'
import Error from '../error/Error'
import Loader from '../../components/loader/Loader'
import callApi from '../../components/utils/callApi'

const Hotels = () => {

    const location = useLocation(); 
    const [hotelData, setHotelData] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   
    
    const id = location.pathname.split('/').at(-1)
    console.log(location.state)

    useEffect(() => {
      const fetchData = async () => {
        try { 
          setLoading(true);
          const data = await callApi("hotel", location.state, null)
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
        <NavBar/>
        {error && <Error/>}
        {loading && <Loader/>}
        {!loading && !error && <div>
                <HotelPage 
                   key={hotelData._id}
                    {...hotelData}
                />
        </div>}
        </>
    )
}

export default Hotels