import { useParams } from "react-router-dom";
import Hotels from "../../pages/hotels/Hotels"
import { Navigate } from "react-router-dom";

const CheckHotels = () => {
  const {adultsQty, childrenQty, 
    roomQty, 
    hotelId, destId,
    checkout, checkin} = useParams();

    console.log(hotelId.length)

  function isValidDate(s) {
    if (!/^\d\d\d\d-\d\d\-\d\d/.test(s) ) {
      return false;
    }
    const parts = s.split('-').map((p) => parseInt(p, 10));
    parts[0] -= 1;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.getMonth() === parts[1] - 1 && d.getDate() === parts[2] && d.getFullYear() === parts[0];
  }
    
    return Number(adultsQty) > 0 && Number(adultsQty) <= 20
        && Number(childrenQty) >= 0 && Number(childrenQty) <= 6
        && Number(roomQty) > 0 && Number(roomQty) <= Number(adultsQty)
        && (hotelId.length) === 4 && (destId.length) === 4 
        && isValidDate(checkout) && isValidDate(checkin)
      ? <Hotels />
      : <Navigate to={`/invalid-url`}/>;
};

export default CheckHotels