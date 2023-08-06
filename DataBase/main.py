import mysql.connector
import json
from __future__ import unicode_literals

name = "ascension"  # 이렇게 하면 파이썬 2.x에서 유니코드 문자열이 됩니다.


# 맵정보가 담긴 json 파일을 DB에 업데이트하는 코드

# JSON 파일을 읽어들입니다.
with open('ModuleSuwon20230524_saved.json', 'r', encoding='utf-8') as file:
    json_data = file.read()

# MySQL에 연결합니다.
connection = mysql.connector.connect(
    host='163.152.52.120',
    user='min',
    password='qkekdla00^^',
    database='SuwonStationMap'
)

# Check if the connection is successful.
if connection.is_connected():
    print("Connected to MySQL database.")

    # Write a query to insert the JSON string into the table.
    table_name = 'accesstest'
    insert_query = f"INSERT INTO {table_name} (id, map_data_json) VALUES (1,%s)"
    print(json_data)
    # Execute the query.
    cursor = connection.cursor()
    cursor.execute(insert_query, (json_data,))

    # Commit the changes.
    connection.commit()

    print("Data inserted successfully.")


# Close the connection.
connection.close()
print("Connection terminated.")
