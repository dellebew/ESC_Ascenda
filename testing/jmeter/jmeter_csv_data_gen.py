import json

uid_file_path = "../../client/src/database/uid_code.json"
w_file_path = "jmeter_data.csv"

uid_file = open(uid_file_path)
data = json.load(uid_file)

f_write = open(w_file_path, 'w', newline='')
for i in data:
    for checkout in range(6, 31, 5):
        if checkout >= 10:
            checkout_day = str(checkout)
        else:
            checkout_day = "0"+str(checkout)
        desti_id = i["uid"]
        code = i["code"]

        url_frontend = f"/destinations/{desti_id}/2022-08-05/2022-08-{checkout_day}/en_US/SGD/{code}/2/0/1/0"
        url_backend = f"/api/destination/prices/{desti_id}/2022-08-05/2022-08-{checkout_day}/en_US/SGD/{code}/2/1"
        expVal = "200"
        line1 = url_frontend + "," + expVal + "," + "3000"
        line2 = url_backend + "," + expVal + "," + "8080"

        f_write.writelines(line1+"\n")
        f_write.writelines(line2+"\n")

uid_file.close()

hotels = ["v3JS", "hxj6", "WUN0", "Hfdt", "sOyG"]
dic = {"RsBU": ["cETW", "qRUF", "8BCr", "nPbT", "qO6Y"],
       "jC3Y": ["v3JS", "hxj6", "WUN0", "Hfdt", "sOyG"]}
for desti in dic:
    hotels = dic[desti]
    for hotel in hotels:
        for checkout in range(6, 31, 5):
            if checkout >= 10:
                checkout_day = str(checkout)
            else:
                checkout_day = "0"+str(checkout)
            for guest in range(6):
                guest = str(guest)
                url_frontend = f"/hotels/{hotel}/{desti}/2022-08-05/2022-08-{checkout_day}/en_US/SGD/GB/{guest}/0/1"
                url_backend = f"/api/hotel/price/{hotel}/{desti}/2022-08-05/2022-08-{checkout_day}/en_US/SGD/SG/{guest}"
                expVal = "200"
                line1 = url_frontend + "," + expVal + "," + "3000"
                line2 = url_backend + "," + expVal + "," + "8080"

                f_write.writelines(line1+"\n")
                f_write.writelines(line2+"\n")

f_write.close()
