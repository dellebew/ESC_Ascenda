import "./hotelPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import ReactStars from "react-rating-stars-component"
import ImageSlider from "../imageSlider/ImageSlider";
import { useState, useEffect } from "react"
import { Map, Marker } from "pigeon-maps"

export default function HotelPage(props) {

    const image_url = props.image_details?.prefix+0+props.image_details?.suffix
    const imageCount = props.imageCount;
    const mapCenter = [props.latitude, props.longitude]
    const [imgData, setImgData] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [showAmenities, setShowAmenities] = useState(false);

    // check if image exists, else replace with placeholder
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
            const imageExists = await loadImg(image_url);
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
        const element = document.querySelector(".desc")
        element.style.maxHeight = showMore ? '300px' : 'fit-content';
    }

    // filter through amenities object
    const filterAmenities = (amenities) => {
        try {
            const results = Object.keys(amenities).map((key) => {
                if (key === "tVInRoom") return 'TV'                    
                return key.split(/(?=[A-Z])/)
                    .map(key => key = key.charAt(0).toUpperCase() + key.slice(1)) 
                    .join(' ')
                })
            return results    
        } catch(err) {
            return []
        }
    }
        
    // filter through categories object
    const category = () => {
        try {
            const data = Object.entries(props.categories)
            const max = data.reduce(function(prev, current) {
                return (prev[1].popularity < current[1].popularity) ? prev : current
            })
            if(Math.round(max[1].popularity) === 0) {max[1].popularity = 1}
            if(max[1].name === "Overall") {max[1].name = "All Hotel"}
            return ([Math.round(max[1].popularity), max[1].name]);
        } catch(err) {
            return []
        }
    }

    // filter around amenities_ratings
    const amenitiesRatings = (ratings) => {
        try {
            const data = Object.entries(ratings).map((key) => {
                return ([key[1].name, key[1].score])
            })
            return data
        } catch(err) {
            return []
        }
    }

    // toggle amenities_ratings
    const toggleAmenities = () => {
        setShowAmenities(!showAmenities)
        const element = document.querySelector(".amenities")
        element.style.maxHeight = showAmenities ? '200px' : 'fit-content';
    }

    return (
        <div key={props.id} className='container'>
                
                <div className="hotel--body">
                    <div className="hotel--images">
                        <ImageSlider slides={imgData}/>
                    </div>
                </div>

                <div className="hotel--header">
                    <div className="hotel--summary">
                        <div className='hotel--name'>
                            <h1 id="hotelName">{props.name}</h1>
                            <ReactStars {...{value:props.rating, size:25, edit:false}} />
                        </div>
                        <div className='hotel--address'>
                            <FontAwesomeIcon icon={faLocationDot}/>
                            <span id="hotelAddress">{props.address}, {props.original_metadata?.city}, {props.original_metadata?.country}</span>
                        </div>
                        {category().length > 0 && <span className="hotel--categories">Top {category()[0]} in {category()[1]}s</span>}
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
                        <h2 className='title'>Amenities</h2>
                        <div className="hotel--amenities">
                        {filterAmenities(props.amenities).length == 0 &&
                            <span className="no-amenities">No additional amenities information avaliable at the moment.</span>
                        }
                        {filterAmenities(props.amenities).length > 0 && <>
                            <div className='with--amenities'>
                                {filterAmenities(props.amenities).map((key, i) => {
                                    return <li key={i}>{key}</li>
                                })}
                            </div>
                        </>}
                        </div>
                    
                    </div>
                    
                    <div className="hotel--description">
                        
                            <h2>Location</h2>
                            <div className="hotel--location">
                                <Map 
                                    height={300} 
                                    loading={'lazy'}
                                    defaultCenter={mapCenter}
                                    defaultZoom={18}>
                                    <Marker width={50} anchor={mapCenter}/>
                                </Map>
                            </div>
                            <h4 className="location">{`(${props.latitude}, ${props.longitude})`}</h4>
                            <h2>Ratings</h2>
                        <div className='hotel--ratings'>
                            {amenitiesRatings(props.amenities_ratings).length === 0 && 
                                <span className="no-ratings"> No ratings avaliable at the moment. </span>}
                            {amenitiesRatings(props.amenities_ratings).length > 0 && <>
                                <div className="amenities-wrapper">
                                <div className="show--amenities" onClick={toggleAmenities}>
                                    <FontAwesomeIcon icon={showAmenities ? faChevronUp : faChevronDown}/>
                                </div>
                                <div className="amenities">
                                {amenitiesRatings(props.amenities_ratings).map((key, i) => {
                                    return (<div key={i} className="amenities--ratings"> 
                                                <div key={i} className="progress">
                                                    <div className="progress-done" style={{width:`${key[1]}%`}}/>
                                                </div>
                                                <div className="progress--title" id="test"> 
                                                    <p>{key[0]}</p>
                                                    <p>{key[1]/10}</p>
                                                </div>
                                            </div>)
                                    })}
                                </div>
                                </div>
                            </>}
                        </div>
                    </div>

                </div>
        </div>
    )
}