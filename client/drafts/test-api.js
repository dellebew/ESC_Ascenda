// Rename to App.js to test for api fetching

import React, {useEffect, useState} from 'react'

function App() {

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