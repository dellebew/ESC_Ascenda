import React from 'react'
import NavBar from "../../components/navbar/Navbar"
import Hotel_Header from "../../components/header/HotelHeader"
import "./hsearch.css"

const HotelsSearch = () => {
    
    return (
        <div class = "bg-container2">
            <div><NavBar/></div>
            <div><Hotel_Header/></div>
        </div>
    )
}

export default HotelsSearch