from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time, json, random


# checks for relevant elements in destinations page
def check_hotels(destId):
    options = webdriver.ChromeOptions()
    options.add_argument('--enable-javascript')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        # test valid destination page based on backend: http://localhost:8080/api/destination/prices/P4FZ/2022-08-24/2022-08-29/en_US/SGD/SG/2/0
        driver.get("http://localhost:3000/destinations/{}/2022-08-24/2022-08-25/en_US/SGD/SG/2/0/1/0".format(destId))
        # driver.maximize_window()
        time.sleep(12)
        
        results = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "list--result"))
        ) 
        destUrl = driver.current_url
        print("Test 0 Passed, valid destinations page: " + driver.current_url)
        # driver.save_screenshot('./client/testing/screenshots/destinations_{}.png'.format(destId))


        # check for show prices button
        pricesButton = driver.find_elements(By.CLASS_NAME, "si--showprices")
        totalButtons = len(pricesButton)
        print("Test 1 Passed, {} Search Buttons are displayed.".format(totalButtons))
        for button in pricesButton:
            assert(button.is_enabled())
        print("Test 2 Passed, {} Search Buttons are enabled.".format(totalButtons))

        # check that hotels redirects correctly
        action = ActionChains(driver)
        for i in range(totalButtons):
            pricesButton = driver.find_elements(By.CLASS_NAME, "si--showprices")
            button = pricesButton[i]
            driver.execute_script("arguments[0].scrollIntoView();", button)
            time.sleep(2)
            action.move_to_element(button).perform()
            button.click()
            time.sleep(10)
            print(driver.current_url[29:33])
            hotelName = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "hotelName"))
            )  
            print(hotelName.get_attribute("textContent"))
            driver.back();
            time.sleep(10)

        print("Test 6 Passed, redirects to valid hotel: ")

        # checks for all images
        driver.implicitly_wait(10)
        images = driver.find_elements(By.CLASS_NAME, "si--image")
        for image in images:
            assert(image.is_displayed)
        print("Test 7 Passed, {} Images are displayed.".format(len(images)))


        # check if next page is enabled
        nextPage = driver.find_element(By.CLASS_NAME, "next")
        if (nextPage.is_displayed()):
            if (nextPage.is_enabled()):
                button = nextPage.find_element(By.TAG_NAME, "a")
                time.sleep(3)
                driver.execute_script("arguments[0].scrollIntoView();", button)
                time.sleep(3)
                action.move_to_element(button).perform()
                driver.execute_script("arguments[0].click();", button)
                assert(driver.current_url == "http://localhost:3000/destinations/{}/2022-08-24/2022-08-25/en_US/SGD/SG/2/0/1/1".format(destId))
                print("Test 8 Passed, clicking on next button redirects to next page:", driver.current_url)
                time.sleep(3)
        
        with open('client\\testing\\fuzzing_hotels.txt', 'a') as f:
            f.write("Success: {}".format(destId))
            f.write('\n')
            f.close()

    except Exception as e:
        with open('client\\testing\\fuzzing_hotels.txt', 'a') as f:
            f.write("Failed: {}".format(destId))
            f.write('\n')
            f.close()
        print(e)

    finally:
        driver.quit()


# open list of destination uids
with open('client\\src\\database\\uids.json') as f:
    data = json.load(f)

# run fuzzing for destinations based on random int
for i in range(3):
    randomIndex = random.randint(0, len(data) -1)
    destId = data[randomIndex]['uid']
    print("Running test for: {}...".format(destId))
    check_hotels(destId)
    time.sleep(5)
