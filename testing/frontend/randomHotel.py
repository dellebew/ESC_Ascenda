from msilib.schema import Error
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from check_hotel import check_hotel
import time, json, random


# custom exception classes
class Server429Error(Exception):
    pass

class Server404Error(Exception):
    pass


# catch function for no avaliable hotels
def no_hotels_avaliable(driver):
    try:
        driver.find_element(By.CLASS_NAME, "server_404")
        return True
    except:
        return False

# catch function for server 429 loading error
def loading_error(driver):
    try:
        driver.find_element(By.CLASS_NAME, "server_429")
        return True
    except:
        return False
            

# checks for relevant elements in destinations page
def random_dest(destId, startDate, endDate):
    options = webdriver.ChromeOptions()
    options.add_argument('--enable-javascript')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    
    try:
        # test valid destination page based on backend: http://localhost:8080/api/destination/prices/P4FZ/2022-08-24/2022-08-29/en_US/SGD/SG/2/0
        driver.get("http://localhost:3000/destinations/{}/{}/{}/en_US/SGD/SG/2/0/1/0".format(destId, startDate, endDate))
        # driver.maximize_window()
        time.sleep(7)
        driver.save_screenshot('./testing/frontend/screenshots/destinations_{}.png'.format(destId))

        if (no_hotels_avaliable(driver)):
            raise Server404Error("No Hotels Avaliable")

        if(loading_error(driver)):
            raise Server429Error("429 Loading Error")

        action = ActionChains(driver)
        print("Test 0 Passed, valid destinations page: " + driver.current_url)

        # check for show prices button
        pricesButton = driver.find_elements(By.CLASS_NAME, "si--showprices")
        totalButtons = len(pricesButton)


        with open('testing\\frontend\\logs\\fuzzing_hotels.txt', 'a') as f:
                f.write("For destination: {} @ {}".format(destId, time.ctime()))
                f.write('\n')
                f.close()
        
        
        # check valid hotels
        for i in range(totalButtons):
            pricesButton = driver.find_elements(By.CLASS_NAME, "si--showprices")
            check_hotel(driver, action, pricesButton[i], "fuzzing_hotels")
        
        
    except Server404Error as e:
        with open('testing\\frontend\\logs\\fuzzing_hotels.txt', 'a') as f:
                f.write("Destination 404 Loading Error: {} @ {}".format(destId, time.ctime()))
                f.write('\n')
                f.close()
        print(e)
    
    except Server429Error as e:
        with open('testing\\frontend\\logs\\fuzzing_hotels.txt', 'a') as f:
                f.write("Destination 429 Loading Error: {} @ {}".format(destId, time.ctime()))
                f.write('\n')
                f.close()
        print(e)

    except Exception as e:
        with open('testing\\frontend\\logs\\fuzzing_hotels.txt', 'a') as f:
                f.write("Destination Timeout Loading Error: {} @ {}".format(destId, time.ctime()))
                f.write('\n')
                f.close()

    finally:
        driver.quit()



# open list of destination uids
with open('client\\src\\database\\uids.json') as f:
    data = json.load(f)

# run logs\\fuzzing for destinations based on random int
destinationCount=10

for i in range(destinationCount):
    randomIndex = random.randint(0, len(data) -1)
    destId = data[randomIndex]['uid']
    print("Running test for {} ...".format(destId))
    random_dest(destId, startDate="2022-08-12", endDate="2022-08-13")
    time.sleep(5)