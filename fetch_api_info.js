async function fetch_api_info(url,identifier) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const promise1 = response.json();
    promise1.then(result => {
      // do sth with the result
      console.log(result); 
      return result[identifier];
  })

    // TODO: this is a promise and idk how to get the value and display on page

  } catch (err) {
    console.log(err);
  }
    
}

//demo
// fetch(this.props.apiUrl + this.state.username + '?client_Id=' + this.props.clientId + '&client_secret=' + this.props.clientSecret)
const url  = "https://ascendahotels.mocklab.io/api/destinations/WD0M/prices"
const identifier = "completed"
let promise1 = fetch_api_info(url,identifier)
promise1.then(result => {
    // do sth with the result
    console.log(result); 
 })
