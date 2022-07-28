import React, { useEffect, useState} from 'react'
import "./hotels.css"
import NavBar from '../../components/navbar/Navbar'
import HotelPage from '../../components/hotelPage/HotelPage'
import { useParams } from 'react-router-dom'
import Error from '../../components/error/Error'
import Loader from '../../components/loader/Loader'
import callApi from '../../components/utils/callApi'
import RoomCard from '../../components/roomCard/RoomCard'

const Hotels = () => {

    
    const [hotelData, setHotelData] = useState()
    const [pricesData, setPricesData] = useState()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);   
    
    const state = useParams();

    useEffect(() => {
      const fetchData = async () => {
        try { 
          setLoading(true);
          // TODO: fix 404 and 429 error catching for hotel prices
          const hotelData = await callApi("hotel", state, null)
          const pricesData = await callApi("hotel/price", state, null)
          // console.log("data" + pricesData)
          setHotelData(hotelData);
          setPricesData(pricesData[0].rooms)
          // setError(null);
          setLoading(false);
        } catch(err) {
          // setError(err.message);
          setLoading(false);
        }
      };
        fetchData()
    }, []);

    // group priceData based on room type
    const groups = () => {
      if(pricesData === undefined) {
        return null
      } 
      pricesData.reduce((r, {type, images, amenities, free_cancellation, roomNormalizedDescription, ...rest}) => {
      if(!r[type]) {
        r[type] = {type, images, amenities, free_cancellation, roomNormalizedDescription, data: [rest]}
      }
      else {
        r[type].data.push(rest);
      }
      return r;
    }, {});
    }
  
    // render different room rates
    const rendered = Object.values(groups).map((item, id) => {
      // console.log(item.roomNormalizedDescription, item.images)
      return(
        <RoomCard  
          key={id} 
          type={item.type} 
          amenities={item.amenities}
          cancellation={item.free_cancellation}
          desc={item.roomNormalizedDescription}
          images={item.images}
          data={item.data}
          address={hotelData.address}
          name={hotelData.name}
          hotel_id={state.hotelId}
          />
      )
    }) 

    console.log(loading)
    console.log(hotelData)
    console.log(pricesData)

    return (
        <>
        <div className="bg-container2">
        <NavBar/>
        {loading && <Loader/>}
        {!loading && hotelData === "404" && <Error {...{img:"/404-invalid-hotel.png"}}/>}
        {!loading && hotelData === "429" && <Error {...{img:"/404-429-error.png"}}/>}
        {!loading && hotelData !== undefined && hotelData !== "429" && hotelData !== "404" 
          && pricesData !== undefined &&
          <div className='body'>
            <div className='hotel--container'>
              <div className='hotel--wrapper'>
                <HotelPage 
                    key={hotelData._id}
                    {...hotelData}/>
                <div className='hotel--rooms'>
                    <h2>Room Choices</h2>
                    {(pricesData === undefined) && <div className='not-avaliable'>
                      No avaliable rooms at the moment.
                    </div>}
                    {(pricesData !== undefined) && <div className='hotel--prices'> 
                      {rendered}
                    </div>}
                </div>
              </div>
            </div>
          </div>}
          </div>
        </>
    )
}

export default Hotels