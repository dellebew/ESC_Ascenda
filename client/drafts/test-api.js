// Rename to App.js to test for api fetching

import React, {useEffect, useState} from 'react'

function App() {

    // sample static api url fetch 
    // useEffect(() => {
    //     const getData = async() => {
    //         setLoading(true);
    //         const data = await fetch();
    //         const json = await data.json();
    //         setHotelData(json);
    //     };

    //     getData()
    //         .catch((err) => {
    //             setError(err.message)
    //             console.log(err.message);
    //         })
    //         .finally(() => {
    //             setLoading(false);
    //         });
    // }, []);


      // fetch("/api/destination/hotels/WD0M").then(
    //     response => response.json()
    //     ).then(
    //     data => {
    //         setDestData(data)
    //     })}, [])


    // sample static api url fetch 
    // useEffect(() => {
    //     fetch("/api/destination/hotels/WD0M").then(
    //     response => response.json()
    //     ).then(
    //     data => {
    //         setDestData(data)
    //     })}, [])

  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api/hotel/diH7").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  return(
    <div>
      {(typeof backendData === "undefined") ? (
        <p>Loading...</p>
      ): (
        <div>
          {JSON.stringify(backendData)}
        </div>
      )}
    </div>
  )
}

export default App