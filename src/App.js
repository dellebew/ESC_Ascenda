import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home"
import HotelsList from "./pages/hotelsList/HotelsList"
import Hotel from "./pages/hotel/Hotel"


function App() {
  return (
    <BrowserRouter> 
      <Routes>
        {/* Home Page */}
        <Route path='/' element = {<Home />}/>
        <Route path='/hotels' element = {<HotelsList />}/>
        <Route path='/hotels/:id' element = {<Hotel />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
