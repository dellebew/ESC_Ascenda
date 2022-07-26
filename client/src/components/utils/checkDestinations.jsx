import { useParams } from "react-router-dom";
import Destinations from "../../pages/destinations/Destinations";
import { Navigate } from "react-router-dom";

const CheckDestinations = () => {
    const {childrenQty, page, roomQty} = useParams();
    
    return Number(childrenQty) >= 0 && Number(childrenQty) <= 6
        && Number(roomQty) > 0 && Number(roomQty) <= 6
        && Number(page) >= 0
      ? <Destinations />
      : <Navigate to={`/error`}/>;
};

export default CheckDestinations