import RatesCard from "../ratesCard/RatesCard"
import "./roomCard.css"
import { useState, useEffect } from "react";
import ImageSlider from "../imageSlider/ImageSlider";

export default function RoomCard(props) {
    
    const [imgData, setImgData] = useState([]);
    const [data, setData] = useState(props.data)

    // //replace unfound images with placeholder
    // const handleImgError = e => {
    //     e.target.onError = null;
    //     e.target.src = "/image-not-found.png"
    // }


      
    // check if image exists
    // const loadImg = (url) => {
    //     const img = new Image();
    //     return new Promise((resolve, reject) => {
    //         img.src = url;
    //         img.onload = () => resolve(true);
    //         img.onerror = () => reject(false);
    //     });
    // };

    // // sets image array if it exists
    // useEffect(() => {
    //     const fetchData = async () => {
    //         let imageArray = []
    //         try { 
    //             props.images.forEach(function(image) {
    //                 const res = loadImg(image.url);
    //                 imageArray.push(image.url)
    //             })
    //             setImgData(imageArray);
    //         } catch(err) {
    //         }
    //     };

    //     fetchData(); 
    // }, []);
    // console.log(imgData)

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
        console.log(item, id);
        return(
            <RatesCard key={id}
                {...item}/>
        )})


    return (
        <div key="props.key" className="roomCard">
            <div className="room--container">
                <div className="room-body">

                    {/* <div className="images"> 
                        {<img src="null"
                            alt=""
                            onError={handleImgError}
                            className="room--image"
                        />} 
                    </div> */}

                    <div className="room--details">
                        <h3 className="room--normalized">{props.desc} Room</h3>
                        {props.cancellation && <div className="free-cancellation">Free Cancellation</div>}
                        <div className='amenities'>
                            {props.amenities.map((key, i) => {
                                return <li key={i}>{key}</li>
                            })}
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
