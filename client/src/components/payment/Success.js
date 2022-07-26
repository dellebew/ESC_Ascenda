import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const Success = () => {
  const [session, setSession] = useState({});
  const location = useLocation();
  //const sessionId = location.search.replace('?session_id=', '');
  
  let { sessionId } = useParams();
  //const sessionId = state.sessionId;

  //sessionId printed here
  console.log(sessionId);

  useEffect(() => {
    async function fetchSession() {
      console.log("fetching session")
      setSession(
        // await fetch('stripe/checkout-session?sessionId=' + sessionId).then((res) =>
        await fetch(`../../stripe/checkout-session/${sessionId}`).then((res) =>
        res.json()
        )
        //also send back passedProps like the rtn passes
      );
    }
    fetchSession();
    
  }, [sessionId]);

  return (
    <div className="sr-root">
      <div className="sr-main">
        <header className="sr-header">
          <div className="sr-header__logo"></div>
        </header>
        <div className="sr-payment-summary completed-view">
          <h1>Your payment succeeded</h1>
          <h4>View CheckoutSession response:</h4>
        </div>
        <div className="sr-section completed-view">
          <div className="sr-callout">
            <pre>{JSON.stringify(session, null, 2)}</pre>
          </div>
          <Link to="/">back to homepage</Link>
        </div>
      </div>
      
    </div>
  );
};

export default Success;