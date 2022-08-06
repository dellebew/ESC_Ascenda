import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home"
import About from "./pages/about/About"
import HotelsSearch from "./pages/hotelSearch/hsearch"
import Hotels from "./pages/hotels/Hotels"
import Destinations from "./pages/destinations/Destinations";
import CheckDestinations from "./components/utils/checkDestinations";
// import Payment from "./components/payment/PaymentJSX";
import Checkout from "./components/payment/Checkout";
import Success from "./components/payment/Success";
import Canceled from "./components/payment/Canceled";
import ErrorPage from "./pages/errorPage/ErrorPage";
import CheckHotels from "./components/utils/checkHotels";


function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/' element = {<Home />}/>
        <Route path='/about' element = {<About />}/>
        <Route path='/hotels' element = {<HotelsSearch />}/>
        <Route path='/destinations/:destId/:checkin/:checkout/:lang/:currency/:code/:adultsQty/:childrenQty/:roomQty/:page' 
              element = {(
              <CheckDestinations>
                <Destinations />
              </CheckDestinations>
              )}/>
        <Route path='/hotels/:hotelId/:destId/:checkin/:checkout/:lang/:currency/:code/:adultsQty/:childrenQty/:roomQty/' 
              element = {(
              <CheckHotels>
                <Hotels />
              </CheckHotels>
              )}/>
        <Route path='invalid-url' element={<ErrorPage {...{img:"/404-invalid-url.png"}}/>}> </Route>
        <Route path='*' element={<ErrorPage/>}> </Route>
        <Route path= "/checkout" element= {<Checkout />} />
        <Route path= '/checkout/success/:sessionId' element = {<Success />}/>
        <Route path= '/checkout/canceled/:curTime' element = {<Canceled />}/>

      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
