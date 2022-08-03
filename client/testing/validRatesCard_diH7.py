from distutils.util import change_root
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

options = webdriver.ChromeOptions()
options.add_argument('--enable-javascript')
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)


try:
    # test valid hotel page based on backend: http://localhost:8080/api/hotel/price/diH7/WD0M/2022-08-25/2022-08-29/en_US/SGD/SG/2
    driver.get("http://localhost:3000/hotels/diH7/WD0M/2022-08-25/2022-08-29/en_US/SGD/SG/2/0/1")
    driver.maximize_window()
    time.sleep(2)
    print("Test 0 Passed, valid hotels page: " + driver.current_url)

    # go through each room card and check its elements
    rooms = driver.find_elements(By.CLASS_NAME, "roomCard")
    assert(len(rooms) == 10)
    print("Test 1 Passed, all {} room types displayed".format(len(rooms)))
    
    roomTypes = driver.find_elements(By.CLASS_NAME, "room--normalized")
    actualRoomTypes = ["Premier Courtyard",
                        "Heritage Room",
                        "Quay Room",
                        "Marina Bay View  Room",
                        "Straits Club Courtyard",
                        "Straits Club Quay",
                        "Straits Club Marina Bay View  Room",
                        "Straits Club Courtyard",
                        "Straits Club Heritage",
                        "Loft"]
    rooms = []
    for i, room in enumerate(roomTypes):
        assert(room.get_attribute("textContent") in actualRoomTypes)
        rooms.append(room.get_attribute("textContent"))
    print("Test 2 Passed, all hotel names correspond to database: {}".format(rooms))

    roomImages = driver.find_elements(By.CLASS_NAME, "room--images")
    assert(len(roomImages) == 10)
    for i in roomImages:
        assert(i.is_displayed())
    print("Test 3 Passed, all 10 room types have images")
    
    freeCancellation = driver.find_elements(By.CLASS_NAME, "free--cancellation")
    assert(len(freeCancellation) == 18)
    print("Test 4 Passed, all 18 rooms have free cancellation")

    amenitiesList = driver.find_elements(By.CLASS_NAME, "room--amenities")
    assert(len(amenitiesList) == 10)
    for i in amenitiesList:
        amenities = i.find_elements(By.TAG_NAME, "li")
        print(", ".join([i.get_attribute("textContent") for i in amenities]))
    print("Test 5 Passed, all 10 room types have amenities")

    ratesList = driver.find_elements(By.CLASS_NAME, "room--rates")
    assert(len(ratesList) == 10)
    ratesCards = driver.find_elements(By.CLASS_NAME, "ratesCard")
    assert(len(ratesCards) == 18)
    print("Test 6 Passed, all 10 room types have a total of {} room rates".format(len(ratesCards)))
    freeBreakfast = driver.find_elements(By.CLASS_NAME, "free-breakfast")
    assert(len(freeBreakfast) == 10)
    print("Test 7 Passed, out of 18 room rates, {} provide free breakfast".format((len(freeBreakfast))))
    noBreakfast = driver.find_elements(By.CLASS_NAME, "no-breakfast")
    assert(len(noBreakfast) == 8)
    print("Test 8 Passed, out of 18 room rates, {} do not include breakfast".format(len(noBreakfast)))

    # check rates are sorted in ascending order and are clickable
    for rates in ratesList:
        rateCard = rates.find_elements(By.CLASS_NAME, "ratesCard")
        lowestPrice = float(rateCard[0].find_element(By.CLASS_NAME, "price").get_property("textContent")[2:])
        for i, rate in enumerate(rateCard):
            assert(rate.is_enabled())
            if (i > 0):
                price = float(rate.find_element(By.CLASS_NAME, "price").get_property("textContent")[2:])
                assert(lowestPrice <= price)
                lowestPrice = price
    print("Test 9 Passed, all 18 room rates are clickable and sorted in ascending order")

    # check for correct redirect
    firstRate = ratesCards[0]
    driver.execute_script("window.scrollTo(0, 1200);")
    time.sleep(1)

    # driver.save_screenshot('./client/testing/screenshots/room_rates_diH7.png')

    action = ActionChains(driver)
    action.move_to_element(firstRate).perform()
    time.sleep(1)
    button = firstRate.find_element(By.CLASS_NAME, "rates--container")
    button.click()
    time.sleep(2)

    # driver.save_screenshot('./client/testing/screen_room_confirmation.png')

    # test confirmation
    confirmation = driver.find_element(By.CLASS_NAME, "react-confirm-alert-button-group")
    no = confirmation.find_element(By.XPATH, "//button[@label='No']")
    driver.execute_script("arguments[0].click();", no)
    time.sleep(2)

    secRate = ratesCards[1]
    action.move_to_element(secRate).perform()
    time.sleep(1)
    button = firstRate.find_element(By.CLASS_NAME, "rates--container")
    button.click()
    time.sleep(2)

    confirmation = driver.find_element(By.CLASS_NAME, "react-confirm-alert-button-group")
    yes = confirmation.find_element(By.XPATH, "//button[@label='Yes']")
    driver.execute_script("arguments[0].click();", yes)
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/checkout")
    print("Test 10 Passed, confirmation page is clickable and redirectable to", driver.current_url)


except Exception as e:
    print(e)

finally:
    driver.quit()