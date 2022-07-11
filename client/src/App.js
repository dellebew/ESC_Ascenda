import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home"
import Hotel from "./pages/hotel/Hotel"
import Destinations from "./pages/destinations/Destinations";


function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/' element = {<Home />}/>
        <Route path='/destinations' element = {<Destinations />}/>
        <Route path='/hotels/:id' element = {<Hotel />}/>
      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
