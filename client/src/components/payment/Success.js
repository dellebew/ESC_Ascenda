import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Loader from "../loader/Loader";
import Error from "../../components/error/Error";
import NavBar from "../../components/navbar/Navbar";

import "./checkout.css"
import { truncate } from 'fs';

const Success = () => {
  const [session, setSession] = useState({});
  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(true); 
  // const location = useLocation();
  //const sessionId = location.search.replace('?session_id=', '');
  
  let { sessionId } = useParams();
  //const sessionId = state.sessionId;

  //sessionId printed here
  console.log(sessionId);
  console.log("in checkout success");
  console.log(loading);

  const [startTimeText, setStartTimeText] = useState("");
  const [endTimeText, setEndTimeText] = useState("");

  console.log(loading);
  console.log(JSON.stringify(session));

  useEffect(() => {
    const fetchSession = async() => {
      // await fetch('stripe/checkout-session?sessionId=' + sessionId).then((res) =>
      //also send back passedProps like the rtn passes
      try{
        
        setLoading(true);
          // TODO: determine actual number of pages
          console.log("in async function");
          const response = await fetch(`../../stripe/checkout-session/${sessionId}`);
          // .then((res) =>res.json());
          if (response === null) {
            throw Error("hotelData not found");
          }
          const temp_sess = await response.json()
          console.log("finish fetching");
          console.log(temp_sess);

          setSession(temp_sess);
          setError(null);
          setLoading(false);
      } catch (err) {
          console.log("error retrieving");
          setError(err.message);
          setLoading(false);
      } 
      
    };
    fetchSession();

    // const fetchTime = async() => { 
    //   if (!loading && (session !== undefined)) {
    //     setLoading(false);
    //     console.log("setting start and end times");
    //     var startTimeNum = new Date(); 
    //     // console.log(session.state.start);
    //     startTimeNum.setTime(session.state.start);
    //     let startTimeText = (startTimeNum.getDate() + "-" + startTimeNum.getMonth() + "-" + startTimeNum.getFullYear());
    //     // console.log(startTimeText);
    //     setStartTimeText(startTimeText);
    
    //     var endTimeNum = new Date();  
    //     endTimeNum.setTime(session.state.end);
    //     let endTimeText = endTimeNum.getDate() + "-" + endTimeNum.getMonth() + "-" + endTimeNum.getFullYear();
    //     // console.log(endTimeText);
    //     setEndTimeText(endTimeText);
    //     // console.log("after effect");
    //   };
    // };
    // fetchTime();
  }, []);
  

  return (
    <>
    <NavBar />
        {error && <Error/>}
        {loading && <Loader/>}
        {!loading && (session !== undefined) && 
      <div className="body">    

      <div className="checkout--container">
        <div className="checkout--wrapper">
          <h1 className='checkout-title'>
            <i className="fas fa-bed"></i>
            Booking Successful
          </h1>
          <div className="room-info">
              <div>
                  <label me>Full Name:</label>
                  <span>{session.billing.name}</span>
              </div>
              <div>
                  <label me>Email:</label>
                      <span>{session.billing.email}</span>
              </div>
          </div>
          
          <h1 className='checkout-title'>
            <i className="fas fa-bed"></i>
            Dates Of Stay
          </h1>
          <div className="room-info">
              <div>
                  <label me>Start Date:</label>
                  <span>{session.state.startDate}</span>
              </div>
              <div>
                  <label me>End Date:</label>
                      <span>{session.state.endDate}</span>
              </div>
          </div>
          <div className="address-info">
              <div>
                  <label>Adults:</label>
                  <span>{session.state.adultQuantity}</span>
              </div>
              <div>
                  <label >Children:</label>
                  <span>{session.state.childrenQuantity}</span>
              </div>
              <div>
                  <label >Rooms:</label>
                  <span>{session.state.roomQty}</span>
              </div>
          </div>

          <h1 className='checkout-title'>
                  <i className="far fa-credit-card"></i> 
                  Payment Information
              </h1>
                <div className="billing-info">
                    <label>Total Amount Paid:</label>
                    <span>S${session.state.unit_amount}</span>
                </div>
                <div className="billing-info">
                    <label>Hotel Name:</label>
                    <span>{session.state.hotelName}</span>
                </div>
                <div className="billing-info">
                    <label>Destination:</label>
                    <span>{session.state.destination}</span>
                </div>
                <div className="billing-info">
                    <label>Room Type:</label>
                    <span>{session.state.roomType}</span>
                </div>
                <Link to="/">Find another vacation destination</Link>
    
          </div>
        </div>
      </div>};
    </>
  );
};

export default Success;