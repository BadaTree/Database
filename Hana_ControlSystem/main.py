import time

from flask import Flask, json , jsonify, render_template, request, redirect, url_for
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
import random


app = Flask(__name__)
CORS(app)  # 모든 라우트에 대해 CORS를 허용합니다


# MySQL database 연결 설정 및 권한 확인
connection = mysql.connector.connect(
    host='163.152.52.120',
    user='bada',
    password='qkekdla00^^',
    database='SuwonStationMap'
)


# json으로 다시 바꿀 때 \가 들어가서 제거해주는 함수
def clean_json(json_str):
    # Remove backslashes from the JSON string
    cleaned_str = json_str.replace("\\", "")
    return cleaned_str


# 관제 뷰 띄우기
@app.route('/')
def renderHtml():
    return render_template(r'HanaSquare_B1.html')


# suwonstationmap DB의 map_info 테이블 데이터 조회 및 반환
@app.route('/map')
def selectMap():
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


# suwonstationmap DB의 roomarea_info 테이블 데이터 조회 및 반환
@app.route('/room')
def selectRoom():
    while True:
        try:
            cursor = connection.cursor()
            query = "SELECT * FROM suwonstationmap.roomarea_info"
            cursor.execute(query)
            data = cursor.fetchall()
            cursor.close()
            # Serialize the data using json.dumps()
            serialized_data = json.dumps(str(float(random.randint(1, 1000))))
            time.sleep(5)
            return serialized_data, 200, {'Content-Type': 'application/json'}
        except Exception as e:
            print("error:", e)
            return "Error occurred", 500, {'Content-Type': 'text/plain'}


# suwonstationmap DB의 floor_info 테이블 데이터 조회 및 반환
@app.route('/floor')
def selectFloor():
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



# suwonstationmap DB의 background_info 테이블 데이터 조회 및 반환
@app.route('/back')
def selectBack():
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


# suwonstationmap DB의 Current_user 테이블 데이터 추가
@app.route('/insertUser')
def insertUser():
    try:
        cursor = connection.cursor()
        for i in range(50 ,600):
            insert_query = "INSERT INTO suwonstationmap.Current_user VALUES (%s, %s, %s, %s)"
            values = (
                f"{i + 1}",
                f"temp_pw{i}",
                str(float(random.randint(1, 1000))),
                str(float(random.randint(1, 320)))
            )
            cursor.execute(insert_query, values)
        connection.commit()  # 데이터베이스에 변경 내용을 반영합니다

        return "Data inserted successfully", 200, {'Content-Type': 'application/json'}

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# suwonstationmap DB의 Current_user 테이블 데이터 수정
@app.route('/alertUser')
def alertUser():
    try:
        cursor = connection.cursor()
        user_id = "1"
        search_query = "SELECT user_id FROM suwonstationmap.Current_user"
        cursor.execute(search_query)

        # Fetch all rows from the query result
        rows = cursor.fetchall()

        # Extract user_ids from the rows and store them in a Python list
        user_ids = [row[0] for row in rows]

        # Check if the user_id exists in the user_ids list
        if user_id in user_ids:
            update_query = "UPDATE suwonstationmap.Current_user SET x = %s, y = %s WHERE user_id = %s"
            values = (str(float(random.randint(1, 1000))), str(float(random.randint(1, 1000))), user_id)
            cursor.execute(update_query, values)

            connection.commit()  # Commit the changes to the database
            return "User updated successfully", 200
        else:
            return "User not found", 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

        return jsonify({"user_ids": user_ids}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# suwonstationmap DB의 Current_user 테이블 데이터를 이용해서
# 1.맵 영역 분리, 2.영역 별로 위치한 사용자 수 분석 3.정원에 비교하여 혼잡도 계산
@app.route('/analy')
def analy():
    X_MAX = 1000
    Y_MAX = 320
    MAX = 2000
    Congestion_level_0 = []
    Congestion_level_1 = []
    Congestion_level_2 = []

    # 데이터베이스에서 x와 y 속성 받아오기
    x_values = []
    y_values = []

    try:
        cursor = connection.cursor()
        fetch_query = "SELECT x, y FROM suwonstationmap.Current_user"
        cursor.execute(fetch_query)
        rows = cursor.fetchall()

        for row in rows:
            x_values.append(row[0])
            y_values.append(row[1])

    except Exception as e:
        print("데이터베이스 쿼리 실행 오류:", e)
        return jsonify({"error": str(e)}), 500

# 각각의 범위를 정의
    area_count = [0,0,0,0]

    # 각 좌표가 어떤 영역에 속하는지 분석
    for i in range(len(x_values)):
        x = x_values[i]
        y = y_values[i]

        if 0 <= x < X_MAX / 2 and 0 <= y < Y_MAX / 2:
            area_count[0] += 1
        elif X_MAX / 2 <= x < X_MAX and 0 <= y < Y_MAX / 2:
            area_count[1] += 1
        elif 0 <= x < X_MAX / 2 and Y_MAX / 2 <= y < Y_MAX:
            area_count[2] += 1
        elif X_MAX / 2 <= x < X_MAX and Y_MAX / 2 <= y < Y_MAX:
            area_count[3] += 1
    for i in range(4):
        if (MAX * 0.8) <= area_count[i] < (MAX * 1.3):
            Congestion_level_0.append(f"Area_ {i + 1}")
        elif (MAX * 1.3) <= area_count[i] < (MAX * 1.5):
            Congestion_level_1.append(f"Area_ {i + 1}")
        elif area_count[i] < (MAX * 1.5):
            Congestion_level_2.append(f"Area_ {i + 1}")

    output = {
        "area1_count": area_count[0],
        "area2_count": area_count[1],
        "area3_count": area_count[2],
        "area4_count": area_count[3],
        "Normal": Congestion_level_0,
        "Caution": Congestion_level_1,
        "Congestion": Congestion_level_2
    }
    output1 = {
        "area1_count":  x_values,
        "area2_count": y_values
    }
    # Use json.dumps with indent parameter for line breaks
    return json.dumps(output1, indent=2)


if __name__ == '__main__':
    # app.run(debug=True)
    app.run(debug=False, host="163.152.52.199", use_reloader=False, port=5000)