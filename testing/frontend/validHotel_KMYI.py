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
    # test valid hotel page based on backend: http://localhost:8080/api/hotel/price/KMYI/N23M/2022-08-24/2022-08-25/en_US/SGD/IT/2
    driver.get("http://localhost:3000/hotels/KMYI/N23M/2022-08-24/2022-08-25/en_US/SGD/IT/2/0/1")
    driver.maximize_window()
    time.sleep(7)
    print("Test 0 Passed, valid hotels page: " + driver.current_url)

    # check for valid hotel name
    hotelName = driver.find_element(By.ID, "hotelName")
    assert(hotelName.is_displayed)
    print("Test 1 Passed, hotel name exists:", hotelName.get_attribute("textContent"))

    driver.save_screenshot('./testing/frontend/screenshots/hotel_KMYI.png')

    # check valid hotel static elements
    hotelAddress = driver.find_element(By.ID, "hotelAddress")
    assert(hotelAddress.is_displayed)
    print("Test 2 Passed, address exists:", hotelAddress.get_attribute("textContent"))

    hotelRatings = driver.find_element(By.CLASS_NAME, "react-stars")
    assert(hotelRatings.is_displayed)
    print("Test 3 Passed, rating exists")

    hotelDesc = driver.find_element(By.CLASS_NAME, "desc")
    assert(hotelDesc.is_displayed)
    print("Test 4 Passed, description container exists")

    hotelMap = driver.find_element(By.CLASS_NAME, "pigeon-tiles-box")
    assert(hotelMap.is_displayed)
    hotelLocation = driver.find_element(By.CLASS_NAME, "location")
    assert(hotelLocation.is_displayed)
    print("Test 5 Passed, map exists:", hotelLocation.get_attribute("textContent"))

    hotelAmenities = driver.find_element(By.CLASS_NAME, "hotel--amenities")
    assert(hotelAmenities.is_displayed)
    print("Test 6 Passed, amenities container exist: {}".format(hotelAmenities.get_attribute("textContent")))

    hotelRatings = driver.find_element(By.CLASS_NAME, "hotel--ratings")
    assert(hotelRatings.is_displayed)
    print("Test 7 Passed, ratings container exist: {}".format(hotelRatings.get_attribute("textContent")))
    
    # check that main image exists
    action = ActionChains(driver)
    hotelImages = driver.find_element(By.CLASS_NAME, "hotel--images")
    assert(hotelImages.is_displayed)
    print("Test 8 Passed, images exist")

    # check that show more buttons work
    showDesc = driver.find_element(By.CLASS_NAME, "show--more")
    originalHeight = hotelDesc.get_attribute("clientHeight") 
    
    driver.execute_script("window.scrollTo(0, 600);")
    time.sleep(2)
    driver.execute_script("arguments[0].click();", showDesc)
    time.sleep(3)
    
    currentHeight = hotelDesc.get_attribute("clientHeight") 
    assert(currentHeight >= originalHeight)
    print("Test 9 Passed, show more description increases box length from {} to {}".format(originalHeight, currentHeight))
    driver.execute_script("arguments[0].click();", showDesc)
    
except Exception as e:
    print(e)

finally:
    driver.quit()