import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home"
import Hotels from "./pages/hotels/Hotels"
import Destinations from "./pages/destinations/Destinations";
import Error from "./pages/error/Error";


function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/' element = {<Home />}/>
        <Route path='/destinations/:destId/:checkin/:checkout/:lang/:currency/:code/:guests/:page' element = {<Destinations />}/>
        <Route path='/hotels/:hotelId/:destId/:checkin/:checkout/:lang/:currency/:code/:guests' element = {<Hotels />}/>
        <Route path='*' element={<Error/>}> </Route>
      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
