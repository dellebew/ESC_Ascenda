import React, { useEffect, useState} from 'react'
import "./hotels.css"
import NavBar from '../../components/navBar/Navbar'
import HotelPage from '../../components/hotelPage/HotelPage'
import { useLocation } from 'react-router-dom'
import Error from '../error/Error'
import Loader from '../../components/loader/Loader'
import callApi from '../../components/utils/callApi'
import RoomCard from '../../components/roomCard/RoomCard'
import HotelCard from '../../components/hotelCard/HotelCard'

const Hotels = () => {

    const location = useLocation(); 
    const [hotelData, setHotelData] = useState([])
    const [pricesData, setPricesData] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   
    
    const id = location.pathname.split('/').at(-1)
    const state = {hotelId: id,
      destId: "11fD",
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
          // console.log("data" + pricesData)
          if (hotelData === null) {
            throw Error("hotelData not found");
          }
          setHotelData(hotelData);
          setPricesData(pricesData[0].rooms)
          setError(null);
          setLoading(false);
        } catch(err) {
          setError(err.message);
          setLoading(false);
        }
      };
        fetchData()
    }, []);

    // group priceData based on room type
    const groups = pricesData.reduce((r, {type, amenities, free_cancellation, roomNormalizedDescription, ...rest}) => {
      if(!r[type]) {
        r[type] = {type, amenities, free_cancellation, roomNormalizedDescription, data: [rest]}
      }
      else {
        r[type].data.push(rest);
      }
      return r;
    }, {});

    // render different room rates
    const rendered = Object.values(groups).map((item, id) => {
      console.log(item.type, item.roomNormalizedDescription, item.data);
      return(
        <RoomCard key={id} 
          type={item.type} 
          amenities={item.amenities}
          cancellation={item.free_cancellation}
          desc={item.roomNormalizedDescription}
          data={item.data}/>
      )
    }) 

    return (
        <>
        <NavBar/>
        {error && <Error/>}
        {loading && <Loader/>}
        {!loading && !error &&
          <div className='body'>
            <div className='hotel--container'>
              <div className='hotel--wrapper'>
                <HotelPage 
                    key={hotelData._id}
                    {...hotelData}/>
                <div className='hotel--rooms'>
                    <h2>Room Choices</h2>
                    {(pricesData == undefined) && <div className='not-avaliable'>
                      No avaliable rooms at the moment.
                    </div>}
                    {(pricesData != undefined) && <div className='hotel--prices'> 
                      {rendered}
                    </div>}
                </div>
              </div>
            </div>
          </div>}
        </>
    )
}

export default Hotels