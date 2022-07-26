import RatesCard from "../ratesCard/RatesCard"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import "./roomCard.css"
import { useState, useEffect } from "react";
import ImageSlider from "../imageSlider/ImageSlider";

export default function RoomCard(props) {
    
    const [imgData, setImgData] = useState([]);
    const [showAmenities, setShowAmenities] = useState(false);

    useEffect(() => {
        const images = props.images.map((item) => {return item.url})
        if(images.length > 0) {
            setImgData(images)
        }
    }, []);

    // filter through prices
    const prices = () => {
        try {
            const data = Object.entries(props.categories)
            const max = data.reduce(function(prev, current) {
                return (prev[1].popularity < current[1].popularity) ? prev : current
            })
            if(Math.round(max[1].popularity) == 0) {max[1].popularity = 1}
            if(max[1].name == "Overall") {max[1].name = "All Hotel"}
            return ([Math.round(max[1].popularity), max[1].name]);
        } catch(err) {
            return []
        }
    }

    const rates = props.data.map((item, id) => {
        //add address variable
        item["address"] = props.address;
        item["hotelId"] = props.hotelId;
        item["hotelName"] = props.name;
        return(
            <RatesCard key={id}
                {...item} />
        )})
    
    // toggle amenities_ratings
    const toggleAmenities = () => {
        setShowAmenities(!showAmenities)
        const element = document.querySelector(".room--amenities")
        element.style.maxHeight = showAmenities ? '150px' : 'fit-content';
    }

    return (
        <div key="props.key" className="roomCard">
            <div className="room--container">
                <div className="room-body">
                    <div className="room--images">
                        {imgData.length > 0  && 
                        <img
                            src={imgData[0]}
                            alt="room image"
                        /> }
                        {imgData.length == 0 && <img
                            src="/image-unavaliable.png"
                            alt="room image"
                        /> }
                    </div>
                    <div className="room--details">
                        <h3 className="room--normalized">{props.desc}</h3>
                        {props.cancellation && <div className="free-cancellation"> ✓ Free Cancellation</div>}
                        <h4>Amenities</h4>
                        <div className="wrapper">
                            <div className='room--amenities'>
                                {props.amenities.map((key, i) => {
                                    return <li key={i}>{key}</li>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="room--options">
                <div className="room--header">Market Rates</div>
                <div className="room--body">
                    {rates}
                </div>

            </div>
        </div>
    )
}
