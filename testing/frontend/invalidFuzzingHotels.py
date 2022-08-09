from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from fuzz_generator import fuzz_generator
import time


def fuzz_dest(url, location):
    options = webdriver.ChromeOptions()
    options.add_argument('--enable-javascript')
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    fileLocation = 'testing\\frontend\\logs\\{}.txt'.format(location)
    
    try:
        driver.get(url)
        # driver.maximize_window()
        time.sleep(1)

    except Exception as e:
        with open(fileLocation, 'a') as f:
            f.write("Failed Fuzzing Test: {} @ {}".format(url, time.ctime()))
            f.write('\n')
            f.close()
        print(e)

    finally:
        driver.quit()
    

''' SPECIFY PARAMETERS OF URL HERE '''
destinationCount = 10
# hotelID, destID, checkinDate, checkoutDate, lang, currency, code, adults, child, rooms
parameters = ["l2RN", "RsBU", "2022-08-19", "2022-08-20", "en_US", "SGD", "SG", "2", "1", "0"]
location = "fuzzing_hotels"


for i in range(destinationCount):
    fuzzedParameters = []
    for j in parameters:
        fuzzedParameters.append(fuzz_generator(j))
    fuzzedURL = '/'.join(fuzzedParameters)
    url = "http://localhost:3000/hotels/" + fuzzedURL
    print("Running test for {} ...".format(fuzzedURL))
    fuzz_dest(url, location)

