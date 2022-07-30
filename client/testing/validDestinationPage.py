from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

try:
    # test valid destination page based on backend: http://localhost:8080/api/destination/prices/P4FZ/2022-07-24/2022-07-29/en_US/SGD/SG/2/0
    driver.get("http://localhost:3000/destinations/P4FZ/2022-07-24/2022-07-29/en_US/SGD/SG/2/0/1/0")
    time.sleep(4)
    print("Test 0 Passed, valid destinations page: " + driver.current_url)

    # check for 10 sets of hotels
    hotelCards = driver.find_elements(By.CLASS_NAME, "searchItem")
    assert(len(hotelCards) == 10)
    print("Test 1 Passed, 10 Hotel Cards are displayed.")


    # check hotel names
    hotelNames = driver.find_elements(By.CLASS_NAME, "si--name")
    actualHotels = ["ibis Styles London Southwark Rose",
                    "Ibis London Docklands",
                    "Carlton Hotel",
                    "ibis London Earls Court",
                    "Holiday Inn London - Commercial Road",
                    "ibis London Shepherds Bush",
                    "ibis London Stratford",
                    "Best Western The Cromwell",
                    "ibis London Excel Docklands",
                    "ibis London Blackfriars"]
    for i, hotel in enumerate(hotelNames):
        assert(hotel.get_attribute("innerHTML") == actualHotels[i])
        print(hotel.get_attribute("innerHTML"))
    print("Test 2 Passed, all hotel names correspond to database")

    # check hotel prices
    hotelPrices = driver.find_elements(By.CLASS_NAME, "si--price")
    actualPrices = ["2368.52", "1677.54", "1647.08", "1291.65", "1630.8",
                    "1382.17", "1449.31", "1942.2", "1449.69", "2095.71"]
    for i, hotel in enumerate(hotelPrices):
        assert( int(hotel.get_attribute("innerHTML")[2:]) == round(float(actualPrices[i])))
        print(hotel.get_attribute("innerHTML"))
    print("Test 3 Passed, all hotel prices correspond to database")

    # check for show prices button
    pricesButton = driver.find_elements(By.CLASS_NAME, "si--showprices")
    assert(len(pricesButton) == 10)
    print("Test 4 Passed, 10 Search Buttons are displayed.")
    for button in pricesButton:
        assert(button.is_enabled())
    print("Test 5 Passed, all 10 Search Buttons are enabled.")

    # check that first hotel redirects correctly
    pricesButton[0].click()
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/hotels/MnnQ/P4FZ/2022-07-24/2022-07-29/en_US/SGD/SG/2/0/1")
    hotelName = driver.find_element(By.CLASS_NAME, "hotel--name")
    assert(hotelName.find_element(By.TAG_NAME, "h1").get_attribute("textContent") == actualHotels[0])
    print("Test 6 Passed, redirects to correct hotel: ", actualHotels[0])
    time.sleep(5)

    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/destinations/P4FZ/2022-07-24/2022-07-29/en_US/SGD/SG/2/0/1/0")
    # check for all 10 images
    driver.implicitly_wait(10)
    images = driver.find_elements(By.CLASS_NAME, "si--image")
    assert(len(images) == 10)
    for image in images:
        assert(image.is_displayed)
    print("Test 7 Passed, 10 Images are displayed.")

    	
    lastPage= driver.find_element(By.XPATH, "//a[text()='53']")
    assert(lastPage.text == "53")
    print("Test 8 Passed, max number of pages:",lastPage.text)

    # check next page is enabled
    nextPage = driver.find_element(By.CLASS_NAME, "next")
    assert(nextPage.is_enabled())
    button = nextPage.find_element(By.TAG_NAME, "a")
    time.sleep(3)
    driver.execute_script("arguments[0].scrollIntoView();", button)
    time.sleep(5)
    driver.execute_script("arguments[0].click();", button)
    assert(driver.current_url == "http://localhost:3000/destinations/P4FZ/2022-07-24/2022-07-29/en_US/SGD/SG/2/0/1/1")
    print("Test 9 Passed, clicking on next button redirects to next page:", driver.current_url)
    time.sleep(3)

except Exception as e:
    print(e)

finally:
    driver.quit()