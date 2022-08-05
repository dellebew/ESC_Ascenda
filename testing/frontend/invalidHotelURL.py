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

# test hotels page: /hotels/:hotelId/:destId/:checkin/:checkout/:lang/:currency/:code/:adultsQty/:childrenQty/:roomQty/ 
try:    
    # Try to access invalid room value
    driver.get("http://localhost:3000/hotels/l2RN/RsBU/2022-08-29/2022-08-30/en_US/SGD/SG/2/0/-123")
    driver.maximize_window()
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 1 Passed, invalid room value '-123' redirects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid children value
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/hotels/l2RN/RsBU/2022-08-29/2022-08-30/en_US/SGD/SG/2/__/1")
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 2 Passed, invalid children '__' red irects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid adult value
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/hotels/l2RN/RsBU/2022-08-29/2022-08-30/en_US/SGD/SG/100/0/1")
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 3 Passed, invalid adult '100' redirects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid checkout date
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/hotels/l2RN/RsBU/2022-08-29/--/en_US/SGD/SG/2/0/1")
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 4 Passed, invalid checkout date '--' redirects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid checkin date
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/hotels/l2RN/RsBU/12335641/2022-08-30/en_US/SGD/SG/2/0/1")
    time.sleep(2)
    assert(driver.current_url == "http://localhost:3000/invalid-url")
    print("Test 5 Passed, invalid checkin date '12335641' redirects to error page: " + driver.current_url)
    time.sleep(2)

    # Try to access invalid destination id
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/hotels/l2RN/1_+a/2022-08-29/2022-08-30/en_US/SGD/SG/2/0/1")
    time.sleep(2)
    driver.execute_script("window.scrollTo(0, 600);")
    assert(driver.find_element(By.CLASS_NAME, "not-avaliable").is_displayed())
    print("Test 6 Passed, invalid destination id '1_+a' does not show valid rooms: " + driver.current_url)
    time.sleep(3)

    # Try to access invalid hotel id
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/hotels/AD?S/RsBU/2022-08-29/2022-08-30/en_US/SGD/SG/2/0/1")
    time.sleep(2)
    assert(driver.find_element(By.CLASS_NAME, "error-container").is_displayed())
    print("Test 7 Passed, invalid hotel id 'AD?S' redirects to error page: " + driver.current_url)
    time.sleep(3)

    # Try to input empty/missing values
    driver.switch_to.new_window('tab')
    driver.get("http://localhost:3000/hotels//RsBU/2022-08-29/2022-08-30/en_US/SGD/SG/2/0/1")
    time.sleep(2)
    assert(driver.find_element(By.CLASS_NAME, "error-container").is_displayed())
    print("Test 8 Passed, missing hotel id redirects to error page: " + driver.current_url)
    time.sleep(2)

    

except Exception as e:
    print(e)

finally:
    driver.quit()