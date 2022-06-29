import React from 'react'
import "./hotel.css"
import Navbar from '../../components/navbar/Navbar'
import RoomCard from '../../components/roomCard/RoomCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import SearchBar from '../../components/searchBar/SearchBar'
import axios from "axios"

const Hotel = () => {
    return (
        <div>
            <Navbar />
            <SearchBar />
            <div className='hotel--container'>
                <div className='hotel--wrapper'>

                    <div className="hotel--header">
                        <div className="hotel--summary">
                            <h1 className='hotel--name'>Grand Copthorne Waterfront Singapore</h1>
                            <div className='hotel--address'>
                                <span>392 Havelock Road, Robertson Quay, 169663 Singapore, Singapore</span>
                            </div>
                            <span className='hotel--shortdesc'>Luxury hotel with 1 outdoor pools, connected to a shopping center, near Orchard Road </span>
                        </div>
                        <div className="hotel--price">
                            <span className="price">$123</span>
                            <span className="subtext">for 1 room for 1 night</span>
                            <button className="hotel--choose">Choose Room</button>
                        </div>
                    </div>
                    
                    <div className="hotel--body">
                        <img className="hotel--images" 
                            src="https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/249556539.jpg?k=dd3501ee1cd64e6d54cf8a6459119080a2b95cee06fe4a3be5153454fa4293de&o=&hp=1"/>
                        <div className='hotel--details'>
                            <div className="hotel--location">
                                <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.wired.com%2Fphotos%2F5a6a61938c669c70314b300d%2Fmaster%2Fw_2400%2Cc_limit%2FGoogle-Map-US_10.jpg&f=1&nofb=1"/>
                                <div className="hotel--state">
                                    <FontAwesomeIcon icon={faLocationDot}/>
                                    City, State, Postal Code
                                </div>
                            </div>
                            <div className="hotel--rating"> 
                                <span>
                                    <button>8.9</button>
                                    Excellent
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='hotel--body'>
                        <p className='hotel--description'>
                            <h2>Hotel Description</h2> <br/>
                            Grand Copthorne Waterfront is located along the Singapore River. A 5-minute drive from Orchard Road, the hotel offers an outdoor pool, 4 restaurants and free parking. Free WiFi is available throughout the hotel.
                            Luxurious rooms come with floor-to-ceiling windows that offer city or river views. Amenities include a flat-screen TV with cable channels that include local and international channels in languages such as Chinese and English. Free toiletries include toothbrush and toothpaste.
                            Guests can exercise at the on-site gym facility. Multi-lingual staff can assist arrangements for sightseeing tours at the on-site tour desk, which supports languages such as English, Malay and Chinese. For convenience, laundry and dry cleaning services are also provided. Newspapers are available in English and Chinese.
                        </p>
                        <div className="hotel--details2">
                            <h3>Contact Details</h3>
                            <div className="hotel--contact">
                                <span className='hotel--phone'><b>Telephone:</b> (country-code) 00000000</span>
                                <span className='hotel--fax'><b>Fax:</b> (country-code) FAX</span>
                                <span className='hotel--email'><b>Email:</b> loser@email.com</span>
                            </div>
                            <h3>Amenities</h3>
                            <div className='hotel--amenities'>
                                <span>Free WiFi</span>
                                <span>Free parking</span>
                                <span>Non-smoking</span>
                                <span>Air Conditioning</span>
                            </div>
                        </div>
                        
                    </div>

                    <div className='hotel--rooms'>
                        <h2>Room Choices</h2>
                        <RoomCard />
                        <RoomCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hotel