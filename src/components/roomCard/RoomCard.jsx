import "./roomCard.css"

const RoomCard = () => {
    return (
        <div className="roomCard">
            <div className="room--desc">
                <img
                    src="https://t-cf.bstatic.com/xdata/images/hotel/max1024x768/78478012.jpg?k=3d82d2321cf8e1c9de658b7720a1d835f015d7ac55fa782be05d69db0a97c8b5&o=&hp=1"
                    alt=""
                    className="room--image"
                />
                <div className="room--details">
                    <h3 className="room--name">Deluxe Room, 1 King Bed</h3>
                    <span>Sleeps 3 people (including up to 2 children)</span>
                </div>
            </div>
            <div className="room--options">
                <div className="room--header">
                    <span>Options</span>
                    <span>Today’s Price including taxes and fees</span> 
                </div>
                <div className="room--body">
                    <div className="room--description"> 
                        <span>Fully Refundable</span>
                        <span><small>Until 29/06/2022</small></span>
                    </div>
                    <div className="room--pricing"> 
                        <span className="price">$123</span>
                        <span className="room">for 1 room for 1 night</span>
                        <button className="reserve">Reserve</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default RoomCard