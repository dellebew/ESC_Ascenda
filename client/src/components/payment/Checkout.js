import React, { useEffect, useState } from 'react'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBed, faCalendarDays, faPerson } from '@fortawesome/free-solid-svg-icons'
import { DateRange} from 'react-date-range';
import { format } from "date-fns";
import {useNavigate} from 'react-router-dom';
import "./checkout.css"


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

// rtnProps = {
//     qty: children+adults,
//     start: start,
//     end: end,
//     adults: adults,
//     children: children,
//     message: message,
//     roomType: roomType
// }


  

//handle name, 

const Checkout = () => {

  const navigate = useNavigate();

  /** FOR DATE-RANGE */
  const [openDate, setOpenDate] = useState(false);

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  /** FOR PEOPLE DROPDOWN */
  const [openOptions, setOpenOptions] = useState(false);

  const [options, setOptions] = useState(
      {
        adult: 2,
        children: 0,
        room: 1,
      });

  const handleOption = (name, operation) => {
      setOptions(prev=> {return {
          ...prev, 
          [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
      });
  };

  // handle message to hotel
  const [message, setMessage] = useState("");

  // choose room type
  const [roomType, setRoomType] = useState("");

  const handleSubmit = (messageTyped) => {
    setMessage(messageTyped);
    const startd = date[0].startDate
    const endd = date[0].endDate;

    // let path = '../stripe/create-checkout-session' //need change this later
    // // navigate(path, {state: {id: 1, uid: searchTerm, start: startd, end: endd, lang: language, moneyType: currency} });
    // //action="stripe/create-checkout-session" method="POST"
    // navigate(path, {state: {
    //   start: startd, 
    //   end: endd,
    //   message: message,
    //   roomType: roomType,
    //   adultQuantity: options.adults,
    //   childrenQuantity: options.children,
    // }})
    // add the link thing
  };


  useEffect(() => {
    async function fetchConfig() {
      // Fetch config from our backend.
      const {
        // unitAmount,
        // currency
        rtnValue,
        
      } = await fetch('stripe/config').then(r => r.json());
      // setAmount(unitAmount);
      // setCurrency(currency);
      console.log("rtned from config")
    }
    fetchConfig();

  }, []);

  return (
    <>
    <div className="body">
      <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>
      <script src="https://js.stripe.com/v3/"></script>
      <div className="hotel--container">
        <div className="hotel--wrapper">
          <h2>Book Room</h2>
          {/* <form onSubmit={handleSubmit}> */}
          <form action="stripe/create-checkout-session" method="POST">

            <div className="hotel--body2">
                <FontAwesomeIcon icon={faCalendarDays} className="search--icon"/>
                <span 
                    onClick={()=>setOpenDate(!openDate)} 
                    className="search--text">
                    {format(date[0].startDate, "MM/dd/yyyy")} to {format(date[0].endDate, "MM/dd/yyyy")}
                </span>
                {openDate && (<DateRange
                    editableDateInputs={true}
                    onChange={item => setDate([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    className="date"
                    daySize="100"
              />)}
            </div>
            <div className="hotel--body2">
                <FontAwesomeIcon icon={faPerson} className="search--icon"/>
                <span className="search--text" onClick={() => setOpenOptions(!openOptions)}>
                    {`${options.adult} adults ${options.children} children ${options.room} room`}
                </span>
                {openOptions && (<div className="options">
                    <div className="options--item">
                        <span className="options--text">Adult</span>
                        <div className="options--counter">
                            <button 
                                onClick={() => handleOption("adult", "d")}
                                disabled={options.adult<=1}>-</button>
                            <span>{options.adult}</span>
                            <button onClick={() => handleOption("adult", "i")}>+</button>
                        </div>
                        
                    </div>
                    <div className="options--item">
                        <span className="options--text">Children</span>
                        <div className="options--counter">
                            <button 
                                onClick={() => handleOption("children", "d")}
                                disabled={options.children<=0}>-</button>
                            <span>{options.children}</span>
                            <button onClick={() => handleOption("children", "i")}>+</button>
                        </div>
                    </div>
                    <div className="options--item">
                        <span className="options--text">Room</span>
                        <div className="options--counter">
                            <button 
                                onClick={() => handleOption("room", "d")}
                                disabled={options.room<=1}>-</button>
                            <span>{options.room}</span>
                            <button onClick={() => handleOption("room", "i")}>+</button>
                        </div>
                    </div>
                </div>)}
              </div>

            <input class="options--item"
              onChange={e => setMessage(e.target.value)}
              placeholder="Message for the hotel"
              name="Message for the hotel"
              type = "text"
              required
            />

            <select class="form-control"
            onChange={e => setRoomType(e.target.value)}
            name="Room Type"
            >
              <option>Single Room</option>
              <option>Double Room</option>
              <option>Delux</option>
            </select>

            <button role="link" id="submit" type="submit">
              buy now
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;