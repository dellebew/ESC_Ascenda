import "./header.css"
import SearchBar from '../searchBar/SearchBar'

const Header = () => {
    return (
        <div className="header">
            <div className="header--container">
                <h1 className="header--title">Find your next stay</h1>
                <p className="header--desc">
                    Search deals at your destinations... 
                    Get rewarded for your travels!
                </p>
                <SearchBar/>
            </div>
            
        </div>
    )
}

export default Header