import "./header.css"
import Hotel_SearchBar from '../searchBar/Hotel_searchBar'

const Hotel_Header = () => {
    return (
        <div className="header">
            <div className="header--container">
                <h1 className="header--title">Find your next stay</h1>
                <p className="header--desc">
                    Search deals on hotels, homes, and much more... 
                    Get rewarded for your travels!
                </p>
                <Hotel_SearchBar/>
            </div>
            
        </div>
    )
}

export default Hotel_Header