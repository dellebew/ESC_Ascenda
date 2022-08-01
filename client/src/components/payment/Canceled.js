import React, { useEffect, useState } from 'react';
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./checkout.css"
import NavBar from '../navbar/Navbar';

const Canceled = () => {
  const [session, setSession] = useState("");
  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(true);

  let { curTime }= useParams();
  console.log("curTime "+curTime);

  useEffect(() => {
    const fetchSession = async() => {
      try{
        setLoading(true);
        // TODO: determine actual number of pages
        console.log("in async function");
        const response = await fetch(`../../stripe/failed-checkout-session/${curTime}`);
       
        // const temp_sess = await response.json()
        console.log("finish fetching");
  
        setSession(response);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.log("error retrieving");
        setError(err.message);
        setLoading(false);
        setSession("/");
      } 
      
    };
    fetchSession();
  }, []);
  

  return (
    <>
    <NavBar />
    <div className="body">  
      <div className="checkout--container">
        <div className="checkout--wrapper">

          <h1 className='checkout-title'>
            <i className="fas fa-bed"></i>
            Booking UnSuccessful
          </h1>

          <div className="room-info">
              <div>
                <label me>Retrieve Choices:</label>
                <Link to={session}>Return to purchase page</Link>
              </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

export default Canceled;