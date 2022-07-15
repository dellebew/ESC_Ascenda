import "./hotelCard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import { faLocationDot, faRoad,  } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component"

/**  
 *  TODO: finish implementation of dynamic JSON elements
 */

export default function HotelCard(props) {
    
    // replace unfound images with placeholder
    const handleImgError = e => {
        e.target.onError = null;
        e.target.src = "/image-not-found.png"
    }

    // star rating systems
    const overallRating = {
        size: 25,
        value: props.rating,
        edit: false,
        isHalf: true,
        activeColor:"#6495ED",
      };

    return (
        <div key={props.id} className="searchItem">
            <img
                src={props.image_details?.prefix+0+props.image_details?.suffix}
                alt=""
                onError={handleImgError}
                className="si--image"
            /> 
            <div className="si--desc">
                <h1 className="si--name">{props.name}</h1>
                <div className="si--small">
                    <span className="si--address">{props.address}</span>
                    <div className="si--coordinates"> 
                        <FontAwesomeIcon icon={faLocationDot}/>
                        <span> ({parseFloat(props.latitude).toFixed(5) + ', ' + parseFloat(props.longitude).toFixed(5)})</span>
                    </div>
                    <div className="si--distance"> 
                        <FontAwesomeIcon icon={faRoad}/>
                        <span> {Math.round(props.distance/1000).toFixed(1)} km away from city centre</span>
                    </div>
                </div>

                <span className="si--description">
                <div dangerouslySetInnerHTML={ {__html: props.description} } />
                </span>
            </div>
            <div className="si--details">
                <div className="si--rating"> 
                    <button>{Math.round(props.rating).toFixed(1)}</button>
                    <ReactStars {...overallRating} />
                </div>
                {/* <div className="si--pricing"> 
                    <span className="si--from">From</span>
                    <span className="si--price">$123</span>
                    <button className="si--check">Show Prices</button>
                </div> */}
            </div>
        </div>
    )
}