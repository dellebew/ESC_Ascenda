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
          setHotelData(hotelData);
          setPricesData(pricesData)
          // setPricesData(pricesData[0].rooms)
          // setError(null);
          setLoading(false);
        } catch(err) {
          // setError(err.message);
          setLoading(false);
        }
      };
        fetchData()
    }, []);

    // filter priceData based on room type
    const filterRooms = (pricesData) => {
      try {
        const results = pricesData.reduce((r, {type, images, amenities, roomNormalizedDescription, ...rest}) => {
              if(!r[type]) {
                console.log(roomNormalizedDescription)
              r[type] = {type, images, amenities, roomNormalizedDescription, data: [rest]}
            }
            else {
              r[type].data.push(rest);
            }
            return r;
        }, {});
        console.log(results)
        return results
      } catch (err) {
        return null
      }
    }

    console.log(loading)
    console.log(hotelData)
    console.log(pricesData)
    console.log(filterRooms(pricesData))

    return (
        <>
        <div className="bg-container2">
        <NavBar/>
        {loading && <Loader/>}
        {!loading && hotelData === "404" && pricesData === "404" && <div className='server_404'><Error {...{img:"/404-invalid-hotel.png"}}/></div>}
        {!loading && (hotelData === "429" || pricesData === "429") && <div className='server_429'><Error {...{img:"/404-429-error.png"}}/></div>}
        {!loading
          && <div className='body'>
            <div className='hotel--container'>
              <div className='hotel--wrapper'>
                {hotelData !== undefined && hotelData !== "429" && hotelData !== "404" 
                 && <HotelPage 
                    key={hotelData._id}
                    {...hotelData}/>}
                <div className='hotel--rooms'>
                    <h2>Room Choices</h2>
                    {(filterRooms(pricesData) === null) &&
                    <div className='not-avaliable'>
                      No avaliable rooms at the moment.
                    </div>}
                    {filterRooms(pricesData) !== null
                      && <div className='hotel--prices'> 
                        {Object.values(filterRooms(pricesData)).map((item, id) => {
                          return(
                            <RoomCard  
                                  key={id} 
                                  type={item.type} 
                                  amenities={item.amenities}
                                  desc={item.roomNormalizedDescription}
                                  images={item.images}
                                  data={item.data}
                                  address={hotelData.address}
                                  name={hotelData.name}
                                  hotel_id={state.hotelId}
                                />
                          )})} 
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