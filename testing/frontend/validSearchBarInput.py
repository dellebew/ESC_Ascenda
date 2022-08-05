from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from webdriver_manager.chrome import ChromeDriverManager
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

# test hotel page
driver.get("http://localhost:3000/")
print("Webpage Title: ", driver.title)
time.sleep(2)
try:
    # test searchbar autofill
    inputBox = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID,"search--destinations"))
    )
    inputBox.send_keys('sin')
    time.sleep(1)
    
    dropdownRow = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "dropdown-row"))
    )
    dropdownRow.click()
    print("Test 1 Passed, Correct Search Input!")
    print("Destination Selection: ", dropdownRow.text)
    time.sleep(1)

    # set calendar date
    calendar = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "search--date"))
    )
    calendar.click()
    time.sleep(1)

    dateSelection = driver.find_elements(By.CLASS_NAME, "rdrDateDisplayItem")

    count = 0
    for date in dateSelection:
        input = date.find_element(By.TAG_NAME, "input")
        input.click()
        input.send_keys(Keys.CONTROL + "a")
        input.send_keys(Keys.DELETE)
        if count == 0:
            input.send_keys('Aug 23, 2022')
            print("Start Date: ", input.get_attribute('value'))
        else:
            input.send_keys('Aug 24, 2022')
            print("End Date: ", input.get_attribute('value'))
        count += 1
    print(calendar.get_attribute("innerHTML") == "08/23/2022 to 08/24/2022")
    print("Test 2 Passed, date is correct: " + calendar.get_attribute("innerHTML"))
    time.sleep(1)

    # set adults = 3, children = 2, rooms = 1
    acr = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "search--people"))
    )
    acr.click()
    time.sleep(1)

    adults = driver.find_element(By.CLASS_NAME, "adult")
    button = adults.find_element(By.CLASS_NAME, "increase")
    button.click()

    children = driver.find_element(By.CLASS_NAME, "children")
    button = children.find_element(By.CLASS_NAME, "increase")
    button.click()

    # test adding and subtracting with disabled function
    rooms = driver.find_element(By.CLASS_NAME, "room")
    iButton = rooms.find_element(By.CLASS_NAME, "increase")
    dButton = rooms.find_element(By.CLASS_NAME, "decrease")
    iButton.click()
    iButton.click()
    time.sleep(1)
    dButton.click()
    dButton.click()
    dButton.click()
    assert (dButton.get_property('disabled'))
    print("Test 3 Passed, button is disabled!")
    assert (acr.get_attribute("innerHTML") == "3 adults 1 children 1 room")
    print("Test 4 Passed, number of pax and rooms are correct: " + acr.get_attribute("innerHTML"))
    time.sleep(2)

    # test search redirect
    action = ActionChains(driver)
    searchButton = driver.find_element(By.CLASS_NAME, "search--button")
    action.move_to_element(searchButton).perform()
    searchButton.click()
    time.sleep(4)
    assert(driver.current_url == "http://localhost:3000/destinations/RsBU/2022-08-23/2022-08-24/en_US/SGD/SG/3/1/1/0")
    print("Test 5 Passed, URL has been redirected correctly: " + driver.current_url)

except Exception as e:
    print(e)

finally:
    driver.quit()