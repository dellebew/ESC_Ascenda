import { useParams } from "react-router-dom";
import Hotels from "../../pages/hotels/Hotels"
import { Navigate } from "react-router-dom";

const CheckHotels = () => {
    const {childrenQty, roomQty} = useParams();
    
    return Number(childrenQty) >= 0 && Number(childrenQty) <= 6
        && Number(roomQty) > 0 && Number(roomQty) <= 6
      ? <Hotels />
      : <Navigate to={`/error`}/>;
};

export default CheckHotels