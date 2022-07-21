export default async function callApi(type, state) {
    let response;
    console.log(state)
    if (type == "hotel") {
        response = await fetch(`/api/${type}/${state.hotelId}`);
    } 
    else if (type == "hotel/price") {
        response = await fetch(`/api/${type}/${state.hotelId}/${state.destId}/${state.checkin}/${state.checkout}/${state.lang}/${state.currency}/${state.code}/${state.guests}`);
    } 
    else if (type == "destination/prices") {
            response = await fetch(`/api/${type}/${state.destId}/${state.checkin}/${state.checkout}/${state.lang}/${state.currency}/${state.code}/${state.guests}/${state.page}`);
        }
    
    const data = await response.json()
    console.log("data: " + data)
    return data
}