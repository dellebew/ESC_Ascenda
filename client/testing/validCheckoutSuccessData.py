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

# ==== instantiation for mongoDB
uri =  "mongodb+srv://ringdong2022:Abcdef2022@cluster0.8cytz.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri) 
dbName = "ascenda-hotel-booking"
fin_coll_name = "successful_payments"
mid_coll_name = "incomplete_payments"

dbo = client[dbName]
collec = dbo[fin_coll_name]
mid_collec = dbo[mid_coll_name]

def validCheckoutSuccessData(stripeURL, count):
    try:
        # Check success page
        # stripeURL = "https://checkout.stripe.com/pay/cs_test_a13xqzn7HkVPzd8cGuK5cn1PaRriR2KFowOe3ulgM8uABUvMhsTJLCD6jG#fidkdWxOYHwnPyd1blpxYHZxWjA0ST1jUHdCbH1kZm03QnE1ZlRHQl92bjVMXDFhUXVGdDJNaXdXZGNAbUhCaFByaGpERnNQTlJHPDNgd2xEQ2JDaEtqUH1DbGFrczRNQUwzQUFVbFNEVXNPNTVtM2xKQ3NNNicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl"

        # route from stripeURL
        driver.get(stripeURL)
        driver.maximize_window()
        time.sleep(3)

        # ======= retrieve details from stripe page
        paymentDetails = driver.find_elements(By.TAG_NAME, "span")
        hotelName = paymentDetails[3].text
        payment_price_display = paymentDetails[4].text.split(' ')[1]
        startDate = paymentDetails[6].text.split(":")[2].split(" ")[1]
        endDate = paymentDetails[6].text.split(":")[3].split(" ")[1]
        print("dates", startDate, endDate)
        roomType = " ".join(paymentDetails[6].text.split(":")[6].split(" ")[:-3])
        print("roomType: ",roomType)

        details = {
            "price": "S$"+ str(payment_price_display),
            "hotelName": hotelName,
            "startDate": startDate,
            "endDate": endDate,
            "roomType": roomType
        }
        print("details: ", details)
        
        # ==============================================
        # ============= fill in success page successfully
        # ==============================================
        success_button = driver.find_elements(By.TAG_NAME, "input")

        email = success_button[0]
        email.send_keys("testingPersona@gmail.com")
        details["email"] = "testingPersona@gmail.com"
        phone_num = success_button[1]
        phone_num.send_keys("8111 8111")
        card_num = success_button[2]
        card_num.send_keys("4242424242424242")
        date = success_button[3]
        date.send_keys("1123")
        time.sleep(1)
        cvc = success_button[4]
        cvc.send_keys("123")
        name = driver.find_element(By.ID, "billingName")
        # name = success_button[5]
        name.send_keys("testing Persona")
        details["name"] = "testing Persona"

        intermediate_btn = driver.find_element(By.XPATH, "//button[normalize-space()='Enter address manually']")
        intermediate_btn.click()
        time.sleep(2)
        # fill in address
        
        billingL2 = driver.find_elements(By.XPATH, "//input[@name='billingPostalCode']")
        billingL2[0].send_keys('487372')
        billingL1 = driver.find_elements(By.XPATH, "//input[@name='billingAddressLine1']")
        billingL1[0].send_keys('8 somapah road')

        # success_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        success_button = driver.find_elements(By.XPATH, "//button[@type='submit']")
        print("before button was clicked")
        print(len(success_button))

        success_button[0].click()
        print("button was clicked")
        time.sleep(2)
        print("Test 0 Passed, success page is clickable and redirectable to", driver.current_url)

        successURL = driver.current_url
        time.sleep(5)
        # =====================
        # ====== in success page
        # ======================

        # # ===== to hash out
        # driver.get("http://localhost:3000/checkout/success/cs_test_a13fI9HbYTzCXgwG7AFrCVdnicsfCangMCYFMNf7eGO2nD6op2vs1DWLqQ#fidkdWxOYHwnPyd1blpxYHZxWjA0ST1jUHdCbH1kZm03QnE1ZlRHQl92bjVMXDFhUXVGdDJNaXdXZGNAbUhCaFByaGpERnNQTlJHPDNgd2xEQ2JDaEtqUH1DbGFrczRNQUwzQUFVbFNEVXNPNTVtM2xKQ3NNNicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl")
        # # ===== to hash out

        waiter = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.TAG_NAME, "span"))
        )

        displayed_elements = driver.find_elements(By.TAG_NAME, "span")

        print("problem with assert")
        # ========= Added when filling in information
        assert(displayed_elements[0].text == details["name"])
        print("problem with name assert")
        assert(displayed_elements[1].text == details["email"])
        # ========= Added when filling in information
        print("no problem with assert")

        assert(displayed_elements[2].text == details["startDate"])
        assert(displayed_elements[3].text == details["endDate"])
        assert(displayed_elements[7].text == details["price"])
        assert(displayed_elements[8].text == details["hotelName"].upper())
        assert(displayed_elements[10].text == details["roomType"].upper())
        print("Test 1 Passed, all information is displayed")

        # ======= check that booking is in successful collection
        # use hotel name to find
        paymentDetails = driver.find_elements(By.TAG_NAME, "span")
        
        corresponding_data = collec.find({"state.hotelName": details["hotelName"], "state.roomType": details["roomType"]})
        # ===== cursor type requires for each loop
        corresponding_data_set = []
        for data in corresponding_data:
            corresponding_data_set.append(data)
        assert(len(corresponding_data_set) > 0)
        print("Test 2 Passed, data found in successful collection")

        # ======== check that booking is no longer in unsuccessful collection
        paymentDetails = driver.find_elements(By.TAG_NAME, "span")
        hotelName = paymentDetails[8].text
        
        corresponding_data = mid_collec.find({"state": {"hotelName": details["hotelName"]}})
        assert(len(list(corresponding_data)) == 0)
        print("Test 3 Passed, data deleted from intermediate collection")

        print(f"Number {count} passed the Success test: {stripeURL}\n")

        return successURL
        
    except:
        print(f"Number {count} failed the Success test: {stripeURL}\n")
        driver.quit()

        return "failed"

# hotelsListURL = [
#     "http://localhost:3000/hotels/RC8n/WP3Z/2022-08-04/2022-08-05/en_US/SGD/ID/2/0/1",
#     "http://localhost:3000/hotels/uSyP/YCcf/2022-08-03/2022-08-04/en_US/SGD/CN/2/0/1",
#     "http://localhost:3000/hotels/AHVJ/YCcf/2022-08-03/2022-08-04/en_US/SGD/CN/2/0/1",
#     "http://localhost:3000/hotels/yyZq/YCcf/2022-08-03/2022-08-04/en_US/SGD/CN/2/0/1",
#     "http://localhost:3000/hotels/ndER/YCcf/2022-08-03/2022-08-04/en_US/SGD/CN/2/0/1",
# ]

stripeListURL = [
# get URLs from valid Checkout Data
# 'https://checkout.stripe.com/pay/cs_test_a1Vc7UGUJcUuknqDyvQRka2uwarXoa7Il6wvTOwKyU5XgIlbXtgWndYTAQ#fidkdWxOYHwnPyd1blpxYHZxWjA0ST1jUHdCbH1kZm03QnE1ZlRHQl92bjVMXDFhUXVGdDJNaXdXZGNAbUhCaFByaGpERnNQTlJHPDNgd2xEQ2JDaEtqUH1DbGFrczRNQUwzQUFVbFNEVXNPNTVtM2xKQ3NNNicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', 
# 'https://checkout.stripe.com/pay/cs_test_a1PMSErJouweVcIisfZLmKI4je9Hlv8qXwzrFnkebfkL1vUPmM4h5d86b2#fidkdWxOYHwnPyd1blpxYHZxWjA0ST1jUHdCbH1kZm03QnE1ZlRHQl92bjVMXDFhUXVGdDJNaXdXZGNAbUhCaFByaGpERnNQTlJHPDNgd2xEQ2JDaEtqUH1DbGFrczRNQUwzQUFVbFNEVXNPNTVtM2xKQ3NNNicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', 
# 'https://checkout.stripe.com/pay/cs_test_a1qlnbiJ96edbwwQGqKEMXUT3JNklHGJkYT4A0xDOKL9mMJtXLAfjUdPDp#fidkdWxOYHwnPyd1blpxYHZxWjA0ST1jUHdCbH1kZm03QnE1ZlRHQl92bjVMXDFhUXVGdDJNaXdXZGNAbUhCaFByaGpERnNQTlJHPDNgd2xEQ2JDaEtqUH1DbGFrczRNQUwzQUFVbFNEVXNPNTVtM2xKQ3NNNicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', 
# 'https://checkout.stripe.com/pay/cs_test_a1uiRRS3b2xBI6Sp7yagSvCUFBgpKfERG5FQ7IuD0IZfo04cjuZk4SWxHH#fidkdWxOYHwnPyd1blpxYHZxWjA0ST1jUHdCbH1kZm03QnE1ZlRHQl92bjVMXDFhUXVGdDJNaXdXZGNAbUhCaFByaGpERnNQTlJHPDNgd2xEQ2JDaEtqUH1DbGFrczRNQUwzQUFVbFNEVXNPNTVtM2xKQ3NNNicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl', 
# 'https://checkout.stripe.com/pay/cs_test_a1cwsVTyTsfCUExGWiA6lkIizHy8LxCqbMxJVhDqB0q3l189Sg1XYpX9ib#fidkdWxOYHwnPyd1blpxYHZxWjA0ST1jUHdCbH1kZm03QnE1ZlRHQl92bjVMXDFhUXVGdDJNaXdXZGNAbUhCaFByaGpERnNQTlJHPDNgd2xEQ2JDaEtqUH1DbGFrczRNQUwzQUFVbFNEVXNPNTVtM2xKQ3NNNicpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl'
]

successListURL = []
for i, stripeURL in enumerate(stripeListURL):
    successURL = validCheckoutSuccessData(stripeURL, i)
    successListURL.append(successURL)

print(successListURL)