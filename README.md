# ESC_Ascenda

to enter client: 
1. `cd client`
2. `npm install`
3. `npm start`

to enter backend/db:
1. `cd api`
2. `npm install`
3. `npm start`

use `npm start` to start the server

# backend call
1. hotel static data: http://localhost:8080/api/hotel/:id
e.g. http://localhost:8080/api/hotel/diH7

2. destination hotels: http://localhost:8080/api/destination/hotels/:id
e.g. http://localhost:8080/api/destination/hotels/4FBY 

3. price for a given hotel: http://localhost:8080/api/hotel/price/:id
e.g. http://localhost:8080/api/destination/hotels/C7r0 

4. hotel prices for a given destination: http://localhost:8080/api/destination/prices/:id
e.g. http://localhost:8080/api/destination/prices/0 //this is for testing only

## Mongodb:
https://cloud.mongodb.com/v2/62a1936a1131ef1ef96f9ff0#metrics/replicaSet/62a1946a522a036eec26ba6f/explorer/ascenda-hotel-booking/destinations/find 

# APIs:
1. static details for a given hotel:
    e.g. https://hotelapi.loyalty.dev/api/hotels/diH7 
    "https://hotelapi.loyalty.dev/api/hotels/"+<hotel_id>

2. hotels belonging to a particular destination
    E.g. https://hotelapi.loyalty.dev/api/hotels?destination_id=RsBU
    "https://hotelapi.loyalty.dev/api/hotels?destination_id="+<destination_id>

3. price for a given hotel
    E.g. https://hotelapi.loyalty.dev/api/hotels/diH7/price?destination_id=WD0M&checkin=2022-06-18&checkout=2022-06-19&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1
    "https://hotelapi.loyalty.dev/api/hotels/"+<hotel_id>+"/price?destination_id="+<destination_id>+"&checkin="+<checkin_YYYY-MM-DD>+"&checkout="+<checkout_YYYY-MM-DD>+"&lang="+<lang>+"&currency="+<currency>+"&country_code="+<country_code2>+"&guests="+<guest_number>+"&partner_id=1"
    ### params:
    - checkin_YYYY-MM-DD = 2022-06-18
    - checkout_YYYY-MM-DD = 2022-06-
    - lang = en_US,zh_CN,zh_TW,fr_FR,de_DE,it_IT,ja_JP,ko_KR,pt_BR,es_ES
    - currency = e.g. SGD, ISO code for currencies
    - country_code2 =  e.g. SG https://zh.wikipedia.org/zh-cn/ISO_3166-1
    - guest_number = int

    ### mock price
    E.g. https://ascendahotels.mocklab.io/api/destinations/WD0M/prices 
    https://ascendahotels.mocklab.io/api/destinations/"+<hotel_id>+"/prices 

4. hotel prices for a given destination
    E.g. https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=WD0M&checkin=2022-06-18&checkout=2022-06-19&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1
    https://hotelapi.loyalty.dev/api/hotels/prices?destination_id="+<destination_id>+"&checkin="+<checkin_YYYY-MM-DD>+"&checkout="+<checkout_YYYY-MM-DD>+"&lang="+<lang>+"&currency="+<currency>+"&country_code="+<country_code2>+"&guests="+<guest_number>+"&partner_id=1"

# Client Side

1. Link up Destination / Check-in Date with previous user input

## External Resources Used:

React-Date-Range: https://hypeserver.github.io/react-date-range/

FontAwesomeIcon: https://fontawesome.com/icons

React-Rating-Stars: https://www.npmjs.com/package/react-rating-stars-component

Pigeon-Maps: https://github.com/mariusandra/pigeon-maps




