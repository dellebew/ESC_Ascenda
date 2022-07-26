import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Loader from "../loader/Loader";
import Error from "../../pages/error/Error";
import NavBar from "../../components/navbar/Navbar";

import "./checkout.css"
import { truncate } from 'fs';

const Success = () => {
  const [session, setSession] = useState({});
  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(true); 
  const location = useLocation();
  //const sessionId = location.search.replace('?session_id=', '');
  
  let { sessionId } = useParams();
  //const sessionId = state.sessionId;

  //sessionId printed here
  console.log(sessionId);
  console.log("in checkout success");

  const startTimeText = "";
  const endTimeText = "";

  if (!loading && (session !== undefined)) {
    console.log(JSON.stringify(session));
    const startTimeNum = new Date(); 
    startTimeNum.setTime(session.info.start);
    startTimeText = startTimeNum.getDate() + "-" + startTimeNum.getMonth() + "-" + startTimeNum.getFullYear();
  
    const endTimeNum = new Date();  
    endTimeNum.setTime(session.info.end);
    endTimeText = endTimeNum.getDate() + "-" + endTimeNum.getMonth() + "-" + (endTimeNum.getFullYear());
    console.log("after effect");
  };

  useEffect(() => {
    const fetchSession = async() => {
      console.log("in async function");
        // await fetch('stripe/checkout-session?sessionId=' + sessionId).then((res) =>
        //also send back passedProps like the rtn passes
      try{
          setLoading(true);
          // TODO: determine actual number of pages
          console.log("in async function");
          const temp_sess = await fetch(`../../stripe/checkout-session/${sessionId}`);
          // .then((res) =>res.json());
          setSession(temp_sess);
          setLoading(false);  
      } catch (err) {
          setError(err.message);
          setLoading(false);
      }
    }
    fetchSession();
    
  }, []);

  return (
    <>
    <NavBar />
        {error && <Error/>}
        {loading && <Loader/>}
        {!loading && (session !== undefined) && <div className="body">    
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
          <b>adultQty: </b>{session.info.adultQuantity},<br />
          <b>childQty: </b>{session.info.childrenQuantity},<br />
          <b>roomQty: </b>{session.info.roomQty},<br />
          </p>
      </div>
      <div className="hotel--container">
          <p>
          <div className="title">Total Amount Paid</div>
          <b>price: </b>{session.billing.unit_amount},<br />
          <div className="title">Hotel Details</div>
          <b>hotelName: </b>{session.billing.hotelName},<br />
          <b>destination: </b>{session.billing.destination},<br />
          <b>roomType: </b>{session.info.roomType},<br />
          <Link to="/">Find another vacation destination</Link>
          </p>
      </div>
      </div>};
    </>
  );
};

export default Success;