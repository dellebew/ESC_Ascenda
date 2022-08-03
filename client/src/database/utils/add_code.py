import json
# generate file with country, uid, and country_code
des_file_path = "../destinations.json"
code_file_path = "../countries.json"
write_file = "../uid_code.json"

des_file = open(des_file_path,encoding="utf-8")
des_data = json.load(des_file)

code_file = open(code_file_path,encoding="utf-8")
code_data = json.load(code_file)

outfile = open(write_file, 'w',encoding="utf-8",newline="")
json_string = []
countries = []
count = 0

for destination in des_data:
    try:
        uid = destination["uid"]
        country = destination["term"].split(",")[-1]
        if country not in countries:
            for c in code_data:
                
                if c["name"].strip() == country.strip():
                    print(c["name"],country)
                    countries.append(country)
                    json_string.append({"uid":uid,"country":country,"code":c["code"]})
                    break
    except:
        continue

json.dump(json_string,outfile)
outfile.close()