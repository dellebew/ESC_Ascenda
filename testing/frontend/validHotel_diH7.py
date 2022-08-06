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

    # check for valid hotel name
    hotelName = driver.find_element(By.ID, "hotelName")
    assert(hotelName.get_attribute("textContent") == "The Fullerton Hotel Singapore")
    print("Test 1 Passed, correct hotel name:", hotelName.get_attribute("textContent"))

    driver.save_screenshot('./testing/frontend/screenshots/hotel_diH7.png')

    # check valid hotel static elements
    hotelAddress = driver.find_element(By.ID, "hotelAddress")
    assert("1 Fullerton Square" in hotelAddress.get_attribute("textContent"))
    print("Test 2 Passed, address exists:", hotelAddress.get_attribute("textContent"))

    hotelRatings = driver.find_element(By.CLASS_NAME, "react-stars")
    assert(hotelRatings.is_displayed)
    print("Test 3 Passed, rating exists")

    hotelDesc = driver.find_element(By.CLASS_NAME, "desc")
    shortDesc = hotelDesc.get_attribute("textContent")[:20]
    assert(hotelDesc.get_attribute("textContent"))
    print("Test 4 Passed, description exists: {}...".format(shortDesc))

    hotelMap = driver.find_element(By.CLASS_NAME, "pigeon-tiles-box")
    assert(hotelMap.is_displayed)
    hotelLocation = driver.find_element(By.CLASS_NAME, "location")
    assert(hotelLocation.get_attribute("textContent") == "(1.28624, 103.852889)")
    print("Test 5 Passed, map exists:", hotelLocation.get_attribute("textContent"))

    hotelAmenities = driver.find_element(By.CLASS_NAME, "hotel--amenities")
    amenities = hotelAmenities.find_elements(By.TAG_NAME, "li")
    assert(len(amenities) == 13)
    print("Test 6 Passed, {} amenities exist".format(len(amenities)))

    hotelRatings = driver.find_elements(By.CLASS_NAME, "amenities--ratings")
    assert(len(hotelRatings) == 10)
    print("Test 7 Passed, {} ratings exist".format(len(hotelRatings)))
    
    # check that image slider is working
    action = ActionChains(driver)
    hotelImages = driver.find_elements(By.CLASS_NAME, "slide")
    assert(len(hotelImages) == 56)
    print("Test 8 Passed, {} images exist".format(len(hotelImages)))
    for i in range(10):
        if (i < 5):
            leftClick = driver.find_element(By.CLASS_NAME, "fa-arrow-left")
            action.move_to_element(leftClick).perform()
            time.sleep(1)
            leftClick.click()
        else:
            rightClick = driver.find_element(By.CLASS_NAME, "fa-arrow-right")
            action.move_to_element(rightClick).perform()
            time.sleep(1)
            rightClick.click()
        time.sleep(0.5)
    print("Test 9 Passed, able to scroll through images")


    # check that show more buttons work
    showDesc = driver.find_element(By.CLASS_NAME, "show--more")
    originalHeight = hotelDesc.get_attribute("clientHeight") 
    assert(originalHeight == "300")
    
    driver.execute_script("window.scrollTo(0, 600);")
    time.sleep(2)
    driver.execute_script("arguments[0].click();", showDesc)
    time.sleep(3)
    
    currentHeight = hotelDesc.get_attribute("clientHeight") 
    assert(currentHeight >= originalHeight)
    print("Test 10 Passed, show more description increases box length from {} to {}".format(originalHeight, currentHeight))
    driver.execute_script("arguments[0].click();", showDesc)

    showAmenities = driver.find_element(By.CLASS_NAME, "show--amenities")
    amenitiesBox = driver.find_element(By.CLASS_NAME, "amenities")
    originalHeight = amenitiesBox.get_attribute("clientHeight") 
    assert(originalHeight == "200")
    
    time.sleep(2)
    driver.execute_script("arguments[0].click();", showAmenities)
    time.sleep(3)
    currentHeight = amenitiesBox.get_attribute("clientHeight") 
    assert(currentHeight >= originalHeight)
    print("Test 11 Passed, show more amenities increases box length from {} to {}".format(originalHeight, currentHeight))
    driver.execute_script("arguments[0].click();", showAmenities)
    
except Exception as e:
    print(e)

finally:
    driver.quit()