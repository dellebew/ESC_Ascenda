from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import json



driver = webdriver.Chrome(ChromeDriverManager().install())

# -------------- test 1 ---------------------#
# test hotel page
driver.get("http://localhost:8080/api/hotel/diH7")
driver.implicitly_wait(30)

# get answer data
with open('../../api/testing/diH7.json', 'r',encoding="utf-8") as f:
  data = json.load(f)

# test hotel data retrival
body_text = driver.find_element(By.XPATH, "/html/body/pre")
rooms_web = json.loads(body_text.get_attribute("innerHTML"))
if "_id" in rooms_web.keys():
  del rooms_web["_id"]
del rooms_web["description"]

for k in data:
    if data[k] != rooms_web[k]:
        print(data[k],"\n", rooms_web[k])
assert (data == rooms_web)
print("test 1 passed")


# -------------- test 2 ---------------------#

# test destination hotels page
driver.get("http://localhost:8080/api/destination/hotels/4FBY/0")
driver.implicitly_wait(30)

# get answer data
with open('../../api/testing/4FBY_0.json', 'r',encoding="utf-8") as f:
  data = json.load(f)

# test hotel data retrival
body_text = driver.find_element(By.XPATH, "/html/body/pre")
rooms_web = json.loads(body_text.get_attribute("innerHTML"))

for idx,hotel in  enumerate(data):
  for k in hotel:
    if k != "_id" and k != "description":
      if type(rooms_web[idx][k]) == str and "amp;" in rooms_web[idx][k]:
        rooms_web[idx][k] = rooms_web[idx][k].replace("amp;",'')
      assert hotel[k] == rooms_web[idx][k]

print("test 2 passed")

# -------------- test 3 ---------------------#

# test hotel price page
driver.get("http://localhost:8080/api/hotel/price/diH7/WD0M/2022-08-25/2022-08-29/en_US/SGD/SG/2")
driver.implicitly_wait(30)

# get answer data
with open('../../api/testing/hotel_price.json', 'r',encoding="utf-8") as f:
  data = json.load(f)[0]["rooms"]

# test hotel data retrival
body_text = driver.find_element(By.XPATH, "/html/body/pre")
rooms_web = json.loads(body_text.get_attribute("innerHTML"))[0]["rooms"]

for i in range(len(data)):
    assert data[i]["key"] == rooms_web[i]["key"]

print("test 3 passed")

# -------------- test 4 ---------------------#

# test destination hotels prices page
driver.get("http://localhost:8080/api/destination/prices/WD0M/2022-08-27/2022-08-31/en_US/SGD/SG/2/0")
driver.implicitly_wait(30)

# test hotel data retrival
body_text = driver.find_element(By.XPATH, "/html/body/pre")
hotel_web = json.loads(body_text.get_attribute("innerHTML"))[1]

pre_rank = hotel_web[0]["searchRank"]
for idx,hotel in enumerate(hotel_web):
  if hotel["searchRank"] <= pre_rank:
    pre_rank = hotel["searchRank"]
  else:
    print(hotel["searchRank"])

print("test 4 passed")

driver.close()