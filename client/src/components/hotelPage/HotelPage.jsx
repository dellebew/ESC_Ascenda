import "./hotelPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'

// TODO: finish formatting hotel page with dynamic JSON elements

export default function HotelPage(props) {
    return (
        <div>
            <div key={props.id} className='hotel--container'>
                <div className='hotel--wrapper'>
                    <div className="hotel--header">
                        <div className="hotel--summary">
                            <h1 className='hotel--name'>{props.name}</h1>
                            <div className='hotel--address'>
                                <span>{props.address}</span>
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
                            <div dangerouslySetInnerHTML={ { __html: props.description } }></div>
                        </p>
                    </div>

                    <div className='hotel--body'> 
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
                </div>
            </div>
        </div>
    )
}