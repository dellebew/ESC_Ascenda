export default async function callApi(type, state) {
    let response;

    // converts no of rooms and pax into "x|x|x" format
    async function adultsRooms() {
        let result
        const totalPax = Number(state.adultsQty)
        const rooms = Number(state.roomQty)
        const paxPerRoom = Math.floor(totalPax/rooms)
        const test = String(paxPerRoom) + "|"
        const remainder = totalPax % rooms
        console.log(totalPax, rooms)
        console.log("pax" + paxPerRoom, "remainder" + remainder)
        if (remainder === 0) {
            result = test.repeat(rooms)
        } else if (paxPerRoom > remainder) {
            result = (String(paxPerRoom + remainder)) + "|" + test.repeat(rooms-1) 
        } else if (paxPerRoom <= remainder) {
            let add = String(paxPerRoom+1) + "|"
            result = add.repeat(remainder) + test.repeat(rooms-remainder)
        }
        result = result.substring(0, result.length-1)
        console.log(result)
        return result
    }
    
    console.log(state)
    if (type === "hotel") {
        response = await fetch(`/api/${type}/${state.hotelId}`);
        if (response.status === 429) {
            console.log("429 Error")
            return "429"
        }
        
        if (response.status === 404) {
            console.log("404 Error")
            return "404"
        }
    } 
    else if (type === "hotel/price") {
        const adultRoom = await adultsRooms()
        console.log(adultRoom)
        response = await fetch(`/api/${type}/${state.hotelId}/${state.destId}/${state.checkin}/${state.checkout}/${state.lang}/${state.currency}/${state.code}/${adultRoom}`);
        console.log(response)
        if (response.status === 429) {
            console.log("429 Error")
            return "429"
        }

        if (response.status === 404) {
            console.log("404 Error")
            return "404"
        }
        const data = await response.json()
        console.log(data)
        return data[0].rooms
    } 
    else if (type === "destination/prices") {
        const adultRoom = await adultsRooms()
        console.log(adultRoom)
        response = await fetch(`/api/${type}/${state.destId}/${state.checkin}/${state.checkout}/${state.lang}/${state.currency}/${state.code}/${adultRoom}/${state.page}`);
        if (response.status === 429) {
            console.log("429 Error")
            return [0, "429"]
        }
        
        if (response.status === 404) {
            console.log("404 Error")
            return [0, "404"]
        }
        const data = await response.json()
        if (data[0] === 0) {
            data[0] = 1
        }
        return data
    }  
        
    const data = await response.json()
    console.log(data)
    return data
}