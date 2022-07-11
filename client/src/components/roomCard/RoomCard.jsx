import RatesCard from "../ratesCard/RatesCard"
import "./roomCard.css"

const RoomCard = () => {
    return (
        <div className="roomCard">
            <div className="room--container">
                <div className="room-body">
                    <img
                        src="https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/78478012.jpg?k=3d82d2321cf8e1c9de658b7720a1d835f015d7ac55fa782be05d69db0a97c8b5&o=&hp=1"
                        alt=""
                        className="room--image"
                    />
                    <div className="room--details">
                        <h3 className="room--normalized">Deluxe Room, 1 King Bed</h3>
                        <span className="free-cancellation">Free Cancellation</span>
                        <p className="description">This is a very long description of the room.</p> 
                    </div>
                </div>
                <div className="room--pricing"> 
                        <span className="website">EAN</span>
                        <span className="price">$123</span>
                        <span className="room">for 1 room for 1 night</span>
                        <button className="reserve">Reserve</button>
                </div>
            </div>
            <div className="room--options">
                <div className="room--header">Market Rates</div>
                <div className="room--body">
                    <RatesCard />
                    <RatesCard />
                    <RatesCard />
                    <RatesCard />
                </div>

            </div>
        </div>
    )
}

export default RoomCard