import json

try:
    # Check file content and encoding
    with open("ModuleSuwon20230524.txt", "r", encoding="utf-8") as file:
        json_data = file.read()

    # print the contents of the file
    print("File content:")
    print(json_data)

    if json_data.strip():  # check if json_data is not empty or contains only whitespace characters
        data_dict = json.loads(json_data)
        print("*************** format **********************")

        # ************** Save data_dict to a different JSON file **************
        with open("SuwonStation.json", "w", encoding="utf-8") as json_file:
            json.dump(data_dict, json_file, indent=2, ensure_ascii=False)
            print("data_dict saved to different_filename.json successfully.")
    else:
        print("The JSON data is empty or not in the expected format.")
except json.JSONDecodeError as e:
    print("Error parsing JSON data:")
    print(e)
