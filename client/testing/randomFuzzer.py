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

def getButtons():
    allbuttons = []
    if EC.presence_of_element_located((By.TAG_NAME, "a")):
        a_button = driver.find_element(By.TAG_NAME, "a")
        allbuttons+=a_button
    if EC.presence_of_element_located((By.TAG_NAME, "button")):
        button_button = driver.find_elements(By.TAG_NAME, "button")
        allbuttons += button_button
    if EC.presence_of_element_located((By.CLASS_NAME, 'ratesCard')):
        ratesCards = driver.find_elements(By.CLASS_NAME, 'ratesCard')
        allbuttons += ratesCards
    if EC.presence_of_element_located((By.CLASS_NAME, "react-confirm-alert-button-group")):
        confirmation = driver.find_element(By.CLASS_NAME, "react-confirm-alert-button-group")
        yes = confirmation.find_elements(By.XPATH, "//button")
        allbuttons += yes
        # TODO: what about pop ups
    text = text + f"List of all {len(allbuttons)} buttons: {allbuttons}"
    print(f"List of all {len(allbuttons)} buttons: {allbuttons}")
    return allbuttons

def goToNewTab():
    currentURL = driver.current_url
    driver.current_window_handle
    chwnd = driver.window_handles[totalBrowsersOpen-1] # newest addition
    driver.switch_to.window(chwnd) # go to most recent tab
    text = text + f"goToNewTab: from {currentURL}, redirect to {driver.current_url}\n"
    print(f"goToNewTab: from {currentURL}, redirect to {driver.current_url}\n")

def closeCurrentTab():
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
        

def fillInput():
    inputBox = driver.find_element(By.TAG_NAME, 'input')
    inputBox.send_keys('s')
    text = text + f"fillInput in: {driver.current_url}\n"
    print(f"fillInput in: {driver.current_url}\n")
    
    #=== for search bar scenerio ====== #
    if EC.presence_of_element_located((By.CLASS_NAME, 'dropdown-row')):
        selector = driver.find_elements(By.CLASS_NAME, 'dropdown-row')
        n = random.randint(0,10)
        action.move_to_element(selector[n]).perform()
        selector[n].click()

def scroll():
    amt = random.randint(600, 3600)
    driver.execute_script(f"window.scrollTo(0,document.body.{amt})")
    text = text + f"scroll in: {driver.current_url}\n"
    print(f"scroll in: {driver.current_url}\n")

def refresh():
    driver.refresh()
    text = text + f"refresh in: {driver.current_url}"
    print(f"refresh in: {driver.current_url}")

def backTab():
    currentTabUrl = driver.current_url
    driver.back()
    time.sleep(2)
    text = text + f"backTab from: {currentTabUrl} to {driver.current_url}"
    print(f"backTab from: {currentTabUrl} to {driver.current_url}")

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
endTimer = startTimer + 60*60
print(endTimer, startTimer)
driver.maximize_window()
driver.get("http://localhost:3000/")

# try:
# check for end time.
while currentTime < endTimer:
    # pause a little
    time.sleep(2)
    #if else functions here

    #===========fail catches============#
    #check if 429 error 
    if driver.current_url == "http://localhost:3000/invalid-url":
        numOfFails += 1
        text = text + f"reached http://localhost:3000/invalid-url\n\n"
        print(f"reached http://localhost:3000/invalid-url\n")
        driver.get("http://localhost:3000/") # redirect to http://localhost:3000/

    #===========generate random catches============#
    
    #===========execute buttons===========#
    btnList = getButtons()

    # generate random number
    mode = random.randint(0,6+len(btnList))
    print("mode: ", mode)

    #====== other actions =======#
    if mode == 0:
        goToNewTab()
        enterNewTabActionCount+=1
    elif mode == 1:
        closeCurrentTab()
        closeNewTabActionCount+=1
    elif mode == 2:
        # detect input
        if EC.presence_of_element_located((By.TAG_NAME, 'input')):
            fillInput()
            inputTextActionCount+=1
        totalActionCount -= 1
    elif mode == 3:
        scroll()
        scrollActionCount+=1
    elif mode == 4:
        refresh()
        refreshBtnActionCount+=1
    elif mode == 5:
        backTab()
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
    

    # update maxBrowsersOpen
    if maxBrowsersOpen < totalBrowsersOpen:
        maxBrowsersOpen = totalBrowsersOpen
    # update currentTime
    currentTime = time.time()
    # update totalActionCount
    totalActionCount += 1

# except:
#     # catch all other fails
#     numOfFails += 1
#     print(f"uncaught exception\n")
#     text += f"uncaught exception\n"
#     driver.get("http://localhost:3000/") # redirect to http://localhost:3000/    text = text + f"caught by except\n\n"
    
#====== print text report ========#
f = open("./logs/randomFuzzerLog.txt", "w")
f.write(text)
f.close()

driver.quit()