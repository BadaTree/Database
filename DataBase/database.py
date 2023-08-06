import random

import mysql.connector
from mysql.connector import Error
import json

# ************** json 파일 읽어들이기 *****************
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

        print(data_dict["data"]["Floors"][0]["ID"])
        # ************** Save data_dict to a different JSON file **************
        with open("ppSuwonStation.json", "w", encoding="utf-8") as json_file:
            json.dump(data_dict, json_file, indent=2, ensure_ascii=False)

        print("data_dict saved to different_filename.json successfully.")
    else:
        print("The JSON data is empty or not in the expected format.")
except json.JSONDecodeError as e:
    print("Error parsing JSON data:")
    print(e)


# ************** DB에 연결하기 **************
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "0000",
    "database": "airport_db",
}

def create_database_tables(json_file_path, db_config):
    try:
        # Read JSON data from the file
        with open(json_file_path, "r", encoding="utf-8") as file:
            json_data = json.load(file)

        # Establish a connection to MySQL
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            print("Connected to MySQL database")

            # Create the database
            database_name = json_data.get("database_name")
            create_database_query = f"CREATE DATABASE IF NOT EXISTS {database_name};"
            cursor = connection.cursor()
            cursor.execute(create_database_query)

            # Use the created database
            cursor.execute(f"USE {database_name};")

            # Create tables using data from JSON
            for table_data in json_data.get("tables"):
                table_name = table_data.get("table_name")
                create_table_query = table_data.get("create_table_query")
                cursor.execute(create_table_query)

                # Insert initial data if available
                initial_data = table_data.get("initial_data")
                if initial_data:
                    for row in initial_data:
                        insert_query = f"INSERT INTO {table_name} VALUES {tuple(row)};"
                        cursor.execute(insert_query)

            # Commit the changes and close the connection
            connection.commit()
            cursor.close()
            connection.close()
            print("Database and tables created successfully.")

    except Error as e:
        print(f"Error: {e}")

def create_connection():
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        if connection.is_connected():
            print("Connected to MySQL database")
            return connection
    except Error as e:
        print(f"Error: {e}")
    return connection


def print_data(connection):
    if connection:
        try:
            cursor = connection.cursor()
            for i in range(100):
                insert_query = f"INSERT INTO station_db.user VALUES (%s, %s, %s, %s, %s, %s)"
                temp_data = data_dict["data"]["Floors"][0]
                values = (
                     f"{i+1}",
                    f"temp_pw{i}",
                    "0",
                    random.randint(1, 90),
                    "0",  f"010-4254-{i}{i+1}"
              )
                cursor.execute(insert_query, values)

                #query = "SELECT * FROM suwonstation.Floors"
               # cursor.execute(query)


            # 결과셋에서 모든 데이터를 가져옵니다
            data = cursor.fetchall()

            # 데이터를 한 줄씩 출력합니다
            for row in data:
                print(row)

            # SELECT 문은 데이터를 수정하지 않기 때문에 커밋이 필요하지 않습니다

            print("데이터를 성공적으로 가져왔습니다!")

        except Error as e:
            print(f"에러: {e}")

        finally:
            # 사용한 커서와 연결을 닫습니다
            cursor.close()
            connection.close()
            print("연결이 닫혔습니다.")

def insert_data(connection):
    if connection:
        try:
            cursor = connection.cursor()
            additional_stores = [
                "Super Mart",
                "Grocery World",
                "Tech Hub",
                "Fashion Plus",
                "Home Essentials",
                "Pet Paradise",
                "Toy Haven",
                "Sports Zone",
                "Health Hub",
                "Beauty Bliss",
                "Music Mania",
                "Art Gallery",
                "Garden Oasis",
                "Stationery Station",
                "Cafe Corner",
                "Dine-In Delights",
                "Gadget Galaxy",
                "Outdoor Adventure",
                "Crafters' Corner",
                "Travel Time",
                "Timepiece Treasures",
                "Fitness Fusion",
                "Sweet Sensations",
                "Home Decor Emporium",
                "Kids' Wonderland",
                "Vintage Vibes",
                "Game Zone",
                "Fashion Frenzy",
                "Healthy Bites",
                "Coffee Culture",
                "Entertainment Expo",
                "Home Improvement Zone",
                "Nature's Bounty",
                "Jewelry Junction",
                "Scented Splendor",
                "Artisan Alley",
                "Sunny Side Up",
                "Auto Gear",
                "Music Mix",
                "Tech Trek",
                "Reading Nook",
                "Trendy Treats",
                "Nature's Nook",
                "Shoe Haven",
                "Outdoor Oasis",
                "Pet Pals",
                "Toys Galore",
                "Green Thumb",
                "Travel Treasures",
                "Beauty Boutique",
                "Sports Supreme",
                "Food Fusion",
                "Electro Zone",
                "Book Buzz",
                "Health Haven",
                "Restful Retreat",
                "Fashion Fiesta",
                "Kids' Kingdom",
                "Music Mantra",
                "Artistic Avenue",
                "Stationery Studio",
                "Cafe Culture",
                "Delicious Delights",
                "Gadget Gizmo",
                "Adventure Alley",
                "Crafty Creations",
                "Time to Travel",
                "Timeless Treasures",
                "Fitness Fanatics",
                "Sweet Temptations",
                "Decor Delights",
                "Kids' Corner",
                "Vintage Vogue",
                "Gaming Galaxy",
                "Fashion Fizz",
                "Healthy Habits",
                "Coffee Craze",
                "Entertainment Extravaganza",
                "Home Helpers",
                "Nature's Nest",
                "Jewelry Gems",
                "Scented Sanctuary",
                "Artisan Artistry",
                "Sunny Days",
                "Auto Accessories",
                "Music Masters",
                "Tech Time",
                "Reading Retreat",
                "Trendy Trends",
                "Natural Necessities",
                "Shoe Style",
                "Outdoor Escapes",
                "Pet Paradise Plus",
                "Toys & Joys"
            ]
            information_services_at_airport = [
                "Flight Schedules",
                "Baggage Services",
                "Lost and Found",
                "Check-In Assistance",
                "Security Information",
                "Gate Information",
                "Boarding Pass Printing",
                "Flight Status Updates",
                "Airport Maps and Directions",
                "Ground Transportation Information",
                "Currency Exchange",
                "Language Assistance",
                "Taxi and Ride-Sharing Services",
                "Hotel Reservations",
                "Weather Updates",
                "Tourist Information",
                "Local Events and Attractions",
                "Medical Services",
                "Wi-Fi Access",
                "Charging Stations",
                "Luggage Wrapping Services",
                "Baggage Carts",
                "Pet Relief Areas",
                "Family Services",
                "Nursing Rooms",
                "Baby Changing Facilities",
                "Children's Play Areas",
                "Wheelchair Assistance",
                "Lost Luggage Tracking",
                "Customer Service Desks",
                "Airlines Information",
                "Flight Booking Assistance",
                "Flight Rescheduling",
                "Customs and Immigration Information",
                "Duty-Free Shopping Information",
                "Security Checkpoint Guidelines",
                "Smoking Areas",
                "Food and Dining Information",
                "Restroom Locations",
                "ATM and Banking Services",
                "Car Rental Information",
                "Airport Shuttle Services",
                "Business Services (Fax, Copy, Print)",
                "Baggage Storage Services",
                "Travel Insurance Information",
                "Flight Delay and Cancellation Updates",
                "Emergency Contacts",
                "Public Transportation Information",
                "Airport Lounges Access",
                "Flight Boarding Announcements",
            ]

            for i in range(0,2500):
                insert_query = "INSERT INTO airport_db.employee VALUES (%s, %s, %s, %s)"
                values = (
                    f"employee_{i}",
                    f"case_{i}",
                    f"department_{i+random.randint(0, 10000)}",
                    f"{random.randint(0, 9999)}-{random.randint(0, 9999)}",
                )
                print(values)
                cursor.execute("SET FOREIGN_KEY_CHECKS = 0")
                cursor.execute(insert_query, values)
                cursor.execute("SET FOREIGN_KEY_CHECKS = 1")

            # Commit the changes to the database
            connection.commit()

            print("Your data has been imported successfully!")

        except Error as e:
            print(f"Error: {e}")

        finally:
            # Close used cursor and connection
            cursor.close()
            connection.close()
            print("Connection closed.")

# 연결 종료하기
def close_connection(connection):
    if connection:
        connection.close()
        print("Connection closed.")


if __name__ == "__main__":
    connection = create_connection()
    if connection:
        # print_data(connection)
        # insert_data(connection)
        close_connection(connection)
