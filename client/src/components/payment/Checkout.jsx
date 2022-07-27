import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons'
import { DateRange} from 'react-date-range';
import { format } from "date-fns";
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import "./checkout.css"
import NavBar from '../navbar/Navbar';

// const Checkout = ({ route, navigation }) => {
const Checkout = () => {

  // const state = route.params;

  // const state = useParams();
  const location = useLocation();
  const state = location.state;
  // console.log(state);

  // const route.params
  // console.log((params));
  // const state = params.newState;
  // console.log(JSON.stringify(state));

  // const navigate = useNavigate();

  // get information from previous page
  

  console.log("in Checkout");

  const startTimeArr = state.startDate.split('-');
  const endTimeArr = state.endDate.split('-');
  let startTime = new Date(startTimeArr[0], startTimeArr[1], startTimeArr[2]);
  let endTime = new Date(endTimeArr[0], endTimeArr[1], endTimeArr[2]);
  
  // handle message to hotel
  const [message, setMessage] = useState("");

  const data = {
    start: startTime.getTime(), 
    end: endTime.getTime(),
    roomType: state.roomType,
    roomQty: state.roomQty,
    adultQuantity: state.adultQty,
    childrenQuantity: state.childQty,
    message: message,
    hotelName: state.hotelName,
  };


  const billing = {
    unit_amount: state.price,
    name: state.roomName,
    destination: state.destination,
    hotel_id: state.hotelId,
  }

  // const startTime = new Date();
  // let endTime = new Date();
  // endTime.setTime(startTime.getTime() + 1000*60*60*24*5)
  // const endTime2 = endTime.getTime();
  // const startTime2 = startTime.getTime();

  // const data = {
  //   // start: new Date(2022, 7, 22), 
  //   // end: new Date(2022, 7, 28),
  //   start: startTime2,
  //   end: endTime2,
  //   message: message,
  //   roomQty: 3,
  //   roomType: "Single Room",
  //   adultQuantity: 2,
  //   childrenQuantity: 0,
  //   cust_name: "",
  // };

  // const billing = {
  //   unit_amount: 20*100,
  //   name: "Hotel Name",
  //   hotel_id: "",
  //   destination: "location",
  // }

  const currentTime = new Date();
  const currentTime2 = currentTime.getTime();

  const intermediateData = {
    currentTime: currentTime2, 
    billing: billing,
    data: data,
  }

  console.log(JSON.stringify(intermediateData));

  // add to intermediate database
  // setIncompletePayments(intermediateData)
  const startTimeNum = new Date();  
  startTimeNum.setTime(data.start);
  const startTimeText = startTimeNum.getDate() + "-" + startTimeNum.getMonth() + "-" + startTimeNum.getFullYear();

  const endTimeNum = new Date();  
  endTimeNum.setTime(data.end);
  const endTimeText = endTimeNum.getDate() + "-" + endTimeNum.getMonth() + "-" + (endTimeNum.getFullYear());
  
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
                      <label me>Start Date:</label>
                      <span>{startTimeText}</span>
                  </div>
                  <div>
                      <label me>End Date:</label>
                          <span>{endTimeText}</span>
                  </div>
              </div>
              <div className="address-info">
                  <div>
                      <label>Adults:</label>
                      <span>{data.adultQuantity}</span>
                  </div>
                  <div>
                      <label >Children:</label>
                      <span>{data.childrenQuantity}</span>
                  </div>
                  <div>
                      <label >Rooms:</label>
                      <span>{data.roomQty}</span>
                  </div>
              </div>
              <h1 className='checkout-title'>
                  <i className="far fa-credit-card"></i> 
                  Payment Information
              </h1>
                <div className="billing-info">
                    <label>Total Amount Paid:</label>
                    <span>S${billing.unit_amount}</span>
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
                {/* <input className="options--item"
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Leave your message here"
                    name="message"
                    type = "text"
                /> */}

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
                
                <div className='btn'>
                  <button className="checkout-button" role="link" id="submit" type="submit">
                    Confirm Purchase
                  </button>
                </div>
                
                

                {/* <button role="link" id="submit" type="submit">
                  Buy Now
                </button> */}
            </form>
        </div>
      </div>
    </div>
  </>
  );
};

export default Checkout;