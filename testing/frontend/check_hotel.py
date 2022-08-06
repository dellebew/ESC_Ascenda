from selenium.webdriver.common.by import By
import time
import json
import random


# checks for relevant elements in hotel page
def check_hotel(driver, action, button, location):
    fileLocation = 'testing\\frontend\\logs\\{}.txt'.format(location)

    # catch function for no avaliable hotels
    def no_hotels_avaliable(driver):
        try:
            driver.find_element(By.CLASS_NAME, "server_404")
            return True
        except:
            return False

    # catch function for server loading error
    def loading_error(driver):
        try:
            driver.find_element(By.CLASS_NAME, "server_429")
            return True
        except:
            return False

    try:
        driver.execute_script("arguments[0].scrollIntoView();", button)
        time.sleep(2)
        action.move_to_element(button).perform()
        button.click()

        # change driver windows to new tab
        p = driver.current_window_handle
        parent = driver.window_handles[0]
        child = driver.window_handles[1]
        driver.switch_to.window(child)
        time.sleep(10)

        # obtain hotel Id
        hotelId = driver.current_url[29:33]
        driver.save_screenshot('./testing/frontend/screenshots/hotels_{}.png'.format(hotelId))

        if(loading_error(driver)):
            raise UnboundLocalError("404 Error")

        print("Test 0 Passed, valid hotels page: " + driver.current_url)

        # check for valid hotel name
        hotelName = driver.find_element(By.ID, "hotelName")
        assert(hotelName.is_displayed())
        print("Test 1 Passed, hotel name exists:",
              hotelName.get_attribute("textContent"))

        # check valid hotel static elements
        hotelAddress = driver.find_element(By.ID, "hotelAddress")
        assert(hotelAddress.is_displayed())
        print("Test 2 Passed, address exists:",
              hotelAddress.get_attribute("textContent"))

        hotelRatings = driver.find_element(By.CLASS_NAME, "react-stars")
        assert(hotelRatings.is_displayed())
        print("Test 3 Passed, rating exists")

        hotelDesc = driver.find_element(By.CLASS_NAME, "desc")
        assert(hotelDesc.is_displayed())
        print("Test 4 Passed, description container exists")

        hotelMap = driver.find_element(By.CLASS_NAME, "pigeon-tiles-box")
        assert(hotelMap.is_displayed())
        hotelLocation = driver.find_element(By.CLASS_NAME, "location")
        assert(hotelLocation.is_displayed())
        print("Test 5 Passed, map exists:",
              hotelLocation.get_attribute("textContent"))

        hotelAmenities = driver.find_element(By.CLASS_NAME, "hotel--amenities")
        assert(hotelAmenities.is_displayed())
        print("Test 6 Passed, amenities container exist: {}".format(
            hotelAmenities.get_attribute("textContent")))

        hotelRatings = driver.find_element(By.CLASS_NAME, "hotel--ratings")
        assert(hotelRatings.is_displayed())
        print("Test 7 Passed, ratings container exist: {}".format(
            hotelRatings.get_attribute("textContent")))

        # check that main image exists
        hotelImages = driver.find_element(By.CLASS_NAME, "hotel--images")
        assert(hotelImages.is_displayed())
        print("Test 8 Passed, images exist")

        # check that show more buttons work
        showDesc = driver.find_element(By.CLASS_NAME, "show--more")
        originalHeight = hotelDesc.get_attribute("clientHeight")

        driver.execute_script("window.scrollTo(0, 600);")
        time.sleep(2)
        driver.execute_script("arguments[0].click();", showDesc)
        time.sleep(3)

        currentHeight = hotelDesc.get_attribute("clientHeight")
        assert(currentHeight >= originalHeight)
        print("Test 9 Passed, show more description increases box length from {} to {}".format(
            originalHeight, currentHeight))
        driver.execute_script("arguments[0].click();", showDesc)

        # check for room card elements
        roomCards = driver.find_elements(By.CLASS_NAME, "roomCard")
        rooms = []
        for i, roomCard in enumerate(roomCards):
            assert(roomCard.is_displayed())

            # check for room type
            roomType = roomCard.find_element(By.CLASS_NAME, "room--normalized")
            assert(len(roomType.get_attribute("textContent")) > 0)
            rooms.append(roomType.get_attribute("textContent"))

            # check for room image
            roomImages = roomCard.find_element(By.CLASS_NAME, "room--images")
            assert(roomImages.is_displayed())

            # check for amenities
            amenitiesList = roomCard.find_element(
                By.CLASS_NAME, "room--amenities")
            assert(roomImages.is_displayed())

            # check for rates card elements
            ratesCards = roomCard.find_elements(By.CLASS_NAME, "ratesCard")
            for i, rateCard in enumerate(ratesCards):
                assert(rateCard.is_displayed() & rateCard.is_enabled())

                # check for prices
                price = rateCard.find_element(By.CLASS_NAME, "price")
                assert(price.is_displayed())

        print("Test 10 Passed, all rates card have room type: {}".format(rooms))
        print("Test 11 Passed, all room types have images, amenities and rates cards")

        with open(fileLocation, 'a') as f:
            f.write("Success Hotel: {} @ {}".format(hotelId, time.ctime()))
            f.write('\n')
            f.close()

    except UnboundLocalError as e:
        with open(fileLocation, 'a') as f:
            f.write("Hotel 429 Loading Error: {} @ {}".format(hotelId, time.ctime()))
            f.write('\n')
            f.close()
        print(e)

    except Exception as e:
        with open(fileLocation, 'a') as f:
            f.write(
                "Failed Loading Time Hotel: {} @ {}".format(hotelId, time.ctime()))
            f.write('\n')
            f.close()
        print(e)

    finally:
        driver.close()
        driver.switch_to.window(parent)
        time.sleep(10)
