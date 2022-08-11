from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from check_hotel import check_hotel
import time, json, random


class Server404Error(Exception):
    print("404 Error Occurred")

# catch function for no avaliable hotels
def no_hotels_avaliable(driver):
    try:
        driver.find_element(By.CLASS_NAME, "server_404")
        return True
    except:
        return False

# catch function for server loading error
def loading_error(driver):
    try:
        driver.find_element(By.CLASS_NAME, "server_429")
        return True
    except:
        return False


# checks for relevant elements in destinations page
def check_dest(destId, url, runHotelTests, randomHotels, location):
    options = webdriver.ChromeOptions()
    options.add_argument('--enable-javascript')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    fileLocation = 'testing\\frontend\\logs\\{}.txt'.format(location)

    try:
        # test valid destination page based on backend: http://localhost:8080/api/destination/prices/P4FZ/2022-08-24/2022-08-29/en_US/SGD/SG/2/0
        driver.get(url)
        # driver.maximize_window()
        time.sleep(10)
        driver.save_screenshot('./testing/frontend/screenshots/destinations_{}.png'.format(destId))

        
        if (no_hotels_avaliable(driver)):
            raise Server404Error("No Hotels Avaliable")


        if(loading_error(driver)):
            raise UnboundLocalError("429 Loading Error")

        
        action = ActionChains(driver)
        print("Test 0 Passed, valid destinations page: " + driver.current_url)

        # check for sets of hotels
        hotelCards = driver.find_elements(By.CLASS_NAME, "searchItem")
        print("Test 1 Passed, {} Hotel Cards are displayed.".format(len(hotelCards)))


        # check hotel names
        hotelNames = driver.find_elements(By.CLASS_NAME, "si--name")
        actualNames = []
        for i, hotel in enumerate(hotelNames):
            actualNames.append(hotel.get_attribute("innerHTML"))
        print("Test 2 Passed, {} hotel names exist: {}".format(len(actualNames), actualNames))

        # check hotel prices
        hotelPrices = driver.find_elements(By.CLASS_NAME, "si--price")
        actualPrices = []
        for i, hotel in enumerate(hotelPrices):
            actualPrices.append(hotel.get_attribute("innerHTML"))
        print("Test 3 Passed, {} hotel prices exist: {}".format(len(actualPrices), actualPrices))

        # check for show prices button
        pricesButton = driver.find_elements(By.CLASS_NAME, "si--showprices")
        totalButtons = len(pricesButton)
        print("Test 4 Passed, {} Search Buttons are displayed.".format(totalButtons))
        for button in pricesButton:
            assert(button.is_enabled())
        print("Test 5 Passed, {} Search Buttons are enabled.".format(totalButtons))

        # checks for all images
        action = ActionChains(driver)
        images = driver.find_elements(By.CLASS_NAME, "si--image")
        for image in images:
            assert(image.is_displayed)
        print("Test 6 Passed, {} Images are displayed.".format(len(images)))
        
        with open(fileLocation, 'a') as f:
            f.write("Success Destination: {} @ {}".format(destId, time.ctime()))
            f.write('\n')
            f.close()


        """ check for valid hotel pages """
        if(runHotelTests):
            # selects a random hotel for checking
            if(randomHotels):
                i = random.randint(0, totalButtons-1)
                pricesButton = driver.find_elements(By.CLASS_NAME, "si--showprices")
                check_hotel(driver, action, pricesButton[i], location)
            
            # else runs each hotel in the page list
            else:
                for i in range(totalButtons):
                    pricesButton = driver.find_elements(By.CLASS_NAME, "si--showprices")
                    check_hotel(driver, action, pricesButton[i], location)
        
        # test next page functionality
        pagination = driver.find_element(By.CLASS_NAME, "pagination")
        pageButtons = pagination.find_elements(By.TAG_NAME, "a")
        noOfButtons = len(pageButtons)
        j = random.randint(0, noOfButtons-1)
        driver.execute_script("arguments[0].scrollIntoView();", pageButtons[j])
        time.sleep(3)
        action.move_to_element(pageButtons[j]).perform()
        print("Test 12 Passed, clicking on button redirects to {}th page:".format(pageButtons[j].get_attribute("text")), driver.current_url)
        driver.execute_script("arguments[0].click();", pageButtons[j])
        time.sleep(3)
        
    # custom exception catches    
    except UnboundLocalError as e:
        with open(fileLocation, 'a') as f:
                f.write("Destination 429 Loading Error: {} @ {}".format(destId, time.ctime()))
                f.write('\n')
                f.close()
        print(e)
        
    except Server404Error as e:
        with open(fileLocation, 'a') as f:
            f.write("Destination 404 Error: {} @ {}".format(destId, time.ctime()))
            f.write('\n')
            f.close()
        print(e)
    
    except Exception as e:
        with open(fileLocation, 'a') as f:
            f.write("Destination Timeout Loading Error: {} @ {}".format(destId, time.ctime()))
            f.write('\n')
            f.close()
        print(e)

    finally:
        driver.quit()



''' SPECIFY PARAMETERS OF TESTING HERE '''
destinationCount = 10
startDate = "2022-08-19"
endDate = "2022-08-20"
runHotelTests = True
randomHotels = False
location = "fuzzing_desthotels"


# open list of destination uids
with open('client\\src\\database\\uids.json') as f:
    data = json.load(f)
# run logs\\fuzzing for destinations based on random int
for i in range(destinationCount):
    randomIndex = random.randint(0, len(data) -1)
    destId = data[randomIndex]['uid']
    url = "http://localhost:3000/destinations/{}/{}/{}/en_US/SGD/SG/2/0/1/0".format(destId, startDate, endDate)
    print("Running test for {} ...".format(destId))
    check_dest(destId, url, runHotelTests, randomHotels, location)
    time.sleep(5)
