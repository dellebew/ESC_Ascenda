import React, { useEffect, useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons'
import { DateRange} from 'react-date-range';
import { format } from "date-fns";
import {useNavigate} from 'react-router-dom';
import "./checkout.css"
// import { setIncompletePayments } from './IntermediateDB';

// const [quantity, setQuantity] = useState(1);
// const [amount, setAmount] = useState(0);
// const [currency, setCurrency] = useState('SGD');

// const [qty, setRoomQty] = useState(1);
// const [start, setStart] = useState("");
// const [end, setEnd] = useState("");
// const [adults, setAdults] = useState(1);
// const [children, setChildren] = useState(0);
// const [message, setMessage] = useState("");
// const [roomType, setRoomType] = useState("");

// const Checkout = ({ route, navigation }) => {
const Checkout = () => {

  const navigate = useNavigate();

  // get information from previous page
  // const { params } = route.params;

  // what I need for navigations
  // const params = {
  //   //from nicholas's side
  //   startDate: "",
  //   endDate: "",
  //   roomQty: "",
  //   adultQty: "",
  //   childQty: "",
  //   // from px's side
  //   price: "",
  //   roomName: "",
  //   roomQty: "",
  //   roomType: "",
  // }

  // const data = {
  //   start: params.startDate, 
  //   end: params.endDate,
  //   roomType: params.roomType,
  //   roomQty: params.roomQty,
  //   adultQty: params.adultQty,
  //   childQty: params.childQty,
  //   message: "",
  // };

  // const billing = {
  //   unit_amount: params.price,
  //   hotelName: params.roomName,
  //   roomQty: params.roomQty,
  // }

  // handle message to hotel
  const [message, setMessage] = useState("");

  const startTime = new Date();
  let endTime = new Date();
  endTime.setTime(startTime.getTime() + 1000*60*60*24*5)
  const endTime2 = endTime.getTime();
  const startTime2 = startTime.getTime();

  const data = {
    // start: new Date(2022, 7, 22), 
    // end: new Date(2022, 7, 28),
    start: startTime2,
    end: endTime2,
    message: message,
    roomQty: 3,
    roomType: "Single Room",
    adultQuantity: 2,
    childrenQuantity: 0,
  };

  const billing = {
    unit_amount: 20*100,
    name: "Hotel Name",
    destination: "location",
  }

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
  
  
  // choose room type
  const [roomType, setRoomType] = useState("single room");

  return (
    
    <div className="body">
      <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>
      <script src="https://js.stripe.com/v3/"></script>
      <div className="hotel--wrapper">
        
          <h2>Book Room</h2>
          {/* <form onSubmit={handleSubmit}> */}
          <form action="../stripe/create-checkout-session/" method="POST">
          
          <div className="hotel--container">
            <label>Insert Your complaints here
              <input className="options--item"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message for the hotel"
                name="message"
                type = "text"
              />
            </label>

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

            <select className="form-control"
            onChange={(e) => setRoomType(e.target.value)}
            name="roomType"
            >
              <option>Single Room</option>
              <option>Double Room</option>
              <option>Delux</option>
            </select>

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