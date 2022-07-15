import "./hotelPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import RoomCard from "../roomCard/RoomCard"
import ReactStars from "react-rating-stars-component"
import ImageSlider from "../imageSlider/ImageSlider";
import { useState, useEffect } from "react"
import { Map, Marker } from "pigeon-maps"

// TODO: fix logic for city hotel

export default function HotelPage(props) {

    const image_url = props.image_details?.prefix+0+props.image_details?.suffix
    const imageCount = props.imageCount;
    const mapCenter = [props.latitude, props.longitude]
    const [imgData, setImgData] = useState([]);
    const [showMore, setShowMore] = useState(false);

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
    }, []);
    
    // show / hide description
    const toggleDescription = () => {
        setShowMore(!showMore)
        const element = document.querySelector(".desc-wrapper")
        element.style.height = showMore ? '300px' : 'fit-content';
    }

    // filter through amenities object
    const filterAmenities = (amenities) => {
        try {
            const results = Object.keys(amenities).map((key) => {
                if (key == "tVInRoom") return 'TV'                    
                return key.split(/(?=[A-Z])/)
                    .map(key => key = key.charAt(0).toUpperCase() + key.slice(1)) 
                    .join(' ')
                })
            return results    
        } catch(err) {
            console.log(err)
            return []
        }
    }

    // stars rating system
    const overallRating = {
        size: 25,
        value: props.rating,
        edit: false,
        isHalf: true
      };


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
                                <span>{props.address}, {props.original_metadata?.city}, {props.original_metadata?.country}</span>
                            </div>
                            <span>Top {Math.round(props.categories?.city_hotel.popularity)} in {props.categories?.city_hotel.name}s</span>
                        </div>
                        <div className="hotel--price">
                            <span className="price">$123</span>
                            <span className="subtext">for 1 room for 1 night</span>
                            <button className="hotel--choose">View Deal</button>
                        </div>
                    </div>
                    
                    <div className='hotel--body2'>
                        <div className='hotel--description'>
                            <h2>About</h2>
                            <div className="desc-wrapper">
                                <div className="desc" dangerouslySetInnerHTML={ {__html: props.description} }/>
                                <div className="show--more" onClick={toggleDescription}>
                                    <span>{showMore ? "Show Less " : "Show More "}</span>
                                    <FontAwesomeIcon icon={showMore ? faChevronUp : faChevronDown}/>
                                </div>
                            </div>
                            <h2>Amenities</h2>
                            <div className='hotel--amenities'>
                                {filterAmenities(props.amenities).map((key, i) => {
                                    return <li key={i}>{key}</li>
                                })}
                            </div>
                        
                        </div>
                        
                        <div className="hotel--description">
                            <div className='hotel--details'>
                                <h2>Ratings</h2>
                                <div className="hotel--rating">       
                                    <span>
                                        <button>{Math.round(props.rating).toFixed(1)}</button>
                                        Excellent
                                    </span>
                                </div>
                                
                                <h2>Location</h2>
                                <div className="hotel--location">
                                    <Map className="map" 
                                        height={300} 
                                        loading={'lazy'}
                                        defaultCenter={mapCenter}
                                        defaultZoom={18}>
                                        <Marker width={50} anchor={mapCenter}/>
                                    </Map>
                                </div>
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