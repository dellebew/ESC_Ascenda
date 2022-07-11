import "./ratesCard.css"

const RatesCard = () => {
    return (
        <div className="ratesCard">
             <div className="rates--container">
                <div className="rates--details">
                    <span className="free-cancellation">Free Cancellation</span>
                </div>
                <div className="rates--pricing"> 
                        <span className="price">$123</span>
                        <span className="room">per night</span>
                        <h1 className="website">EAN</h1>
                </div>
            </div>
        </div>
    )
}

export default RatesCard