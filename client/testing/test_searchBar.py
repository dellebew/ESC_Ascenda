from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time

driver = webdriver.Chrome(ChromeDriverManager().install())


# test hotel page
driver.get("http://localhost:3000/")
driver.implicitly_wait(10)
wait = WebDriverWait(driver, 10)

# test title
print("title: ",driver.title)

# test autofill
input_box = driver.find_element(By.XPATH, '/html/body/div/div/div[2]/div/div/div/div/div/div[1]/input')
input_box.clear()
input_box.send_keys('Ja')
# auto_complete = driver.find_element(By.XPATH, "")
# auto_complete[0].click()
# assert True

# test date select
searchText = driver.find_element(By.XPATH,"/html/body/div/div/div[2]/div/div/div/div/div/div[2]/div[1]/span")
searchText.click()
driver.implicitly_wait(10)
month_back = driver.find_element(By.XPATH,"/html/body/div/div/div[2]/div/div/div/div/div/div[2]/div[1]/div/div[2]/button[1]/i")
month_back.click()
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

june5 = wait.until(EC.element_to_be_clickable((By.XPATH,"/html/body/div/div/div[2]/div/div/div/div/div/div[2]/div[1]/div/div[3]/div/div[2]/button[8]")))
june5.click()
month_after = driver.find_element(By.XPATH,"/html/body/div/div/div[2]/div/div/div/div/div/div[2]/div[1]/div/div[2]/button[2]/i")
month_after.click()
july25 = wait.until(EC.element_to_be_clickable((By.XPATH,"/html/body/div/div/div[2]/div/div/div/div/div/div[2]/div[1]/div/div[3]/div/div[2]/button[30]")))
july25.click()
driver.implicitly_wait(10)
searchText.click()
assert (searchText.get_attribute("innerHTML") == "06/05/2022 to 07/25/2022")
print("test 1 passed")

# test date key in
searchText.click()
driver.implicitly_wait(10)
start = driver.find_element(By.XPATH,"/html/body/div/div/div[2]/div/div/div/div/div/div[2]/div[1]/div/div[1]/div/span[1]/input")
end = driver.find_element(By.XPATH,"/html/body/div/div/div[2]/div/div/div/div/div/div[2]/div[1]/div/div[1]/div/span[2]/input")
start.send_keys(Keys.CONTROL + "a")
start.send_keys(Keys.DELETE)
driver.implicitly_wait(10)
start.send_keys('Jun 4, 2022')
start.send_keys(Keys.RETURN)
end.send_keys(Keys.CONTROL + "a")
end.send_keys(Keys.DELETE)
driver.implicitly_wait(10)
end.send_keys("Jun 19, 2022")
end.send_keys(Keys.RETURN)
searchText.click()
driver.implicitly_wait(10)
assert (searchText.get_attribute("innerHTML") == "06/04/2022 to 06/19/2022")
print("test 2 passed")

# test adult/child/room select
acr_input = driver.find_element(By.XPATH,"/html/body/div/div/div[2]/div/div/div/div/div/div[2]/div[2]/span")
driver.implicitly_wait(10)
acr_input.click()

# test disabled button
room_minus = driver.find_element(By.XPATH,"/html/body/div/div/div[2]/div/div/div/div/div/div[2]/div[2]/div/div[3]/div/button[1]")
assert (room_minus.get_property('disabled'))
print("test 3 passed")

# test add buttons
for i in range(1,4):
    xpath = "/html/body/div/div/div[2]/div/div/div/div/div/div[2]/div[2]/div/div["+str(i)+"]/div/button[2]"
    add_button = driver.find_element(By.XPATH,xpath)
    driver.implicitly_wait(10)
    add_button.click()
assert (acr_input.get_attribute("innerHTML") == "3 adults 1 children 2 room")
print("test 4 passed")

driver.close()