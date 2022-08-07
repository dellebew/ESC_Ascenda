# ==== imports for selenium
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

# Post running report
text = ""

# ===== intention of tester -> random clicking in while loop for 1 hour to test for crashes ===== #
##### Notes
# pages open as a new tab. remember to redirect/point to the next page
# remember to detect if page opens
# remember to close opened tabs.

# necessary variables to track
currentBrowser = 0
totalBrowsersOpen = 1
currentTime = time.time()

# Action Counts
totalActionCount = 0
buttonActionCount = 0
enterNewTabActionCount = 0
closeNewTabActionCount = 0
inputTextActionCount = 0
scrollActionCount = 0
refreshBtnActionCount = 0
backBtnActionCount = 0

# Max trackers
maxBrowsersOpen = 1
numOfFails = 0
numOfCycles = 0

def getButtons(text):
    allbuttons = []
    allbuttonsread = []
    button_button = driver.find_elements(By.TAG_NAME, "button")
    a_button = driver.find_elements(By.TAG_NAME, "a")
    ratesCards = driver.find_elements(By.CLASS_NAME, 'ratesCard')
    confirmation = driver.find_elements(By.CLASS_NAME, "react-confirm-alert-button-group")

    # if EC.presence_of_element_located((By.TAG_NAME, "a")):
    if len(a_button) > 0:
        allbuttons+=a_button
        allbuttonsread += [len(a_button)*"a"]
    if len(button_button) > 0:
        allbuttons += button_button
        allbuttonsread += [len(button_button)*"button"]
    if len(ratesCards) > 0:
        allbuttons += ratesCards
        allbuttonsread += [len(ratesCards)*"ratesCards"]
    if len(confirmation) > 0:
        yes = confirmation.find_element(By.XPATH, "//button")
        allbuttons += yes
        allbuttonsread += [len(yes)*"yes"]
    text = text + f"List of all {len(allbuttons)}\n"
    print(f"List of all {len(allbuttons)}")
    return allbuttons

def goToNewTab(text):
    currentURL = driver.current_url
    driver.current_window_handle
    chwnd = driver.window_handles[totalBrowsersOpen-1] # newest addition
    driver.switch_to.window(chwnd) # go to most recent tab
    text = text + f"goToNewTab: from {currentURL}, redirect to {driver.current_url}\n"
    print(f"goToNewTab: from {currentURL}, redirect to {driver.current_url}\n")

def closeCurrentTab(text):
    if totalBrowsersOpen == 1:
        currentTabUrl = driver.current_url
        driver.get("http://localhost:3000")
        text = text + f"closeCurrentTab: {currentTabUrl}, last tab open, redirect to '/'\n"
        print(text + f"closeCurrentTab: {currentTabUrl}, last tab open, redirect to '/'\n")
    else:
        currentTabUrl = driver.current_url
        driver.close()
        totalBrowsersOpen = totalBrowsersOpen-1
        # find random open window
        for window_handle in driver.window_handles:
            driver.switch_to.window(window_handle)
            time.sleep(2)
            text = text + f"closeCurrentTab: {currentTabUrl}, redirect to {driver.current_url}\n"
            print(f"closeCurrentTab: {currentTabUrl}, redirect to {driver.current_url}\n")
            break
        

def fillInput(text):
    inputBox = driver.find_element(By.TAG_NAME, 'input')
    inputBox.send_keys('s')
    text = text + f"fillInput in: {driver.current_url}\n"
    print(f"fillInput in: {driver.current_url}\n")

def scroll(text):
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    text = text + f"scroll in: {driver.current_url}\n"
    print(f"scroll in: {driver.current_url}\n")

def refresh(text):
    driver.refresh()
    text = text + f"refresh in: {driver.current_url}"
    print(f"refresh in: {driver.current_url}")

def backTab(text):
    currentTabUrl = driver.current_url
    driver.back()
    time.sleep(2)
    text = text + f"backTab from: {currentTabUrl} to {driver.current_url}"
    print(f"backTab from: {currentTabUrl} to {driver.current_url}")

def searchBar(text):
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

    text = text + f"complete searchbar entry to {driver.current_url}"
    print(f"complete searchbar entry to {driver.current_url}")

"""
actions our little bosses can take:
    click on any button/ other links {a, button}
    enter the new tab
    close the new tab
    fill in information if there is an input tag
    scroll
    refresh
    click on back button

fail catches:
    check if 429 error 
    or if 404 error

Counter/tracker:
    Num of each action (store in dictionary)
    total number of actions taken
    Number of fails against successful actions/reroutes

    currentBrowser # and index
    currentTime


# to test later: check if all the button types can be pressed
"""
startTimer = time.time()
endTimer = startTimer + 60*60 # 1 hour
print(endTimer, startTimer)
driver.maximize_window()
driver.get("http://localhost:3000/")

# try:
# check for end time.
while currentTime < endTimer:
    # pause a little
    time.sleep(2)
    numOfCycles += 1

    try:
        #if else functions here

        #===========fail catches============#
        #check if 429 error 
        if driver.current_url == "http://localhost:3000/invalid-url":
            numOfFails += 1
            text = text + f"reached http://localhost:3000/invalid-url\n\n"
            print(f"reached http://localhost:3000/invalid-url\n")
            driver.get("http://localhost:3000/") # redirect to http://localhost:3000/

        #===========generate random catches============#
        # if search bar page
        if driver.current_url == "http://localhost:3000/":
            print("in here")
            searchBar(text)
        
        # #===========just scroll==============#
        # driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        #===========execute buttons===========#
        element = WebDriverWait(driver,100).until(EC.presence_of_element_located((By.ID, 'root')))
        print("executing getButtons")
        btnList = getButtons(text)
        btnListLen = 0
        print("successfully get buttons")

        # generate random number
        for btn in btnList:
            btnListLen += 1
        print(btnListLen)
        mode = random.randint(0,6+btnListLen)
        print("mode: ", mode)

        #====== other actions =======#
        if mode == 0:
            goToNewTab(text)
            enterNewTabActionCount+=1
        elif mode == 1:
            closeCurrentTab(text)
            closeNewTabActionCount+=1
        elif mode == 2:
            # detect input
            if EC.presence_of_element_located((By.TAG_NAME, 'input')):
                fillInput(text)
                inputTextActionCount+=1
            totalActionCount -= 1
        elif mode == 3:
            scroll(text)
            scrollActionCount+=1
        elif mode == 4:
            refresh(text)
            refreshBtnActionCount+=1
        elif mode == 5:
            backTab(text)
            backBtnActionCount+=1
        elif mode > 5:
            currentTabNumber = len(driver.window_handles) # check original number of tabs
            n = mode-6
            driver.execute_script("arguments[0].scrollIntoView();", btnList[n])
            time.sleep(2)
            action.move_to_element(btnList[n]).perform()
            btnList[n].click()
            buttonActionCount+=1

            if len(driver.window_handles) > currentTabNumber: # if number of tabs increased
                goToNewTab()
            text = text + f"button was pressed"
            print("button was pressed")
        

        # update maxBrowsersOpen
        if maxBrowsersOpen < totalBrowsersOpen:
            maxBrowsersOpen = totalBrowsersOpen
        # update currentTime
        currentTime = time.time()
        # update totalActionCount
        totalActionCount += 1

    except:
        numOfFails += 1
        print("failure due to passthrough is not supported")
        totalActionCount += 1
        time.sleep(5)
        driver.refresh()
        # driver.get("http://localhost:3000")

# except:
#     # catch all other fails
#     numOfFails += 1
#     print(f"uncaught exception\n")
#     text += f"uncaught exception\n"
#     driver.get("http://localhost:3000/") # redirect to http://localhost:3000/    text = text + f"caught by except\n\n"

#====== add info to doc ========#
text += "\n\n================\n\n"
text += "======Action Counts======\n"
text += "totalActionCount: " + str(totalActionCount) + "\n"
text += "buttonActionCount: " + str(buttonActionCount) + "\n"
text += "enterNewTabActionCount: " + str(enterNewTabActionCount) + "\n"
text += "closeNewTabActionCount: " + str(closeNewTabActionCount) + "\n"
text += "inputTextActionCount: " + str(inputTextActionCount) + "\n"
text += "scrollActionCount: " + str(scrollActionCount) + "\n"
text += "refreshBtnActionCount: " + str(refreshBtnActionCount) + "\n"
text += "backBtnActionCount: " + str(backBtnActionCount) + "\n"
text += "\n"
text += "======Max Counts======" + "\n"
text += "maxBrowsersOpen: " + str(maxBrowsersOpen) + "\n"
text += "numOfCaughtFails: " + str(numOfFails) + "\n"
text += "totalFails: " + str(numOfCycles-totalActionCount) + "\n"

#====== print text report ========#
f = open("./testing/logs/randomFuzzerLog.txt", "w")
f.write(text)
f.close()

driver.quit()