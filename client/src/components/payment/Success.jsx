import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Loader from "../loader/Loader";
import Error from "../error/Error";
import NavBar from "../navbar/Navbar";

import "./checkout.css"

const Success = () => {
  const [session, setSession] = useState({});
  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(true); 
  //const sessionId = location.search.replace('?session_id=', '');
  
  let { sessionId } = useParams();
  //const sessionId = state.sessionId;

  // //sessionId printed here
  // console.log(sessionId);
  // console.log("in checkout success");
  // console.log(loading);

  // console.log(loading);
  // console.log(JSON.stringify(session));
  // console.log(session.state.unit_amount + session.state.numOfNights + session.state.roomQuantity);

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
          setLoading(true);
      } 
      
    };
    fetchSession();
  }, []);
  

  return (
    <>
    <NavBar />
        {loading && <Loader/>}
        {!loading && session === {error: "404"} && <div className='server_404'><Error {...{img:"/404-invalid-hotel.png"}}/></div>}
        {!loading && (session === {error: "429"}) && <div className='server_429'><Error {...{img:"/404-429-error.png"}}/></div>}
        {!loading && (session !== undefined) && 
      <div className="success-body">    

      <div className="checkout--container">
        <div className="checkout--wrapper">
          <h1 className='success-title'>
            <i className="fas fa-calendar-check"></i>
            Booking Successful!
          </h1>
          <div className="room-info">
              <div>
                  <label>Full Name:</label>
                  <span className="display--name">{session.billing.name}</span>
              </div>
              <div>
                  <label>Email:</label>
                  <span className="display--email">{session.billing.email}</span>
              </div>
          </div>
          
          <h1 className='checkout-title'>
            <i className="fas fa-hotel"/>
            Dates Of Stay
          </h1>
          <div className="room-info">
              <div>
                  <label me>Start Date:</label>
                  <span className="display--startDate">{session.state.startDate}</span>
              </div>
              <div>
                  <label me>End Date:</label>
                      <span className="display--endDate">{session.state.endDate}</span>
              </div>
          </div>
          <div className="address-info">
              <div>
                  <label>Adults:</label>
                  <span className="display--adultQty">{session.state.adultQuantity}</span>
              </div>
              <div>
                  <label >Children:</label>
                  <span className="display--childQty">{session.state.childrenQuantity}</span>
              </div>
              <div>
                  <label >Rooms:</label>
                  <span className="display--childQty">{session.state.roomQuantity}</span>
              </div>
          </div>

          <h1 className='checkout-title'>
                  <i className="far fa-credit-card"/>
                  Payment Information
              </h1>
                <div className="billing-info">
                    <label>Total Amount Paid:</label>
                    <span name="display--price">S${(session.state.unit_amount).toFixed(2)}</span>
                </div>
                <div className="billing-info">
                    <label>Hotel Name:</label>
                    <span className="display--hotelName">{session.state.hotelName}</span>
                </div>
                <div className="billing-info">
                    <label>Destination:</label>
                    <span className="display--destination">{session.state.destination}</span>
                </div>
                <div className="billing-info">
                    <label>Room Type:</label>
                    <span className="display--roomType">{session.state.roomType}</span>
                </div>
                <Link className='redirect' to="/">Find another vacation destination</Link>  
          </div>
        </div>
      </div>};
    </>
  );
};

export default Success;