from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())


# test hotel page
driver.get("http://localhost:3000/destinations/RsBu")
driver.implicitly_wait(30)

# test title
print("title: ",driver.title)

# test hotel data retrival
first_hotel_name = driver.find_element(By.XPATH, '/html/body/div/div[2]/div/div/div[2]/div[1]/div[1]/h1')
assert (first_hotel_name.get_attribute("innerHTML") == "OYO 432 My 7days Inn")

point = driver.find_element(By.XPATH, "/html/body/div/div[2]/div/div/div[2]/div[6]/div[2]/div[1]/button")
assert (point.get_attribute("innerHTML") == "2.0")

driver.save_screenshot('./client/testing/screen_desti_hotels1.png')

#test sorted order
answers = ["OYO 432 My 7days Inn",
"OYO 44027 Golden Horse Hotel",
"AMOY",
"Grand Park City Hall",
"V Hotel Bencoolen",
"OYO 90090 Roselyn Inn 2",
"The Clan Hotel, Singapore by Far East Hospitality",
"Fragrance Hotel - Waterfront",
"RedDoorz near Hang Nadim Batam Airport",
"Dream House Hotel"]

names = driver.find_elements(By.CLASS_NAME,"si--name")
for idx,name in enumerate(names):
    assert (name.get_attribute("innerHTML") == answers[idx])

# test show price button
show_price = driver.find_element(By.XPATH,'/html/body/div/div[2]/div/div/div[2]/div[5]/div[2]/div[2]/button')
show_price.click()
driver.implicitly_wait(30)
hotel_name = driver.find_elements(By.XPATH, '/html/body/div/div[2]/div/div/div[1]/div[2]/div[1]/div[1]/h1')
assert (hotel_name.get_attribute("innerHTML") == "V Hotel Bencoolen")
assert (driver.current_url.split('/')[-1] == "cETW")


driver.close()