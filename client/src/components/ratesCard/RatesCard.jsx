import "./ratesCard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBowlFood, faCross, faSquareXmark, faXmark } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from "react";
import ImageSlider from "../imageSlider/ImageSlider";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


export default function RatesCard(props) {

    const hasBreakfast = props.roomAdditionalInfo.breakfastInfo == "hotel_detail_breakfast_included"
    const hasSupplier = props.market_rates

    const submit = () => {
        confirmAlert({
          title: 'We are redirecting you to the booking page.',
          message: 'Would you like to proceed with payment?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => alert('Fix Request!')
            },
            {
              label: 'No',
            }
          ]
        });
      };

    return (
        <div className="ratesCard">
             <div className="rates--container" onClick={submit}>
                    <div className="rates--details">
                        {hasBreakfast && 
                            <div className="free-breakfast">
                            <FontAwesomeIcon className="food-icon" icon={faBowlFood}/>
                                Free Breakfast Included
                            </div>}
                        {!hasBreakfast && 
                            <div className="no-breakfast">
                            <FontAwesomeIcon className="food-icon" icon={faSquareXmark}/>
                                No Breakfast Included
                            </div>}
                    </div>
                    <div className="rates--pricing"> 
                        <span className="price">S${(props.price).toFixed(2)}</span>
                        <span className="room">/ night (w taxes & fees)</span>
                        {hasSupplier.length > 0 && (<h2 className="website">
                            {hasSupplier[0].supplier}
                        </h2>)}
                    </div>  
            </div>
        </div>
    )
}
