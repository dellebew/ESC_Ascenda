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

def validCheckoutDisplay(hotelLink, count):
    try:
        # hotelLink = "http://localhost:3000/hotels/lXJq/WD0M/2022-08-03/2022-08-04/en_US/SGD/SG/2/0/1"
        
        #========== entering from hotel page =======#
        driver.get(hotelLink)
        driver.maximize_window()
        
        element = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'ratesCard'))
        )
        time.sleep(2)
        
        ratesCards = driver.find_elements(By.CLASS_NAME, 'ratesCard')
        firstRate = ratesCards[0]
        driver.execute_script("return arguments[0].scrollIntoView();", firstRate)
        print("scrolled")

        action = ActionChains(driver)
        time.sleep(3)
        action.move_to_element(firstRate).perform()
        button = firstRate.find_element(By.CLASS_NAME, "rates--container")
        button.click()
        time.sleep(2)

        # test confirmation
        confirmation = driver.find_element(By.CLASS_NAME, "react-confirm-alert-button-group")
        yes = confirmation.find_element(By.XPATH, "//button[@label='Yes']")
        driver.execute_script("arguments[0].click();", yes)
        time.sleep(2)

        assert(driver.current_url == "http://localhost:3000/checkout")

        print("Test 0 Passed, valid checkout page: " + driver.current_url)
        #========== leave hotel page =======#

        # ensure informatiom is displayed:
        # for i in range(9):
            # hotelNames = driver.find_elements(By.XPATH, "//span[{i}]")
        displayed = driver.find_elements(By.TAG_NAME, "span")
        for info in displayed:
            assert(len(info.text)!= 0)
        print("Test 1 pass, All 9 pieces of information are displayed")

        # check that rooms = 1
        num_of_rooms = displayed[4]
        print(num_of_rooms.text)
        assert(num_of_rooms.text == 1) 
        print("Test 2 passed, max room purchased = 1")

        # check that confirm purchase is clickable
        button = driver.find_element(By.TAG_NAME, "button")
        assert (button.is_enabled())
        print("Test 3 passed, button is clickable")

        print(f"Number {count} passed the Checkout Display test: {hotelLink}\n")

    except Exception as e:
        print(e)
        print(f"Number {count} failed the Checkout Display test: {hotelLink}\n")
 
    driver.quit()


# main code to be run for testing for payment 

hotelsListURL = [
    "http://localhost:3000/hotels/RC8n/WP3Z/2022-08-04/2022-08-05/en_US/SGD/ID/2/0/1",
    "http://localhost:3000/hotels/uSyP/YCcf/2022-08-03/2022-08-04/en_US/SGD/CN/2/0/1",
    "http://localhost:3000/hotels/AHVJ/YCcf/2022-08-03/2022-08-04/en_US/SGD/CN/2/0/1",
    "http://localhost:3000/hotels/yyZq/YCcf/2022-08-03/2022-08-04/en_US/SGD/CN/2/0/1",
    "http://localhost:3000/hotels/ndER/YCcf/2022-08-03/2022-08-04/en_US/SGD/CN/2/0/1",
]

for i, hotelURL in enumerate(hotelsListURL):
    print(i, hotelURL)
    validDisplay = validCheckoutDisplay(hotelURL, i)
