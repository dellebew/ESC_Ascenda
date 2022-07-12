import "./hotelPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import RoomCard from "../roomCard/RoomCard"
import parse from "html-react-parser";
import ReactStars from "react-rating-stars-component"

// TODO: finish formatting hotel page with dynamic JSON elements

export default function HotelPage(props) {

    // formatter for 1dp
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,      
        maximumFractionDigits: 1,
    });

    // replace unfound images with placeholder
    const handleImgError = e => {
        e.target.onError = null;
        e.target.src = "/image-not-found.png"
    }

    //Rating System
    const overallRating = {
        size: 25,
        value: props.rating,
        edit: false,
        isHalf: true
      };

    // const amenitiesRating = props.amenities_ratings
    // amenitiesRating.map(item )

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
                            <ReactStars {...overallRating} />
                        </div>
                        <div className="hotel--price">
                            <span className="price">$123</span>
                            <span className="subtext">for 1 room for 1 night</span>
                            <button className="hotel--choose">Choose Room</button>
                        </div>
                    </div>
                    
                    <div className="hotel--body">
                        <img className="hotel--images" 
                            src={props.image_details?.prefix+props.default_image_index+props.image_details?.suffix}
                            alt=""
                            onError={handleImgError}
                        />
                        <div className='hotel--details'>
                            <div className="hotel--location">
                                <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.wired.com%2Fphotos%2F5a6a61938c669c70314b300d%2Fmaster%2Fw_2400%2Cc_limit%2FGoogle-Map-US_10.jpg&f=1&nofb=1"/>
                                <div>{props.original_metadata?.city}, {props.original_metadata?.country}</div>
                                <div className="hotel--state">
                                    <FontAwesomeIcon icon={faLocationDot}/>
                                    <span> ({props.latitude + ', ' + props.longitude})</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='hotel--body'>
                        <div className='hotel--description'>
                            <h2>About</h2>
                            <div className="hotel--rating">       
                                <span>
                                    <button>{formatter.format(props.rating)}</button>
                                    Excellent
                                </span>
                            </div>
                            <p dangerouslySetInnerHTML={ {__html: props.description} }/>
                        </div>

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

                    <div className='hotel--body'> 
                        
                    <div className='hotel--rooms'>
                        <h2>Room Choices</h2>
                        <RoomCard />
                        <RoomCard />
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}