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

    const fetchTime = async() => { 
      if (!loading && (session !== undefined)) {
        setLoading(false);
        console.log("setting start and end times");
        var startTimeNum = new Date(); 
        // console.log(session.state.start);
        startTimeNum.setTime(session.state.start);
        let startTimeText = (startTimeNum.getDate() + "-" + startTimeNum.getMonth() + "-" + startTimeNum.getFullYear());
        // console.log(startTimeText);
        setStartTimeText(startTimeText);
    
        var endTimeNum = new Date();  
        endTimeNum.setTime(session.state.end);
        let endTimeText = endTimeNum.getDate() + "-" + endTimeNum.getMonth() + "-" + endTimeNum.getFullYear();
        // console.log(endTimeText);
        setEndTimeText(endTimeText);
        // console.log("after effect");
      };
    };
    fetchTime();
  }, []);
  

  return (
    <>
    <NavBar />
        {error && <Error/>}
        {loading && <Loader/>}
        {!loading && (session !== undefined) && 
      <div className="body">    
      <div className="title">Booking Successful</div>
      <div className="hotel--container">
          <p>
          <div className="title">{session.billing.name}</div>
          <b>email: </b>{session.billing.email},<br />
          </p>
      </div>

      <div className="hotel--container">
          <p>
          <div className="title">Dates Of Stay</div>
          <b>startDate: </b>{startTimeText},<br />
          <b>endDate: </b>{endTimeText},<br />
          <div className="title">Number of Guests</div>
          <b>adultQty: </b>{session.state.adultQuantity},<br />
          <b>childQty: </b>{session.state.childrenQuantity},<br />
          <b>roomQty: </b>{session.state.roomQty},<br />
          </p>
      </div>
      <div className="hotel--container">
          <p>
          <div className="title">Total Amount Paid</div>
          <b>price: </b>{session.billing.unit_amount},<br />
          <div className="title">Hotel Details</div>
          <b>hotelName: </b>{session.billing.hotelName},<br />
          <b>destination: </b>{session.billing.destination},<br />
          <b>roomType: </b>{session.state.roomType},<br />
          <Link to="/">Find another vacation destination</Link>
          </p>
      </div>
      </div>};
    </>
  );
};

export default Success;