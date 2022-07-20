import React, { useEffect, useState} from 'react'
import "./hotels.css"
import NavBar from '../../components/navBar/Navbar'
import HotelPage from '../../components/hotelPage/HotelPage'
import { useLocation } from 'react-router-dom'
import Error from '../error/Error'
import Loader from '../../components/loader/Loader'
import callApi from '../../components/utils/callApi'

const Hotels = () => {

    const location = useLocation(); 
    const [hotelData, setHotelData] = useState([])
    const [pricesData, setPricesData] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   
    
    const id = location.pathname.split('/').at(-1)
    const state = {hotelId: id,
      destId: "WD0M",
      checkin:"2022-07-25",
      checkout:"2022-07-29",
      lang:"en_US",
      currency:"SGD",
      code:"SG",
      guests:"2"}

    useEffect(() => {
      const fetchData = async () => {
        try { 
          setLoading(true);
          // TODO: consider error for not successful prices data pull
          const hotelData = await callApi("hotel", state, null)
          const pricesData = await callApi("hotel/price", state, null)
          console.log("data" + pricesData)
          if (hotelData === null) {
            throw Error("hotelData not found");
          }
          setHotelData(hotelData);
          setPricesData(pricesData)
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
        {!loading && !error && pricesData.length > 0 &&
          <div className='body'>
            <div className='hotel--container'>
              <div className='hotel--wrapper'>
                <HotelPage 
                    key={hotelData._id}
                    {...hotelData}/>
                <div className='hotel--rooms'>
                    <h2>Room Choices</h2>
                </div>
              </div>
            </div>
          </div>}
        </>
    )
}

export default Hotels