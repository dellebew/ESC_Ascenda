import NavBar from "../../components/navbar/Navbar"



import "./About.css"


const About = () => {

    
    return (
        <div className="whole-container">
            <div>
                <header className = "topBox">
                    <NavBar/>
                    <h1 className="aboutHeader">About Page</h1>
                </header>
                <main className= "main_desc">
                    <p>Backend Call</p>
                    <hr/>
                    <p>
                    1.    hotel static data: http://localhost:8080/api/hotel/:id e.g. http://localhost:8080/api/hotel/diH7<br/><br/>

                    2.    destination hotels: http://localhost:8080/api/destination/hotels/:id e.g. http://localhost:8080/api/destination/hotels/4FBY<br/><br/>

                    3.    price for a given hotel: http://localhost:8080/api/hotel/price/:id e.g. http://localhost:8080/api/destination/hotels/C7r0<br/><br/>

                    4.    hotel prices for a given destination: http://localhost:8080/api/destination/prices/:id e.g. http://localhost:8080/api/destination/prices/0 //this is for testing only<br/><br/>
                    </p>
                </main>

            </div>
            
        </div>
    )
}

export default About