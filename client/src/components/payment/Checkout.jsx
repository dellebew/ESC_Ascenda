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
  // const [inputs, setInputs] = useState({});
  const [state, setState] = useState({
    start: "", 
    end: "",
    message: "",
    roomType: "Single Room",
    adultQuantity: 2,
    childrenQuantity: 0,
  });

  // const handleChange = (event) => {
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   setInputs(values => ({...values, [name]: value}))
  // }

  // handle message to hotel
  const [message, setMessage] = useState("");

  // choose room type
  const [roomType, setRoomType] = useState("single room");

  async function handleSubmit(event)  {

    event.preventDefault();
    const startd = date[0].startDate
    const endd = date[0].endDate;

    // setState({
    //   start: startd,
    //   end: endd,
    //   message: message,
    //   roomType: roomType,
    //   adultQuantity: options.adults,
    //   childrenQuantity: options.children
    // });

    const state = {
      start: startd, 
      end: endd,
      message: message,
      roomType: roomType,
      adultQuantity: options.adults,
      childrenQuantity: options.children,
    }

    // const state = {
    //   start: startd, 
    //   end: endd,
    //   message: message,
    //   roomType: roomType,
    //   adultQuantity: 2,
    //   childrenQuantity: 0,
    // }

    console.log(typeof state);

    console.log(JSON.stringify(state));

    try {
      // const { checkoutSession } = fetch('stripe/create-checkout-session', {
      //   method: 'POST',
      //   mode: 'cors',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(state)
      //   }).then(function(response){
      //       console.log(response)
      //       return response.json();
      //   });

      // const session = <CheckoutSession key={hotelData._id}
      // {...hotelData}/> ;
      
      
      //console.log("before running checkoutsession")
      //checkoutSession();
      
    }
    catch (error){
        console.log(error);
    }
  }

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
    
    <div className="body">
      <script src="https://polyfill.io/v3/polyfill.min.js?version=3.52.1&features=fetch"></script>
      <script src="https://js.stripe.com/v3/"></script>
      <div className="hotel--wrapper">
        
          <h2>Book Room</h2>
          <form onSubmit={handleSubmit}>
          {/* <form onSubmit={handleSubmit} action="stripe/create-checkout-session" method="POST" body={JSON.stringify(state)}> */}
          

          <div className="hotel--container">
            <label>Insert Your complaints here
              <input className="options--item"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message for the hotel"
                name="custMessage"
                type = "text"
              />
              
            </label>


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

          <div className="hotel--container">
          {/* <form action="stripe/create-checkout-session" method="POST"> */}

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
          </div>
          
          </form>
        
      </div>
    </div>
    
  );
};

export default Checkout;