import "./hotelCard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import defaultImage from "./image-not-found.png"
import { faLocationDot, faRoad } from "@fortawesome/free-solid-svg-icons";

/**  
 *  TODO: finish implementation of dynamic JSON elements
 */

export default function HotelCard(props) {
    
    // formatter for decimal places
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 1,      
        maximumFractionDigits: 1,
    });

    // shorten description
    const response = props.description
    const regex = /<p>(.*?)<\/p>/;
    const corresp = regex.exec(response);
    const firstParagraphWithoutHtml = (corresp) ? corresp[1] : "" // text1
    
    // replace unfound images with placeholder
    const prefix = props.image_details?.prefix
    const suffix = props.image_details?.suffix
    const handleImgError = e => {
        e.target.onError = null;
        e.target.src = defaultImage
    }


    return (
        <div key={props.id} className="searchItem">
            <img
                src={prefix+props.default_image_index+suffix}
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
                <div>{parse(firstParagraphWithoutHtml)}</div> 
                </span>
            </div>
            <div className="si--details">
                <div className="si--rating"> 
                    <button>{formatter.format(props.rating)}</button>
                    <span>Excellent</span>
                </div>
                <div className="si--pricing"> 
                    <span className="si--from">From</span>
                    <span className="si--price">$123</span>
                    <button className="si--check">Show Prices</button>
                </div>
            </div>
        </div>
    )
}