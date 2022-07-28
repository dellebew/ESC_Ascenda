from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import sys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException,StaleElementReferenceException
import time
import math

driver = webdriver.Chrome(ChromeDriverManager().install())


# test hotel page
driver.get("http://localhost:3000/destinations/P4FZ/2022-07-24/2022-07-29/en_US/SGD/SG/2/0/1/0")
# ignored_exceptions=(NoSuchElementException,StaleElementReferenceException)
wait = WebDriverWait(driver, 20, 0.5 )
driver.implicitly_wait(30)

# test title
print("title: ",driver.title)

# test hotel data retrival
time.sleep(4) # must sleep instead of implicit wait dk why
first_hotel_name = wait.until(EC.presence_of_element_located((By.XPATH, '/html/body/div/div[2]/div/div/div[2]/div[1]/div[1]/h1')))
print (first_hotel_name.get_attribute("innerHTML"))
print("test 1 passed")

point = driver.find_element(By.XPATH, "/html/body/div/div[2]/div/div/div[2]/div[1]/div[2]/div[1]/button")
print (point.get_attribute("innerHTML"))
print("test 2 passed")

# driver.save_screenshot('./client/testing/screen_desti_hotels1.png')

#test sorted order
answers = ["Diamond - Postbox Apartment 2",
"Jurys Inn Birmingham",
"Staycity Aparthotels Newhall Square",
"Apollo Hotel",
"Stratford Manor",
"Hallmark Hotel Birmingham Strathallan",
"Chesford Grange",
"Hallmark Hotel The Welcombe Stratford upon Avon",
"ibis Styles London Southwark Rose",
"Ibis London Docklands"]

names = driver.find_elements(By.CLASS_NAME,"si--name")
for idx,name in enumerate(names):
    print (name.get_attribute("innerHTML") )
print("test 3 passed")

# test show price button
base_xpath = '/html/body/div/div[2]/div/div/div[2]/div[2]/'
hotel_name = driver.find_element(By.XPATH,base_xpath+"div[1]/h1").get_attribute("innerHTML")
lowest_price = math.ceil(float(driver.find_element(By.XPATH,base_xpath+"div[2]/div[2]/span[2]").text[2:]))

show_price = driver.find_element(By.XPATH,base_xpath+'div[2]/div[2]/button')
show_price.click()

# redirect
print("redirect to: ", driver.current_url)
time.sleep(3)
redirected_hotel_name_ele = driver.find_elements(By.XPATH, '/html/body/div/div[2]/div/div/div[1]/div[2]/div[1]/div[1]/h1')
redirected_hotel_name = redirected_hotel_name_ele[0].get_attribute("innerHTML")
# calc lowest price
price_class = driver.find_elements(By.CLASS_NAME, "price")
redirected_lowest_price =sys.maxsize
for idx,price in enumerate(price_class):
    if idx > 0:
        p = float(price.get_attribute("innerHTML").replace('S$', ''))
        if p < redirected_lowest_price:
            redirected_lowest_price = math.ceil(p)
print(redirected_hotel_name == hotel_name)
print(lowest_price, redirected_lowest_price)

print("test 4 passed")

driver.close()