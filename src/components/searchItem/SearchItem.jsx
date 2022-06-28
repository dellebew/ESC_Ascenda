import "./searchItem.css"

const SearchItem = () => {
    return (
        <div className="searchItem">
            <img
                src="https://t-cf.bstatic.com/xdata/images/hotel/square200/28344036.webp?k=72665465d8384e43417e12ab2a6db168f5aa38864bdf1b1183050282ae779711&o=&s=1"
                alt=""
                className="si--image"
            />
            <div className="si--desc">
                <h1 className="si--name">Grand Copthorne Waterfront Singapore</h1>
                <div className="si--small">
                    <span className="si--address">392 Havelock Road, Robertson Quay, 169663 Singapore, Singapore</span>
                    <span className="si--distance">500m from center</span>
                    <span className="si--cancellation"><b>Free Cancellation</b></span>
                </div>

                <span className="si--description">
                    Grand Copthorne Waterfront is located along the Singapore River. 
                    A 5-minute drive from Orchard Road, the hotel offers an outdoor pool, 4 restaurants and free parking. 
                </span>
            </div>
            <div className="si--details">
                <div className="si--rating"> 
                    <button>8.9</button>
                    <span>Excellent</span>
                </div>
                <div className="si--pricing"> 
                    <span className="si--from">From</span>
                    <span className="si--price">$123</span>
                    <button className="si--check">Show Prices</button>
                </div>
            </div>
        </div>
    )
}

export default SearchItem