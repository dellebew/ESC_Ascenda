import { useParams } from "react-router-dom";
import Hotels from "../../pages/hotels/Hotels"
import { Navigate } from "react-router-dom";

const CheckHotels = () => {
  const {childrenQty, roomQty, 
    checkout, checkin} = useParams();

  function isValidDate(s) {
    if (!/^\d\d\d\d-\d\d\-\d\d/.test(s) ) {
      return false;
    }
    const parts = s.split('-').map((p) => parseInt(p, 10));
    parts[0] -= 1;
    const d = new Date(parts[0], parts[1], parts[2]);
    console.log(d)
    return d.getMonth() === parts[1] && d.getDate() === parts[2] && d.getFullYear() === parts[0];
  }
    
    return Number(childrenQty) >= 0 && Number(childrenQty) <= 6
        && Number(roomQty) > 0 && Number(roomQty) <= 6
        && isValidDate(checkout) && isValidDate(checkin)
      ? <Hotels />
      : <Navigate to={`/invalid-url`}/>;
};

export default CheckHotels