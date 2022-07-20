import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home"
import Hotels from "./pages/hotels/Hotels"
import Destinations from "./pages/destinations/Destinations";
// import Payment from "./components/payment/PaymentJSX";
import Checkout from "./components/payment/Checkout";

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/' element = {<Home />}/>
        <Route path='/destinations/:id' element = {<Destinations />}/>
        <Route path='/hotels/:id' element = {<Hotels />}/>
        <Route path= "/checkout" element= {<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
