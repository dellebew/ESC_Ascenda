import "./hotelsList.css"
import Navbar from "../../components/navbar/Navbar"
import SearchItem from "../../components/searchItem/SearchItem"
import { DateRange} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import SearchBar from "../../components/searchBar/SearchBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";


const List = () => {
    
    // const [openDate, setOpenDate] = useState(false);

 
    const location = useLocation(); // retrieves data from home page
    // const [destination, setDestination] = useState(location.state.destination)
    // const [date, setDate] = useState(location.state.date)
    // const [options, setOptions] = useState(location.state.option)

    const similarTermsArray = location.state.similar;
    const searchElement = location.state.searched;
    const allItems = location.state.fullArray;

    console.log(similarTermsArray);
    console.log(searchElement);

    function htmlDecode(input){
        var e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
      };

    function searchItem(img, name, address, distance, cancellation, description, ratingScore, ratingClass, pricing) {
        return (
            <div className="searchItem">
            <img
                src={img}
                alt=""
                className="si--image"
            />
            <div className="si--desc">
                <h1 className="si--name">{name}</h1>
                <div className="si--small">
                    <span className="si--address">{address}</span>
                    <span className="si--distance">{distance}</span>
                    <span className="si--cancellation"><b>{cancellation}</b></span>
                </div>

                <span className="si--description"><div dangerouslySetInnerHTML={{ __html: htmlDecode({description}) }} /></span>
            </div>
            <div className="si--details">
                <div className="si--rating"> 
                    <button>{ratingScore}</button>
                    <span>{ratingClass}</span>
                </div>
                <div className="si--pricing"> 
                    <span className="si--from">From</span>
                    <span className="si--price">{pricing}</span>
                    <button className="si--check">Show Prices</button>
                </div>
            </div>
        </div>
        )
    }

    //If click on boxed on dropdown bar, it will return empty for similar terms array,
    //however, search Element will return that particular term's entire array
    //If searchTerm is vague and does not point to any exact name, it will return full array in similar terms array,
    //however, search term will just be the vague string input.
    function theChecker(simElements, term, everything) {
        if (similarTermsArray.length == 0) {
            //I cannot find pricing, cancellation details. Will see how to do rating score as there is a rating key outside and rating value
            //inside original metadata array
            console.log("If/Else is successful!");
            console.log(term.description);

            
            return (searchItem(term.imgix_url, term.name, term.address, term.distance + "m away from your current location", "Free cancellation",
            term.description, "9.5", "Excellent", "$50"))
        } else {
            //for loop function goes here
            ;
        }
    }
    //Untested: Typing the full exact name in the searchBar, results in something weird. Need to test later

    

    // This function will be the item that is going to be for looped
    
    
    

    // test run 1
    // function dingus (name) {
    //     return (
    //         <div className="searchItem">
    //             <img
    //                 src="https://t-cf.bstatic.com/xdata/images/hotel/square200/28344036.webp?k=72665465d8384e43417e12ab2a6db168f5aa38864bdf1b1183050282ae779711&o=&s=1"
    //                 alt=""
    //                 className="si--image"
    //             />
    //             <div className="si--desc">
    //                 <h1 className="si--name">{name}</h1>
    //                 <div className="si--small">
    //                     <span className="si--address">Hello</span>
    //                     <span className="si--distance">500m from center</span>
    //                     <span className="si--cancellation"><b>Free Cancellation</b></span>
    //                 </div>
    
    //                 <span className="si--description">
    //                     Grand Copthorne Waterfront is located along the Singapore River. 
    //                     A 5-minute drive from Orchard Road, the hotel offers an outdoor pool, 4 restaurants and free parking. 
    //                 </span>
    //             </div>
    //             <div className="si--details">
    //                 <div className="si--rating"> 
    //                     <button>8.9</button>
    //                     <span>Excellent</span>
    //                 </div>
    //                 <div className="si--pricing"> 
    //                     <span className="si--from">From</span>
    //                     <span className="si--price">$123</span>
    //                     <button className="si--check">Show Prices</button>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }
    

    const [date, setDate] = useState([
        {
        startDate: new Date(),
        endDate: null,
        key: 'selection'
        }
    ]);

    return (
        <div>
            <Navbar />
            <SearchBar />
            <div className="list--container">
                <div className="list--wrapper">
                    <div className="list--search">
                        
                        <div className="search--title">
                            <h2>Filter By</h2>
                        </div>
                        
                        <div className="list--item">
                            <div className="option--item">
                                <span className="option--text">
                                    Min price <small> (per night) </small>
                                </span>
                                <input type='number' min={1} className="option--input" placeholder="WIP"></input>
                            </div>
                            <div className="option--item">
                                <span className="option--text">
                                    Max price <small> (per night) </small>
                                </span>
                                <input type='number' min={1} className="option--input" placeholder="WIP"></input>
                            </div>
                            <div className="option--item">
                                <span className="option--text">
                                    Adult 
                                </span>
                                <input type='number' min={1} className="option--input" placeholder="WIP"></input>
                            </div>
                            <div className="option--item">
                                <span className="option--text">
                                    Children
                                </span>
                                <input type='number' min={0} className="option--input" placeholder="WIP"></input>
                            </div>
                            <div className="option--item">
                                <span className="option--text">
                                    Rooms
                                </span>
                                <input type='number' min={1} className="option--input" placeholder="WIP"></input>
                            </div>
                        </div>
                        <button>Search</button>
                    </div> 
                    <div className="list--result">
                        {/* {dingus("gayFuck")} */}
                        {theChecker(similarTermsArray, searchElement, allItems)}
                        {/* <SearchItem/>
                        <SearchItem/>
                        <SearchItem/> */}
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default List