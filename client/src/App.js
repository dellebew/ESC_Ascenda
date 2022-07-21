import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home"
import Hotels from "./pages/hotels/Hotels"
import Destinations from "./pages/destinations/Destinations";
import Error from "./pages/error/Error";
// import Payment from "./components/payment/PaymentJSX";
import Checkout from "./components/payment/Checkout";
import Success from "./components/payment/Success";
import Canceled from "./components/payment/Canceled";


function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/' element = {<Home />}/>
        <Route path='/destinations/:destId/:checkin/:checkout/:lang/:currency/:code/:guests/:page' element = {<Destinations />}/>
        <Route path='/hotels/:hotelId/:destId/:checkin/:checkout/:lang/:currency/:code/:guests' element = {<Hotels />}/>
        <Route path='*' element={<Error/>}> </Route>
        <Route path= "/checkout" element= {<Checkout />} />
        <Route path= '/checkout/success' element = {<Success />}/>
        <Route path= '/checkout/canceled' element = {<Canceled />}/>

      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
