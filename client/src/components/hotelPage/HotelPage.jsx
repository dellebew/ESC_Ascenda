import "./hotelPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import RoomCard from "../roomCard/RoomCard"
import ReactStars from "react-rating-stars-component"
import ImageSlider from "../imageSlider/ImageSlider";
import { useState, useEffect } from "react"

// TODO: finish formatting hotel page with dynamic JSON elements

export default function HotelPage(props) {

    const image_url = props.image_details?.prefix+0+props.image_details?.suffix
    const imageCount = props.imageCount;
    const [imgData, setImgData] = useState([]);

    // check if image exists
    const loadImg = (url) => {
        const img = new Image();
        return new Promise((resolve, reject) => {
            img.src = url;
            img.onload = () => resolve(true);
            img.onerror = () => reject(false);
        });
    };

    // sets image array if it exists
    useEffect(() => {
        const fetchData = async () => {
          try { 
            const res = await loadImg(image_url);
            let imageArray = []
            for (let i = 0; i < imageCount; i++) {
                imageArray.push({image:props.image_details?.prefix
                                        +i+props.image_details?.suffix})
            }
            setImgData(imageArray);
          } catch(err) {
          }
        };

        fetchData(); 
    }, [image_url]);


    // formatter for 1dp
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,      
        maximumFractionDigits: 1,
    });
    

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
                    
                    <div className="hotel--body">
                        <div className="hotel--images">
                            <ImageSlider slides={imgData}/>
                        </div>
                    </div>

                    <div className="hotel--header">
                        <div className="hotel--summary">
                            <div className='hotel--name'>
                                <h1>{props.name}</h1>
                                <ReactStars {...overallRating} />
                            </div>
                            <div className='hotel--address'>
                                <FontAwesomeIcon icon={faLocationDot}/>
                                <span>{props.address}, {props.original_metadata.city}, {props.original_metadata.country}</span>
                            </div>
                            <span>Top {Math.round(props.categories.city_hotel.popularity)} in {props.categories.city_hotel.name}s</span>
                        </div>
                        <div className="hotel--price">
                            <span className="price">$123</span>
                            <span className="subtext">for 1 room for 1 night</span>
                            <button className="hotel--choose">View Deal</button>
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