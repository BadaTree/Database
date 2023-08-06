from flask import Flask, json
import mysql.connector

app = Flask(__name__)

# MySQL database connection configuration
connection = mysql.connector.connect(
    host='163.152.52.120',
    user='min',
    password='qkekdla00^^',
    database='SuwonStationMap'
)

# json으로 다시 바꿀 때 \가 들어가서 제거해주는 함수
def clean_json(json_str):
    # Remove backslashes from the JSON string
    cleaned_str = json_str.replace("\\", "")
    return cleaned_str

@app.route('/')
def index():
    try:
        cursor = connection.cursor()
        query = "SELECT map_data_json from suwonstationmap.modulesuwon"  # Replace 'your_table_name' with the actual table name you want to query
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        print(data)
        # Serialize the data manually using json.dumps() and clean up backslashes
        serialized_data = json.dumps(data)
        cleaned_data = clean_json(serialized_data)

        return cleaned_data, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        return f"Error: {e}", 500


if __name__ == '__main__':
    app.run(debug=True)
    # app.run(debug=False, host="163.152.1.1", use_reloader=False, port=3306)