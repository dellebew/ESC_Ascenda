import React, { useEffect, useState } from 'react';
import {useNavigate, useParams, useLocation} from 'react-router-dom';
import { Link } from 'react-router-dom';
import "./checkout.css"
import NavBar from '../navbar/Navbar';
import Loader from "../loader/Loader";
import Error from "../error/Error";

const Canceled = () => {
  const [session, setSession] = useState("");
  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  let { curTime }= useParams();
  console.log("curTime "+curTime);

  useEffect(() => {
    const fetchSession = async() => {
      try{
        setLoading(true);
        console.log("in async function");
        const responseRaw = await fetch(`../../stripe/failed-checkout-session/${curTime}`);
        console.log("out");
        const response = await responseRaw.json();
        const resLink = response.link;
        console.log("finish fetching");
        console.log("link = " + resLink);
  
        setSession(resLink);
        setError(null);
        setLoading(false);
      } catch (err) {
        // console.log("error retrieving");
        setSession("/");
        // setError(err.message);
        setError(null);
        setLoading(false);
      } 
      
    };
    fetchSession();
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
            Booking Unsuccessful
          </h1>

          <div className="room-info">
              <div>
                <label>Retrieve Choices:</label>
                <Link to={session}>Return to purchase page</Link>
              </div>
          </div>

        </div>
      </div>
    </div>
}
    </>
  );
};

export default Canceled;