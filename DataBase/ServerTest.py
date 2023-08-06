from flask import Flask, json
import mysql.connector
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # 모든 라우트에 대해 CORS를 허용합니다

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

@app.route('/map')
def mapindex():
    try:
        cursor = connection.cursor()
        query = "SELECT * FROM suwonstationmap.map_info"
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()

        # Serialize the data using json.dumps()
        serialized_data = json.dumps(data)
        print(serialized_data)
        return serialized_data, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        print("error:", e)
        return "Error occurred", 500, {'Content-Type': 'text/plain'}


# suwonstationmap.roomarea_info 테이블의 'map_data_json' 속성 출력
@app.route('/room')
def roomindex():
    try:
        cursor = connection.cursor()
        query = "SELECT * FROM suwonstationmap.roomarea_info"
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()

        # Serialize the data using json.dumps()
        serialized_data = json.dumps(data)

        return serialized_data, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        print("error:", e)
        return "Error occurred", 500, {'Content-Type': 'text/plain'}


# suwonstationmap.floor_info 테이블의 'map_data_json' 속성 출력
@app.route('/floor')
def floorindex():
    try:
        cursor = connection.cursor()
        query = "SELECT * FROM suwonstationmap.floor_info"
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()

        # Serialize the data using json.dumps()
        serialized_data = json.dumps(data)

        return serialized_data, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        print("error:", e)
        return "Error occurred", 500, {'Content-Type': 'text/plain'}

# suwonstationmap.background_info 테이블의 'map_data_json' 속성 출력
@app.route('/back')
def index():
    try:
        cursor = connection.cursor()
        query = "SELECT * FROM suwonstationmap.background_info"
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()

        # Serialize the data using json.dumps()
        serialized_data = json.dumps(data)

        return serialized_data, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        print("error:", e)
        return "Error occurred", 500, {'Content-Type': 'text/plain'}


if __name__ == '__main__':
    # app.run(debug=True)
    app.run(debug=False, host="163.152.52.120", use_reloader=False, port=5000)