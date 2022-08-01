from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# test destinations page: /destinations/:destId/:checkin/:checkout/:lang/:currency/:code/:adultsQty/:childrenQty/:roomQty/:page
try:    
    # Try to access invalid page number
    driver.get("http://localhost:3000/destinations/RsBU/2022-08-03/2022-08-04/en_US/SGD/SG/3/1/1/-1")
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 1 Passed, invalid page number '-1' redirects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid room value
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/destinations/RsBU/2022-08-03/2022-08-04/en_US/SGD/SG/3/1/asdas/0")
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 2 Passed, invalid room 'asdas' redirects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid children value
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/destinations/RsBU/2022-08-03/2022-08-04/en_US/SGD/SG/3/-as/1/0")
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 3 Passed, invalid children '-as' redirects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid adult value
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/destinations/RsBU/2022-08-03/2022-08-04/en_US/SGD/SG/dsadn/2/1/0")
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 3 Passed, invalid adult 'dsadn' redirects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid checkout date
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/destinations/RsBU/2022-08-03/2022-08-ss/en_US/SGD/SG/2/0/1/0")
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 4 Passed, invalid checkout date '2022-08-ss' redirects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid checkin date
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/destinations/RsBU/YYYY-MM-DD/2022-08-04/en_US/SGD/SG/2/0/1/0")
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 5 Passed, invalid checkin date 'YYYY-MM-DD' redirects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid destination id
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/destinations/HS__/2022-08-03/2022-08-04/en_US/SGD/SG/2/0/1/0")
    time.sleep(2)
    assert(driver.find_element(By.CLASS_NAME, "error-container").is_displayed())
    print("Test 6 Passed, invalid destination id 'HS__' redirects to error page: " + driver.current_url)
    time.sleep(3)

    # Try to input empty/missing values
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/destinations//2022-08-03/2022-08-04/en_US/SGD/SG/2/0/1/0")
    time.sleep(2)
    assert(driver.find_element(By.CLASS_NAME, "error-container").is_displayed())
    print("Test 7 Passed, missing destination id redirects to error page: " + driver.current_url)
    time.sleep(2)

    

except Exception as e:
    print(e)

finally:
    driver.quit()