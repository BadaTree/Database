import json
import mysql.connector

# Read JSON file
with open("ModuleSuwon20230524.txt", "r", encoding="utf-8") as file:
    data = json.load(file)

# Connect to MySQL
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='0000',
    database='teacher_information'
)
cursor = conn.cursor()

# Create the database
cursor.execute(f"CREATE DATABASE IF NOT EXISTS {data['teacher_information']};")
cursor.execute(f"USE {data['teacher_information']};")

# Create tables
for table in data['tables']:
    table_name = table['name']
    columns = ", ".join([f"{col['name']} {col['type']}" for col in table['columns']])
    create_table_query = f"CREATE TABLE IF NOT EXISTS {table_name} ({columns});"
    cursor.execute(create_table_query)

# Insert data (if applicable)
for table in data['tables']:
    table_name = table['name']
    if 'data' in table:
        for row in table['data']:
            columns = ", ".join(row.keys())
            values = ", ".join([f"'{value}'" for value in row.values()])
            insert_query = f"INSERT INTO {table_name} ({columns}) VALUES ({values});"
            cursor.execute(insert_query)

# Commit changes and close connection
conn.commit()
cursor.close()
conn.close()
