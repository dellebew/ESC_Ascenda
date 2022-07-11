import React, {useEffect, useState} from 'react'
import "./hotel.css"
import Navbar from '../../components/navbar/Navbar'
import RoomCard from '../../components/roomCard/RoomCard'
import SearchBar from '../../components/searchBar/SearchBar'
import HotelPage from '../../components/hotelPage/HotelPage'

const Hotel = () => {

    const [hotelData, setHotelData] = useState([{}])

    // sample static api url fetch 
    useEffect(() => {
        fetch("/api/hotel/diH7").then(
        response => response.json()
        ).then(
        data => {
            setHotelData(data)
        }
        )
    }, [])

    return (
        <div style={{
            backgroundImage:`url(https://unsplash.com/photos/_pPHgeHz1uk)`
          }}>
            <Navbar />
            <SearchBar />
        {(typeof hotelData === "undefined") ? (
            <p>Loading...</p>
        ): (
            <div>
                <HotelPage 
                    key={hotelData._id}
                    {...hotelData}
                />
                <div className='hotel--rooms'>
                    <h2>Room Choices</h2>
                    <RoomCard />
                    <RoomCard />
                </div>
            </div>
        )}
    </div>
    )
}

export default Hotel