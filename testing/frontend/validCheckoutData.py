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

# ==== imports for mongoDB
from pymongo import MongoClient 
import pprint # makes it easier to print and retrieve

# ==== instantiation for selenium
options = webdriver.ChromeOptions()
options.add_argument('--enable-javascript')
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.maximize_window()

# ==== instantiation for mongoDB
uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri) 
dbName = "ascenda-hotel-booking"
fin_coll_name = "successful_payments"
mid_coll_name = "incomplete_payments"

dbo = client[dbName]
collec = dbo[fin_coll_name]
mid_collec = dbo[mid_coll_name]

text = ""

def validCheckoutData(hotelLink, count, text):
    stripe_payment_url = ""
    try:
        # hotelLink = "http://localhost:3000/hotels/lXJq/WD0M/2022-08-03/2022-08-04/en_US/SGD/SG/2/0/1"
        action = ActionChains(driver)
        
        #========== entering from hotel page =======#
        driver.get(hotelLink)
        time.sleep(5)
        
        while not EC.presence_of_element_located((By.ID, 'root')):
            print("still here")
        
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        print("scrolled")
        time.sleep(0.5)
        
        element = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'ratesCard'))
        )
        ratesCards = driver.find_elements(By.CLASS_NAME, 'ratesCard')

        firstRate = ratesCards[0]

        driver.execute_script("return arguments[0].scrollIntoView();", firstRate)
        print("scrolled")

        action = ActionChains(driver)
        time.sleep(1)
        action.move_to_element(firstRate).perform()
        button = firstRate.find_element(By.CLASS_NAME, "rates--container")
        button.click()
        time.sleep(1)

        # test confirmation
        confirmation = driver.find_element(By.CLASS_NAME, "react-confirm-alert-button-group")
        yes = confirmation.find_element(By.XPATH, "//button[@label='Yes']")
        driver.execute_script("arguments[0].click();", yes)
        time.sleep(0.5)

        assert(driver.current_url == "http://localhost:3000/checkout")

        print(f"Link {count}: Test 0 Passed, valid checkout page: " + driver.current_url)
        text += f"Link {count}: Test 0 Passed, valid checkout page: " + driver.current_url + "\n"
        # ====== leave hotel page ====== #
        

        # ===================================
        # =========== tests begin ===========
        # ===================================

        # get price and name attribute from checkout page
        displayed_info = driver.find_elements(By.TAG_NAME, "span")
        price = displayed_info[5].text[2:]
        name = displayed_info[6].text
        # price = "72.36"
        # name = "Hotel 81 Lucky"

        # set text
        textBox = driver.find_element(By.TAG_NAME, "textarea")
        textBox.send_keys("hello tucker")

        # check that it reroutes correctly to backend
        redirect = driver.find_element(By.TAG_NAME, "button")
        redirect.click()
        time.sleep(2)
        assert("/".join(driver.current_url.split('/')[2:-1]) == "checkout.stripe.com/pay")
        # assert(driver.current_url == "http://localhost:8080/stripe/create-checkout-session/")
        print(f"Link {count}: Test 1 Passed, confirmation page is clickable and redirectable to", driver.current_url)
        text += f"Link {count}: Test 1 Passed, confirmation page is clickable and redirectable to"+ driver.current_url + "\n"
        
        # get stripe payment url
        stripe_payment_url = driver.current_url

        # =============== Check information in intermediate database
        # use hotel name to find
        paymentDetails = driver.find_elements(By.TAG_NAME, "span")
        hotelName = paymentDetails[3].text
        corresponding_data = mid_collec.find({"info.hotelName": hotelName})
        assert(len(list(corresponding_data)) >= 1)
        print("here")
        # assert(len(list(corresponding_data)) >= 1)
        print(f"Link {count}: Test 2 Passed, data found in mid_collec")
        text += f"Link {count}: Test 2 Passed, data found in mid_collec" + "\n"
        # ================

        # Check price and name attributes
        payment_price_display = "".join(paymentDetails[4].text.split(' ')[1].split(","))
        print(price, name, payment_price_display)
        assert (payment_price_display == price)
        print(f"Link {count}: Test 3 Passed, price value is equivalent")
        assert(paymentDetails[3].text.upper() == name)
        print(f"Link {count}: Test 3 Passed, hotelName value is equivalent")
        text += f"Link {count}: Test 3 Passed, price value is equivalent, Test 3 Passed, hotelName value is equivalent" + "\n"

        # Check cancel page successful
        cancel_button = driver.find_element(By.TAG_NAME, "a")
        print("/".join(driver.current_url.split('/')[2:-1]))
        cancel_button.click()
        time.sleep(2) # wait to enter checkout/cancel
        assert("/".join(driver.current_url.split('/')[2:-1]) == "localhost:3000/checkout/canceled")
        print(f"Link {count}: Test 4 Passed, success page is clickable and redirectable to", driver.current_url)
        text += f"Link {count}: Test 4 Passed, success page is clickable and redirectable to"+ driver.current_url+ "\n"
        
        # check retrieval of hotelLink in cancel page
        # time.sleep(2)
        link = driver.find_elements(By.TAG_NAME, "a")
        link[-1].click()
        time.sleep(1)
        print(driver.current_url)
        print(hotelLink)
        assert(driver.current_url == hotelLink or driver.current_url == "http://localhost:3000/" )
        print(f"Link {count}: Test 5 Passed, cancel page link redirects to original room", driver.current_url)
        text += f"Link {count}: Test 5 Passed, cancel page link redirects to original room"+ driver.current_url + "\n"

        print(f"Number {count} passed the Intermediate Data test: {hotelLink}\n")
        text += f"Number {count} passed the Intermediate Data test: {hotelLink}\n\n"

    except Exception as e:
        print(e)
        print(f"Number {count} failed the Intermediate Data test: {hotelLink}\n")
        text += f"Number {count} failed the Intermediate Data test: {hotelLink}\n"
        driver.quit()

    
    return stripe_payment_url

# find a new set every time you test
hotelsListURL = [
    "http://localhost:3000/hotels/ii2q/WP3Z/2022-08-17/2022-08-19/en_US/SGD/ID/4/1/2",
    "http://localhost:3000/hotels/yQUM/WP3Z/2022-08-17/2022-08-19/en_US/SGD/ID/4/1/2",
    "http://localhost:3000/hotels/kvAG/ofhC/2022-08-13/2022-08-14/en_US/SGD/TH/6/0/3",
    "http://localhost:3000/hotels/VQfe/ofhC/2022-08-13/2022-08-14/en_US/SGD/TH/6/0/3",
    "http://localhost:3000/hotels/2qae/ofhC/2022-08-11/2022-08-12/en_US/SGD/TH/7/0/3",
    "http://localhost:3000/hotels/Z1FP/2mb5/2022-09-23/2022-09-24/en_US/SGD/US/2/0/1",
    "http://localhost:3000/hotels/NtlT/2mb5/2022-09-23/2022-09-24/en_US/SGD/US/2/0/1",
]

stripeListURL = []
for i, hotelURL in enumerate(hotelsListURL):
    print(i, hotelURL)
    stripeURL = validCheckoutData(hotelURL,i, text)
    stripeListURL.append(stripeURL)

print(stripeListURL)

driver.quit()

