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
    # test valid destination page based on backend: http://localhost:8080/api/destination/prices/P4FZ/2022-08-24/2022-08-29/en_US/SGD/SG/2/0
    driver.get("http://localhost:3000/destinations/P4FZ/2022-08-24/2022-08-29/en_US/SGD/SG/2/0/1/0")
    driver.maximize_window()
    time.sleep(3)
    print("Test 0 Passed, valid destinations page: " + driver.current_url)
    driver.save_screenshot('./testing/frontend/screenshots/dest_P4FZ.png')

    # check for 6 sets of hotels
    hotelCards = driver.find_elements(By.CLASS_NAME, "searchItem")
    assert(len(hotelCards) == 6)
    print("Test 1 Passed, 6 Hotel Cards are displayed.")


    # check hotel names
    hotelNames = driver.find_elements(By.CLASS_NAME, "si--name")
    actualHotels = ["Novotel Birmingham Airport",
                    "The Arden Hotel",
                    "Diamond - Postbox Apartment 2",
                    "Jurys Inn Birmingham",
                    "Staycity Aparthotels Newhall Square",
                    "Hatters Birmingham"]
    for i, hotel in enumerate(hotelNames):
        assert(hotel.get_attribute("innerHTML") == actualHotels[i])
        print(hotel.get_attribute("innerHTML"))
    print("Test 2 Passed, all hotel names correspond to database")

    # check hotel prices
    hotelPrices = driver.find_elements(By.CLASS_NAME, "si--price")
    actualPrices = ["909.24", "1871.86", "7939.53", "926.19", "1041.32", "517.29"]
    for i, hotel in enumerate(hotelPrices):
        assert( int(hotel.get_attribute("innerHTML")[2:]) == round(float(actualPrices[i])))
        print(hotel.get_attribute("innerHTML"))
    print("Test 3 Passed, all hotel prices correspond to database")

    # check for show prices button
    pricesButton = driver.find_elements(By.CLASS_NAME, "si--showprices")
    assert(len(pricesButton) == 6)
    print("Test 4 Passed, 6 Search Buttons are displayed.")
    for button in pricesButton:
        assert(button.is_enabled())
    print("Test 5 Passed, all 6 Search Buttons are enabled.")

    # check that first hotel redirects correctly
    action = ActionChains(driver)
    for i in range(6):
        pricesButton = driver.find_elements(By.CLASS_NAME, "si--showprices")
        
        # select button
        driver.execute_script("arguments[0].scrollIntoView();", pricesButton[i])
        time.sleep(2)
        action.move_to_element(pricesButton[i]).perform()
        pricesButton[i].click()

        # change driver windows to new tab
        p = driver.current_window_handle
        parent = driver.window_handles[0]
        child = driver.window_handles[1]
        driver.switch_to.window(child)
        time.sleep(5)

        print(driver.current_url)
        hotelName = driver.find_element(By.ID, "hotelName")
        assert(hotelName.get_attribute("textContent") == actualHotels[i])
        driver.close()
        driver.switch_to.window(parent)
        time.sleep(5)
    print("Test 6 Passed, redirects to correct hotel: ", actualHotels[0])

    # check for all 6 images
    driver.implicitly_wait(10)
    images = driver.find_elements(By.CLASS_NAME, "si--image")
    assert(len(images) == 6)
    for image in images:
        assert(image.is_displayed)
    print("Test 7 Passed, 6 Images are displayed.")

    	
    lastPage= driver.find_element(By.XPATH, "//a[text()='103']")
    assert(lastPage.text == "103")
    print("Test 8 Passed, max number of pages:",lastPage.text)

    # check next page is enabled
    nextPage = driver.find_element(By.CLASS_NAME, "next")
    assert(nextPage.is_enabled())
    button = nextPage.find_element(By.TAG_NAME, "a")
    time.sleep(3)
    driver.execute_script("arguments[0].scrollIntoView();", button)
    time.sleep(3)
    action.move_to_element(button).perform()
    driver.execute_script("arguments[0].click();", button)
    assert(driver.current_url == "http://localhost:3000/destinations/P4FZ/2022-08-24/2022-08-29/en_US/SGD/SG/2/0/1/1")
    print("Test 9 Passed, clicking on next button redirects to next page:", driver.current_url)
    time.sleep(3)

except Exception as e:
    print(e)

finally:
    driver.quit()