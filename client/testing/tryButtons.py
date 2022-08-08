# ==== imports for selenium
from re import L
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time
import random
import string

# ==== instantiation for selenium
options = webdriver.ChromeOptions()
options.add_argument('--enable-javascript')
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
action = ActionChains(driver)

def trySearchBar():
    possibleInputs = string.ascii_lowercase + string.digits
    randomTextInput = random.choice(possibleInputs)
    print("randomTextInput: ",randomTextInput) # check that it is a string
    inputBox = driver.find_element(By.TAG_NAME, 'input')
    inputBox.send_keys(randomTextInput)

    # text = text + f"fillInput in: {driver.current_url}\n"
    print(f"fillInput in: {driver.current_url}\n")
    print("error is at EC")
     
    if EC.presence_of_element_located((By.CLASS_NAME, 'dropdown-row')):
        selector = driver.find_elements(By.CLASS_NAME, 'dropdown-row')
        n = random.randint(0,len(selector)-1)
        print("error is at action")
        action.move_to_element(selector[n]).perform()
        print(n, "moving")
        selector[n].click()
        time.sleep(2)
    
    # action.move_by_offset(-100)
    # action.double_click()

    #===== change number of people and number of rooms ====#
    if EC.presence_of_element_located((By.ID, 'search--people')):
        numbers = driver.find_element(By.ID, 'search--people')
        action.move_to_element(numbers).perform()
        numbers.click()
    if EC.presence_of_element_located((By.CLASS_NAME, 'increase')):
        print("presence detected")
        increaseBtn = driver.find_elements(By.CLASS_NAME, 'increase')
        print(len(increaseBtn))
        randomTimesOfIncrease = random.randint(0, 10)
        for i in range(randomTimesOfIncrease):
            randomIncreaseButton = random.randint(0, len(increaseBtn)-1)
            action.move_to_element(increaseBtn[randomIncreaseButton]).perform()
            increaseBtn[randomIncreaseButton].click()
        
    selector = driver.find_element(By.CLASS_NAME, 'search--button')
    action.move_to_element(selector).perform()
    print("moved to print")
    selector.click()
    time.sleep(2)

def tryNavBar():
    selector = driver.find_elements(By.TAG_NAME, 'a')
    action.move_to_element(selector[1]).perform()
    print("moved to print")
    selector[1].click()


# driver.get("http://localhost:3000/")
# driver.maximize_window()
# trySearchBar()
# tryNavBar()

f = open("./testing/logs/randomFuzzerLog.txt", "w")
f.write("text")
f.close()

# driver.quit()