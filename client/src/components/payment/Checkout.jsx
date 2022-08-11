import React, { useState } from 'react'
import {useLocation} from 'react-router-dom';
import "./checkout.css"
import NavBar from '../navbar/Navbar';

// const Checkout = ({ route, navigation }) => {
const Checkout = () => {

  // const state = route.params;

  // const state = useParams();
  const location = useLocation();
  const state = location.state;

  console.log("in Checkout");

  const startTimeArr = state.startDate.split('-');
  const endTimeArr = state.endDate.split('-');
  let startTime = new Date(startTimeArr[0], startTimeArr[1], startTimeArr[2]);
  let endTime = new Date(endTimeArr[0], endTimeArr[1], endTimeArr[2]);
  
  // handle message to hotel
  const [message, setMessage] = useState("");

  const roomType = state.roomType;
  // console.log(state.roomType.upper());
  const data = {
    start: startTime.getTime(), 
    end: endTime.getTime(),
    roomType: roomType.toUpperCase(),
    adultQuantity: state.adultQty,
    childrenQuantity: state.childQty,
    roomQuantity: state.roomQty,
    message: message,
    hotelName: state.hotelName,
  };

  const billing = {
    unit_amount: state.price,
    name: state.roomName,
    destination: state.destination,
    hotel_id: state.hotelId,
  }

  const currentTime = new Date();
  const currentTime2 = currentTime.getTime();

  const intermediateData = {
    currentTime: currentTime2, 
    billing: billing,
    data: data,
  }

  const currentURL = state.currentURL;
  // const currentURL = window.location.href
  // console.log(JSON.stringify(intermediateData));

  // add to intermediate database
  // setIncompletePayments(intermediateData)

  const startTimeNum = new Date();  
  startTimeNum.setTime(data.start);
  const startTimeText = startTimeNum.getDate() + "-" + startTimeNum.getMonth() + "-" + startTimeNum.getFullYear();

  const endTimeNum = new Date();  
  endTimeNum.setTime(data.end);
  const endTimeText = endTimeNum.getDate() + "-" + endTimeNum.getMonth() + "-" + (endTimeNum.getFullYear());
  
  const numOfNights = Math.ceil(Math.abs(endTimeNum.getTime()-startTimeNum.getTime()) / (1000*24*60*60))

  return (
    <>
    <NavBar/>
    <div className="body">
      <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>
      <script src="https://js.stripe.com/v3/"></script>
      <div className="checkout--container">
        <div className="checkout--wrapper">
            {/* <form onSubmit={handleSubmit}> */}
            <form className="checkout--form" action="../stripe/create-checkout-session/" method="POST">
              <h1 className='checkout-title'>
                <i className="fas fa-bed"></i>
                Room Booking Information
              </h1>
              <div className="room-info">
                  <div>
                      <label>Start Date:</label>
                      <span>{startTimeText}</span>
                  </div>
                  <div>
                      <label>End Date:</label>
                      <span>{endTimeText}</span>
                  </div>
              </div>
              <div className="address-info">
                  <div>
                      <label>Adults:</label>
                      <span>{data.adultQuantity}</span>
                  </div>
                  <div>
                      <label>Children:</label>
                      <span>{data.childrenQuantity}</span>
                  </div>
                  <div>
                      <label >Rooms:</label>
                      <span>{data.roomQuantity}</span>
                  </div>
              </div>
              <h1 className='checkout-title'>
                  <i className="far fa-credit-card"></i> 
                  Payment Information
              </h1>
                <div className="billing-info">
                    <label>Total Amount Paid:</label>
                    <span>S${(billing.unit_amount).toFixed(2)}</span>
                </div>
                <div className="billing-info"> 
                    <label>Hotel Name:</label>
                    <span>{data.hotelName}</span>
                </div>
                <div className="billing-info">
                    <label>Destination:</label>
                    <span>{billing.destination}</span>
                </div>
                <div className="billing-info">
                    <label>Room Type:</label>
                    <span>{data.roomType}</span>
                </div>
              <h1 className='checkout-title'>
                  <i className="fas fa-hotel"></i> 
                  Hotel Message
              </h1>
              <textarea name="paragraph_text" cols="50" rows="10"
                        className="hotel-message"
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Leave your message here"
                        type = "text"/>

                <input hidden={true} 
                encType="application/json"
                defaultValue={JSON.stringify(data)}
                name="info"></input>

                <input hidden={true} 
                encType="application/json"
                defaultValue={JSON.stringify(billing)}
                name="billing"></input>
                
                <input hidden={true} 
                defaultValue={currentTime2}
                name="currentTime"></input>

                <input hidden={true}
                defaultValue={currentURL}
                name="pageURL"></input>
                
                <div className='btn'>
                  <button className="checkout-button" role="link" id="submit" type="submit">
                    Confirm Purchase
                  </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  </>
  );
};

export default Checkout;