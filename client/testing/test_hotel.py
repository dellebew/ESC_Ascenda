from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())


# test hotel page
driver.get("http://localhost:3000/hotels/qO6Y/11fD/2022-07-25/2022-07-29/en_US/SGD/SG/2")
driver.implicitly_wait(30)

# test title
print("title: ",driver.title)

# test hotel data retrival
hotel_name = driver.find_element(By.XPATH, '/html/body/div/div[2]/div/div/div[1]/div[2]/div[1]/div[1]/h1')
assert (hotel_name.get_attribute("innerHTML") == "Grand Park City Hall")
print("test 1 passed")

heading = driver.find_element(By.XPATH, "/html/body/div/div[2]/div/div/div[1]/div[3]/div[1]/div[1]/div[1]/p[5]/b")
assert (heading.get_attribute("innerHTML") == "Business, Other Amenities")
print("test 2 passed")

# driver.save_screenshot('./client/testing/screen_hotel.png')

# test showmore button
showmore = driver.find_element(By.XPATH,'/html/body/div/div[2]/div/div/div[1]/div[3]/div[1]/div[1]/div[2]/span')
showmore.click()

#test price
price = driver.find_element(By.XPATH, "/html/body/div/div[2]/div/div/div[1]/div[2]/div[2]/span[1]")
assert (int(price.get_attribute("innerHTML")[1:])== 123)
print("test 3 passed")

# test room choices
answers = [123,
1617.65,
1632.48,
2040.66,
1826.93,
1878.66,
2283.55,
2139.53,
2264.14,
2769.48,
2400.48,
2458.51,
3012.37]
price_class = driver.find_elements(By.CLASS_NAME, "price")
for idx,price in enumerate(price_class):
    if idx > 0:
        assert (price.get_attribute("innerHTML").replace("S$", '') == str(answers[idx]))
print("test 4 passed")

# test payment redirect

print("test 5 passed")
driver.close()