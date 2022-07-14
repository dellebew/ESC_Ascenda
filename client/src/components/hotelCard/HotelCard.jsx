import "./hotelCard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import { faLocationDot, faRoad,  } from "@fortawesome/free-solid-svg-icons";
import ReactStars from "react-rating-stars-component"

/**  
 *  TODO: finish implementation of dynamic JSON elements
 */

export default function HotelCard(props) {
    
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
                src={props.image_details?.prefix+props.default_image_index+props.image_details?.suffix}
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
                        <span> ({props.latitude + ', ' + props.longitude})</span>
                    </div>
                    <div className="si--distance"> 
                        <FontAwesomeIcon icon={faRoad}/>
                        <span> {formatter.format(props.distance/1000)} km away from city centre</span>
                    </div>
                </div>

                <span className="si--description">
                <div dangerouslySetInnerHTML={ {__html: props.description} } />
                </span>
            </div>
            <div className="si--details">
                <div className="si--rating"> 
                    <button>{formatter.format(props.rating)}</button>
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