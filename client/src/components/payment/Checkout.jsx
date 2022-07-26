import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons'
import { DateRange} from 'react-date-range';
import { format } from "date-fns";
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import "./checkout.css"

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
    cust_name: "Group6_client0",
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
    
    <div className="body">
      <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>
      <script src="https://js.stripe.com/v3/"></script>
      <div className="hotel--wrapper">
        
          <h2>Book Room</h2>
          {/* <form onSubmit={handleSubmit}> */}
          <form action="../stripe/create-checkout-session/" method="POST">
          
          <div className="title">Confirm Booking</div>
          <div className="hotel--container">
            
              <p>
              <div className="title">Dates Of Stay</div>
              <b>startDate: </b>{startTimeText},<br />
              <b>endDate: </b>{endTimeText},<br />
              <div className="title">Number of Guests</div>
              <b>adultQty: </b>{data.adultQuantity},<br />
              <b>childQty: </b>{data.childrenQuantity},<br />
              <b>roomQty: </b>{data.roomQty},<br />
              </p>
          </div>

          <div className="hotel--container">
              <p>
              <div className="title">Total Amount Paid</div>
              <b>price: </b>{billing.unit_amount},<br />
              <div className="title">Hotel Details</div>
              <b>hotelName: </b>{data.hotelName},<br />
              <b>destination: </b>{billing.destination},<br />
              <b>roomType: </b>{data.roomType},<br />
              </p>
            

          </div>

          <div className="hotel--container">
            
            {/* <div className="Title">Message for the Hotel</div> */}
            <input className="options--item"
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message for the hotel"
              name="message"
              type = "text"
            />
            
            <input hidden={true} 
            encType="application/json"
            defaultValue={JSON.stringify(data)}
            name="info"></input>

            <input hidden={true} 
            encType="application/json"
            defaultValue={JSON.stringify(billing)}
            name="billing"></input>
            
            <input hidden={true} 
            defaultValue={currentTime}
            name="currentTime"></input>

            <button role="link" id="submit" type="submit">
              buy now
            </button>
        </div>
          
          </form>
        
      </div>
    </div>
    
  );
};

export default Checkout;