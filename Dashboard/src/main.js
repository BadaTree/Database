import * as THREE from 'three';
import { OrbitControls } from './JS/OrbitControls.js';
import { GLTFLoader } from './JS/GLTFLoader.js';
import { Player } from './Player.js';//bada_0911
import gsap from './JS/gsap-core.js';//bada_0911
import { hanaJson } from './data/JS_lgmodule.js';
import EasyStar from './JS/easystar-0.4.4.js';//bada_0911

//건물 층 설정 , 소각로,건물 A : 21층, 분해로,건물 B : 13층
let A_TotalFloor = 6 //13
let B_TotalFloor =  5//10
// 층 간격
let gap = 300

/* 제이슨 파일 설정 */
const Pubpoint = hanaJson.data.A_Floors[0].PubPoint;
const Pubpoint1 = hanaJson.data.B_Floors[0].PubPoint;

//건물 체크
const RoomArea = hanaJson.data.A_RoomArea[1];

const A_Floors = hanaJson.data.A_Floors;
const B_Floors = hanaJson.data.B_Floors;
const Floors = hanaJson.data.Floor;
const B_height = hanaJson.data.Height;


//전체 사이즈      
let originX = A_Floors[0].outline[0];
let originY = A_Floors[0].outline[1];

//초기위치
let xx = 0//A_Floors[0].outline[2][1];
let yy = 0//0A_Floors[0].outline[2][2];

/* 변수 정의 */
let pathOn = 0; //네비 실행 on, off
let locateOn = 0; //위치 정보 수신 확인
let angleOn = 0; //위치 정보 수신 확인
let locate_On_set = 0; //위치 정보 수신 확인
let once = 1; //1회 실행
let playerSize = 20;


let camPositionX = 0; // 카메라 뷰 초기값
let camPositionY = 0;
let camPositionZ = 0;
let conPositionX = 0; // 카메라 뷰포인트 초기값
let conPositionY = 0;
let conPositionZ = 0;

let angle_R = 30; //각도 거리 기준 값

let x1, x2, x3, y1, y2, y3, angle; //모니터링
x1 = x2 = x3 = y1 = y2 = y3 = angle = 0;

let RadAngle = 0; //디그리 to 라디안 

let mode = 'normal';

let roomNumber = 0; // 셀렉트 박스 값




/* 룸 색상 지정 */
/* ID : P Public, R Room, 적용 3자리
Outline : 플로어 중점=>크기, 외 입구 =>크기
P_Type : S001-남자화장실, S002-여자화장실, S003-공용화장실, S004-입구, S005-계단, S006-엘리베이터, S007-에스칼레이터
R_Type : A001-공용공간(운동, 보건,강당,회의실, 강의실 등), A002-상가, A003-사무실, A004-휴게공간, A005-관리시설(관리실, 창고 등) */
let roomColor = 0xffffcc;
let roomColorSelect = function (val) {
    let answer = "";
    switch (val) {
        case 'A001':
            answer = 0xFFE5CC;
            break;
        case 'A002':
            answer = 0xFFCCCC;
            break;
        case 'A003':
            answer = 0xCCFFCC;
            break;
        case 'A004':
            answer = 0xCCE5FF;
            break;
        case 'A005':
            answer = 0xFFCCFF;
            break;
    }
    return answer;
}

/* 룸 색상 지정 끝*/

/* 사용 아이콘 */ //bada_0911
const icon = [
    0,
    "./images/dot.png",
    "./images/dotg.png",
    "./images/doty.png",
    "./images/user.png",
    "./images/stairs.png",
    "./images/elevator.png",
    "./images/escalator.png",
    "./images/dot.png",
    "./images/arrow.png",
    "./images/flag.png",
    "./images/store_emart24.png",// 11
    "./images/store_hanabank.png",
    "./images/store_korea.png",
    "./images/store_momstouch.png",
    "./images/store_sandpresso.png",
];

/* 맵 matrix 생성 시작 */
//위치 추정 Array 생성
let arrMap = new Array();
let arrReduction = -5;  //확대 축소 비율 지정   
let arrCol = Math.floor(originX / arrReduction) + 1; // 열 축소비율 반영
let arrRow = Math.floor(originY / arrReduction) + 1; // 행 축소비율 반영
let arrElement = null;


for (let i = 0; i < arrRow; i++) {  // 맵크기 만큼 행렬 만들기
    arrElement = new Array();
    for (let j = 0; j < arrCol; j++) {
        arrElement.push('----'); // 이동 불가 구역
    }
    arrMap.push(arrElement);
}


//행렬에 도보 채우기
// let arrFloors = Floors[0].outline[2][0]

// for (let j = 0; j < arrFloors.length; j += 2) {
//     let arrFilRow = arrFloors[j] - arrFloors[j + 2];
//     if (Math.abs(arrFilRow) > 0) {
//         if (arrFilRow < 0) {
//             for (let k = 0; k < Math.abs(arrFilRow / arrReduction); k++) {
//                 arrMap[Math.floor(arrFloors[j + 1] / arrReduction)][Math.floor(arrFloors[j] / arrReduction) + k] = '++++';
//             }
//         } else {
//             for (let k = 0; k < Math.abs(arrFilRow / arrReduction); k++) {
//                 arrMap[Math.floor(arrFloors[j + 1] / arrReduction)][Math.floor(arrFloors[j + 2] / arrReduction) + k] = '++++';
//             }
//         }
//     }
// }
// for (let l = 0; l < arrCol; l++) { //속 채우기
//     let arrCnt = 0; // 유효값 횟 수 
//     let prePoint = 0; //유효값 첫 번째 점
//     for (let m = 0; m < arrRow; m++) {
//         if (arrMap[m][l] == '++++') {
//             arrCnt++;
//             if (arrCnt == 2) {
//                 for (let n = 1; n < m - prePoint; n++) {
//                     arrMap[prePoint + n][l] = '++++';
//                     arrCnt = 0;
//                 }
//             }
//             prePoint = m;
//         }
//     }
//     let rearrCnt = 0; // 유효값 횟 수 
//     let reprePoint = 0; //유효값 첫 번째 점
//     for (let m = arrRow - 1; m > 0; m--) {
//         if (arrMap[m][l] == '++++') {
//             rearrCnt++;
//             if (rearrCnt == 2) {
//                 for (let n = 0; n < reprePoint - m; n++) {
//                     arrMap[reprePoint - n][l] = '++++';
//                     rearrCnt = 0;

//                 }
//             }
//             reprePoint = m;
//         }
//     }
// }


// //행렬에 호실정보 채우기
// for (let i = 0; i < RoomArea.length; i++) { //방 개수 마큼 카운트
//     let arrRoom = RoomArea[i].outline[2][0];
//     for (let j = 0; j < arrRoom.length; j += 2) {
//         let arrFilRow = arrRoom[j] - arrRoom[j + 2];
//         if (Math.abs(arrFilRow) > 0) {
//             if (arrFilRow < 0) {
//                 for (let k = 0; k < Math.abs(arrFilRow / arrReduction); k++) {
//                     arrMap[Math.floor(arrRoom[j + 1] / arrReduction)][Math.floor(arrRoom[j] / arrReduction) + k] = RoomArea[i].ID;
//                 }
//             } else {
//                 for (let k = 0; k < Math.abs(arrFilRow / arrReduction); k++) {
//                     arrMap[Math.floor(arrRoom[j + 1] / arrReduction)][Math.floor(arrRoom[j + 2] / arrReduction) + k] = RoomArea[i].ID;
//                 }
//             }
//         }
//     }
//     for (let l = 0; l < arrCol; l++) { //속 채우기
//         let arrCnt = 0; // 유효값 횟 수
//         let prePoint = 0; //유효값 첫 번째 점
//         for (let m = 0; m < arrRow; m++) {
//             if (arrMap[m][l] == RoomArea[i].ID) {
//                 arrCnt++;
//                 if (arrCnt == 2) {
//                     for (let n = 1; n < m - prePoint; n++) {
//                         arrMap[prePoint + n][l] = RoomArea[i].ID;
//                         arrCnt = 0;
//                     }
//                 }
//                 prePoint = m;
//             }
//         }
//     }
//     //행렬에 문위치 넣기
//     arrMap[Math.floor(RoomArea[i].outline[1] / arrReduction)][Math.floor(RoomArea[i].outline[0] / arrReduction)] = ('RD' + RoomArea[i].ID.substring(2, 4));
// }

/* 맵 matrix 생성 끝 */

// 길 찾기 기본 위치
let myLocate = {
    x: Math.floor(xx / arrReduction),
    y: Math.floor(yy / arrReduction)
};


// Texture
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('./images/grid.png');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.x = originX / 10;
groundTexture.repeat.y = originY / 10;

// Renderer
const canvas = document.querySelector('#three-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);


// Camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);
scene.add(camera);

// controll
const controls = new OrbitControls(camera, renderer.domElement);

/* 카메라 위치 셋팅 */
camera.position.set(
    xx - (originX / 2) +300,
    3000,
    (originY / 2) - yy+500
);
controls.target.set(
    conPositionX = xx - (originX / 2)+1500,
    conPositionY = 900,
    conPositionZ = (originY / 2) - yy
)

/* 카메라 초기화 */
let intCam =  function(){
    camPositionX = Math.floor(camera.position.x);
    camPositionY = Math.floor(camera.position.y);
    camPositionZ = Math.floor(camera.position.z);
    conPositionX = Math.floor(controls.target.x);
    conPositionY = Math.floor(controls.target.y);
    conPositionZ = Math.floor(controls.target.z);
}
intCam();




// Light
const ambientLight = new THREE.AmbientLight('white', 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('white', 0.5);
const directionalLightOriginPosition = new THREE.Vector3(1, 1, 1);
directionalLight.position.x = directionalLightOriginPosition.x;
directionalLight.position.y = directionalLightOriginPosition.y;
directionalLight.position.z = directionalLightOriginPosition.z;
directionalLight.castShadow = true;

// mapSize 세팅으로 그림자 퀄리티 설정
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
// 그림자 범위
directionalLight.shadow.camera.left = -1000;
directionalLight.shadow.camera.right = 1000;
directionalLight.shadow.camera.top = 1000;
directionalLight.shadow.camera.bottom = -1000;
directionalLight.shadow.camera.near = -1000;
directionalLight.shadow.camera.far = 1000;
scene.add(directionalLight);

// Mesh
/* 지면 */
const meshes = [];
const groundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry((originX+300) * 10, (originY+300) * 10),
    new THREE.MeshStandardMaterial({
        map: groundTexture
    })
);
groundMesh.name = 'ground';
groundMesh.rotation.x = -Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);
meshes.push(groundMesh);

/* 층설정 */
function modelFloor(floorPts,height) {
    /**비율 조정 */
    // for ( let i = 0; i < roompts.length; i ++ ) roompts[ i ].multiplyScalar( 0.5 );
    const floorBox = new THREE.Mesh(
        new THREE.ExtrudeGeometry(
            new THREE.Shape(floorPts),
            {
                steps: 1,
                depth: 10,

            }),
        new THREE.MeshStandardMaterial({
            color: 0x8C8C8C,
            /**투명 */
            // opacity: .7,
            transparent: 1

        })
    )
    const floorLine = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.ExtrudeGeometry(
            new THREE.Shape(floorPts),
            {
                steps: 1,
                depth: 10,
            }
        )),
        new THREE.LineBasicMaterial({ color: 0xFFF612 })
    )

    const floor = new THREE.Group();
    floorBox.receiveShadow = true;
    floor.rotateX(-Math.PI / 2);
    floor.add(floorBox);
    floor.add(floorLine);
    
    floor.position.y = height
    scene.add(floor);

}
//바닥 색 구분
function modelFloor1(floorPts,height) {
    /**비율 조정 */
    // for ( let i = 0; i < roompts.length; i ++ ) roompts[ i ].multiplyScalar( 0.5 );
    const floorBox = new THREE.Mesh(
        new THREE.ExtrudeGeometry(
            new THREE.Shape(floorPts),
            {
                steps: 1,
                depth: 0.001,

            }),
        new THREE.MeshStandardMaterial({
            color: 0x997000,
            /**투명 */
            // opacity: .7,
            transparent: 1

        })
    )

    const floorLine = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.ExtrudeGeometry(
            new THREE.Shape(floorPts),
            {
                steps: 1,
                depth: 10,
            }
        )),
        new THREE.LineBasicMaterial({ color: 0xFFF612 })
    )
    const floor = new THREE.Group();
    floorBox.receiveShadow = true;
    floor.rotateX(-Math.PI / 2);
    floor.add(floorBox);
    floor.add(floorLine);
    
    floor.position.y = height
    scene.add(floor);

}

// 도로까지 영역 확장

var floorPts = [];
for (let i = 0; i <  Floors[0].outline[2][0].length; i += 2) {
    floorPts.push(new THREE.Vector2(
        Floors[0].outline[2][0][i] - originX / 2,
        Floors[0].outline[2][0][i + 1] - originY / 2
        
    ));
}
modelFloor1(floorPts,0)

// A동 Floor 그리기

//0층만 표시
// var floorPts = [];
// for (let i = 0; i <  A_Floors[0].outline[2][0].length; i += 2) {
//     floorPts.push(new THREE.Vector2(
//         A_Floors[0].outline[2][0][i] - originX / 2,
//         A_Floors[0].outline[2][0][i + 1] - originY / 2
        
//     ));
// }
// modelFloor(floorPts,0)

// //다층 표시
/*
for (let j = 0; j < A_TotalFloor; j +=1){
    var floorPts = [];
    let height = j *gap
    for (let i = 0; i <  A_Floors[j].outline[2][0].length; i += 2) {
        floorPts.push(new THREE.Vector2(
            A_Floors[j].outline[2][0][i] - originX / 2+700,
            A_Floors[j].outline[2][0][i + 1] - originY / 2+1000
            
        ));
    }
    modelFloor(floorPts,height)
}
*/

// B동 Floor 그리기
//한 층만 표시
// var floorPts = [];
// for (let i = 0; i <  B_Floors[0].outline[2][0].length; i += 2) {
//     floorPts.push(new THREE.Vector2(
//         B_Floors[0].outline[2][0][i] - originX / 2,
//         B_Floors[0].outline[2][0][i + 1] - originY / 2
        
//     ));
// }
// modelFloor(floorPts,0)

// 다층표시

for (let j = 0; j < B_TotalFloor; j +=1){
    var floorPts = [];
    let height = B_height[j]
    for (let i = 0; i <  B_Floors[j].outline[2][0].length; i += 2) {
        floorPts.push(new THREE.Vector2(
            ((B_Floors[j].outline[2][0][i]-300 - originX / 2) + 1500),
            -((B_Floors[j].outline[2][0][i + 1]-500 - originY / 2)+700)
            
        ));
    }
    modelFloor(floorPts,height)
}


// /* room 설정 */
let modelRoom = function (roompts,height) {
    const roomBox = new THREE.Mesh(
        new THREE.ExtrudeGeometry(
            new THREE.Shape(roompts),
            {
                steps: 1,
                depth: 10,
                bevelEnabled: true,
                bevelThickness: 1,  //기본 값 0.2
                bevelSize: 1,       //기본 값 0.1
                bevelOffset: -1.3,     //기본 값 0
                bevelSegments: 3    //기본 값 3
            }),
        new THREE.MeshLambertMaterial({
            // color: roomColor,
            // /**투명 */
            // opacity: .7,
            // transparent: 1
            color: 0x5d5d5d,
            /**투명 */
            // opacity: .7,
            transparent: 1
        })
    )
    const roomLine = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.ExtrudeGeometry(
            new THREE.Shape(roompts),
            {
                steps: 1,
                depth: 10,
                bevelEnabled: true,
                bevelThickness: 1,  //기본 값 0.2
                bevelSize: 1,       //기본 값 0.1
                bevelOffset: -1.3,     //기본 값 0
                bevelSegments: 1    //기본 값 3
            }
        )),
        new THREE.LineBasicMaterial({ color: 0xAAAAAA })
    )
    const room = new THREE.Group();
    room.rotateX(-Math.PI / 2);
    room.position.y = height;
    // room.position.x = -300
    room.add(roomBox);
    room.add(roomLine);
    scene.add(room);
}

//건물 체크
// for (let i = 0; i < RoomArea.length; i++) {
//     let roompts = [];
//     for (let j = 0; j < RoomArea[i].outline[2][0].length - 1; j += 2) {
//         roompts.push(new THREE.Vector2(
//             RoomArea[i].outline[2][0][j] - originX / 2,
//             RoomArea[i].outline[2][0][j + 1] - originY / 2
//         ));
//     }
//     roomColor = roomColorSelect(RoomArea[i]['Type']);
//     modelRoom(roompts,0);
// }

// //A동 건물 그리기
/*
var k =0
for (k=0;k<A_TotalFloor;k+=1){
    var RoomAreaA = hanaJson.data.A_RoomArea[k]
    var room_height = k* gap
    for (let i = 0; i < RoomAreaA.length; i++) {
        var roompts = [];
        for (let j = 0; j < RoomAreaA[i].outline[2][0].length - 1; j += 2) {
            roompts.push(new THREE.Vector2(
                RoomAreaA[i].outline[2][0][j] - originX / 2+700,
                RoomAreaA[i].outline[2][0][j + 1] - originY / 2+1000
            ));
           
        }
        modelRoom(roompts,room_height);
        roomColor = roomColorSelect(RoomAreaA[i]['Type']); 
    }
    
}
*/
// //B동 건물 그리기

var k =0
for (k=0;k<B_TotalFloor;k+=1){
    var RoomAreaB = hanaJson.data.B_RoomArea[k]
    var room_height = B_height[k]
    for (let i = 0; i < RoomAreaB.length; i++) {
        var roompts = [];
        for (let j = 0; j < RoomAreaB[i].outline[2][0].length - 1; j += 2) {
            roompts.push(new THREE.Vector2(
                (RoomAreaB[i].outline[2][0][j]-300 - originX / 2) + 800,
                (RoomAreaB[i].outline[2][0][j + 1]-500 - originY / 2) +100
            ));
        }
        modelRoom(roompts,room_height);
        roomColor = roomColorSelect(RoomAreaB[i]['Type']);
    }
}



/* 도착지 표시 */
const locate_goal = new THREE.Points(
    new THREE.PlaneGeometry(0, 0),
    new THREE.PointsMaterial({
        map: new THREE.TextureLoader().load(
            icon[10]
        ),
        alphaTest: 0.4, /*값이 0.5 보다 클때만 렌더링*/

        color: 'white',
        size: 20,
        sizeAttenuation: true // 거리에 따른 크기 변환
    })
)

/* 길 찾기 라인 설정 */
const path_sprite = new THREE.TextureLoader().load(
    icon[8]
);

// /* 위치 표시 */
// const pointerMesh = new THREE.Mesh(
// 	new THREE.PlaneGeometry(1, 1),
// 	new THREE.MeshBasicMaterial({
// 		color: 'crimson',
// 		transparent: true,
// 		opacity: 0.5
// 	})
// );
// pointerMesh.rotation.x = -Math.PI/2;
// pointerMesh.position.y = 0.01;
// pointerMesh.receiveShadow = true;
// scene.add(pointerMesh);


// /* 도착지 지정  */
// const spotMesh = new THREE.Mesh(
// 	new THREE.PlaneGeometry(3, 3),
// 	new THREE.MeshStandardMaterial({
// 		color: 'yellow',
// 		transparent: true,
// 		opacity: 0.5
// 	})
// );
// spotMesh.position.set(5, 0.005, 5);
// spotMesh.rotation.x = -Math.PI/2;
// spotMesh.receiveShadow = true;
// scene.add(spotMesh);


/* 객체 표시 */
const gltfLoader = new GLTFLoader();

// const house = new House({
// 	gltfLoader,
// 	scene,
// 	modelSrc: './models/house.glb',
// 	x: 5,
// 	y: -1.3,
// 	z: 2
// });

// const player = new Player({
//     scene,
//     meshes,
//     gltfLoader,
//     modelSrc: './models/G.glb',
//     scale: playerSize,
// });



//초기값
// destinationPoint.x = 0;
// destinationPoint.y = 0;
// destinationPoint.z = 0;


// 그리기
const clock = new THREE.Clock();

function draw() {
    const delta = clock.getDelta();
    controls.update();//

    // if (player.mixer) player.mixer.update(delta);

    // if (player.modelMesh) {
        // camera.lookAt(player.modelMesh.position);
    //     if (once) {
    //         // androidBridge(0, 0);
    //         once = 0;
    //         player.modelMesh.visible = false;
    //     }
    //     if (player.modelMesh.position.x != xx - originX / 2) {
    //         player.actions[0].stop();
    //         player.actions[1].play();
    //     } else {
    //         player.actions[1].stop();
    //         player.actions[0].play();
    //     }
    // }
  
    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);

    //좌표 화면 표시
    document.getElementById('Lmonitor').innerText = "1=" + x1 + "," + y1 + "/2=" + x2 + "," + y2 + "/3=" + x3 + "," + y3 + "//" + myLocate.x + "," + myLocate.y + "," + angle;
    document.getElementById('Cmonitor').innerText = camera.position.x.toFixed(1) + ", " + camera.position.y.toFixed(1) + ", " + camera.position.z.toFixed(1) + " // " + controls.target.x.toFixed(1) + ", " + controls.target.y.toFixed(1) + ", " + controls.target.z.toFixed(1);
}


function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}

// 이벤트
window.addEventListener('resize', setSize);

draw();

    /* 계단 설정 */
    function modelstair(x0, y0, x1, y1, z0,height0, stairHeight, staitDepth, angle) {
        const stair = new THREE.Group();
        const width = x1 - x0;
        const height = stairHeight;
        const depth = staitDepth;
        for (let i = 0; i <= ((Math.abs(y1-y0) / staitDepth)-1); i += 2) {
            const stairBox = new THREE.Mesh(
                new THREE.BoxGeometry(width, height, depth),
                new THREE.MeshBasicMaterial({
                    color: 0xFFF612, //색상설정
                    opacity: 0.9, // 투명도
                    transparent: 1 //투명도 적용 
    
                })
            );
            stairBox.position.x = x0;
            stairBox.position.y = height0/stairHeight*i+y0;
            stairBox.position.z = staitDepth * i+z0;
            stair.add(stairBox);
        }
        stair.rotateY(angle*(Math.PI/180));
        scene.add(stair)
    }
    //계단1:2,4
    modelstair(850, 600, 700, 0 ,200, 350, 10, 35, 0);
    modelstair(850, 1800, 700, 2300 ,200, 400, 10, 35, 0);
    //계단2:1,3,5
    modelstair(850, 0, 700, 600 ,-800,400, 10, 35, 0);
    modelstair(850, 1200, 700, 1800 , -800,350, 10, 35, 0);
    modelstair(850, 2300, 700, 2800 , -800,400, 10, 35, 0);
    //계단3:
    modelstair(1550, 600, 1450, 0 ,-800, 350, 10, 35, 0);
    //계단4:
    modelstair(1950, 600, 1850, 0 ,-800, 350, 10, 35, 0);
    //계단5:
     modelstair(1950, 0, 1850, 600 ,200,400, 10, 35, 0);
    function modelstair1(x0, y0, x1, y1,z0, height0, stairHeight, staitDepth, angle) {
        const stair = new THREE.Group();
        const width = Math.abs(x1 - x0);
        const height = stairHeight;
        const depth = staitDepth;
        for (let i = 0; i <= ((Math.abs(y1-y0) / staitDepth)-1); i += 2) {
            const stairBox = new THREE.Mesh(
                new THREE.BoxGeometry(width, height, depth),
                new THREE.MeshBasicMaterial({
                    color: 0xFFF612, //색상설정
                    opacity: 0.9, // 투명도
                    transparent: 1 //투명도 적용 
    
                })
            );
            stairBox.position.x = x0;
            stairBox.position.y = (-(height0/stairHeight)*i)+y0;
            stairBox.position.z = staitDepth * i+z0;
            stair.add(stairBox);
        }
        stair.rotateY(angle*(Math.PI/180));
        scene.add(stair)
    }
    //계단1:1,3,5
    modelstair1(850, 600, 700, 0 , 200,400, 10, 35, 0);
    modelstair1(850, 1800, 700, 1200 , 200,350, 10, 35, 0);
    modelstair1(850, 2800, 700, 2300 , 200,400, 10, 35, 0);
    //계단2:2,4
    modelstair1(850, 1200, 700, 600 ,-800, 350, 10, 35, 0);
    modelstair1(850, 2300, 700, 1800 ,-800, 350, 10, 35, 0);
    //계단3:
    modelstair1(1550, 600, 1450, 0 , -800,400, 10, 35, 0);
    //계단4:
    modelstair1(1950, 600, 1850, 0 , -800,400, 10, 35, 0);
    //계단5:
    modelstair1(1950, 1200, 1850, 600 ,200, 350, 10, 35, 0);

/* 외부명령 *
/* 안드로이드 브릿지 */
function androidBridge(/*user,*/xPosition1, yPosition1, zPosition1) {


    x1 = Math.round(xPosition1); //모니터링용
    y1 = Math.round(yPosition1);


    xx = Math.round(xPosition1*16.47)*0.2+800; // 계산된 좌표 값
    yy = Math.round(yPosition1*15.47)*0.2-700;

    
    // xx = Math.round((-xPosition1 + 1332) * 0.265 + 630); // 계산된 좌표 값
    // yy = Math.round((yPosition1 - 258) * 0.252 + 754);

    // 현재 위치 표시
    // 캐릭터로 위치 표시 
    // gsap.to(
    //     player.modelMesh.position,
    //     {
    //         duration: 1,
    //         x: xx - originX / 2,
    //         y: zPosition1 * gap,
    //         z: originY / 2 - yy
    //     } 
    // )

    
    // modelIcon(xx , yy, zPosition1 * gap, user, 'white', 10);
    //플레이어 시점 //시점 이동 끄기 19알
    // playerFocus();

    //카메라 이동
    // if(!locateOn){
    //     mode='longview'
    //     setTimeout(function(){
    //         mode='normal'
    //         locateOn =1;
    //         intCam();
    //         //시점 이동 끄기 19알
    //         // player.modelMesh.lookAt( originX - originX / 2, playerSize, originY / 2 - yy)
    //         // player.modelMesh.visible = true;

    //     },2000);
    // }

    //카메라 위치 변경
    // cameraFunc(0, 0, 0);

    // 길찾기 좌표 생성 
    myLocate = {
        x: Math.floor(xx / arrReduction),
        y: Math.floor(yy / arrReduction)
    };

    /* 길찾기 알고리즘 */
    pathFunc();

    /* 지난 좌표 생성 */
    last_locate(yy, xx,zPosition1);
}

function image_rotation(angle0) {
    angle = angle0;
    RadAngle = (Math.PI / 180) * angle;
    cameraFunc(0.001, 0, 0);
    playerFocus();
}

window.androidBridge = androidBridge;
window.image_rotation = image_rotation;

/* 길찾기 알고리즘 */
//경로표시 path  별도 object 지정
let _pathline = null;
_pathline = new THREE.Object3D();

let goalLocate = {};
let goalRoom = function (val) {
    goalLocate = {
        x: Math.floor(RoomAreaA[val].outline[0] / arrReduction),
        y: Math.floor(RoomAreaA[val].outline[1] / arrReduction - 1)
    }
}
let pathFunc = function () {
    if (pathOn == 1) {
        console.log('start');
        locate_goal.position.set(
            goalLocate.x * arrReduction - originX / 2,
            20, originY / 2 - goalLocate.y * arrReduction);
        scene.add(locate_goal);

        let easystar = new EasyStar.js();
        let arrPath = 0;
        easystar.setGrid(arrMap);
        easystar.setAcceptableTiles(['++++']);
        easystar.enableDiagonals();

        easystar.findPath(myLocate.x, myLocate.y, goalLocate.x, goalLocate.y, function (path) {
            if (path === null) {
            } else {
                arrPath = path;
                _pathline.remove(_pathline.children);
                _pathline.children.length = 0;
                for (let i = 0; i < arrPath.length; i++) {
                    const path_points = new THREE.Points(
                        new THREE.PlaneGeometry(0, 0),
                        new THREE.PointsMaterial({
                            map: path_sprite,
                            alphaTest: 0.4, /*값이 0.5 보다 클때만 렌더링*/
                            color: 'red',
                            size: 5,
                            sizeAttenuation: true // 거리에 따른 크기 변환
                        })
                    )
                    path_points.position.set(
                        arrPath[i]['x'] * arrReduction - originX / 2, 15, originY / 2 - arrPath[i]['y'] * arrReduction);
                    _pathline.add(path_points);
                    // console.log(path_points);
                }
                conPositionX = arrPath[1]['x'] * arrReduction - originX / 2;
                conPositionZ = originY / 2 - arrPath[1]['y'] * arrReduction;
                scene.add(_pathline);
                // console.log(_pathline.children);
            }
        });
        easystar.calculate();
    } else {
        // camPositionX = 0.001;
        _pathline.remove(_pathline.children);
        _pathline.children.length = 0;
    }

}
/* 길찾기 알고리즘 끝*/

/* 위치정보 카운터 및 세이브 */
var last_x = []
var last_y = []
var first_x = true
var first_y = true
let last_locate = function (position_y, position_x,zPosition1) {
    
    if (last_x.length == 0 || last_y.length == 0){
        last_x.pop();
        last_x.unshift([position_x]);
        last_y.pop();
        last_y.unshift([position_y]);
        // 점으로 캐릭터 표시
        modelIcon_point(xx , yy, zPosition1 +18, 1, 'white', 30);
        
        first_x = false
    } else {
        last_x.pop();
        last_x.unshift([position_x]);
        last_y.pop();
        last_y.unshift([position_y]);
        // 점으로 캐릭터 표시
         modelIcon_point(xx , yy, zPosition1 +18, 1, 'white', 30);
        // 사용자 아이콘 표시
        //  modelIcon(last_x[0] , last_y[0], zPosition1 * gap + 25, 4, 'white', 40,first_x);
        
    }
    // if (last_y.length == 0) {
    //     last_y.pop();
    //     last_y.unshift([position_y]);
    //     // // 점으로 캐릭터 표시
    //      modelIcon_point(xx , yy, zPosition1 +18, 1, 'white',30);
    //     // // 사용자 아이콘 표시
    //     //  modelIcon(last_x[0] , last_y[0], zPosition1 * gap + 25, 4, 'white', 40,first_y);
    //      first_y = false
    // } else {
    //     last_y.pop();
    //     last_y.unshift([position_y]);
    //     // // 점으로 캐릭터 표시
    //      modelIcon(xx , yy, zPosition1 +12, 1, 'white', 30);
    //     // // 사용자 아이콘 표시
    //     //  modelIcon(last_x[0] , last_y[0], zPosition1 * gap + 25, 4, 'white', 40,first_y);
    // }
}


/* 버튼 이벤트 생성 */
let camPositionBtn = function (val) {
    switch (val) {
        case '180':
            camPositionY = 150;
            mode = 'normal';

            cameraFunc(0.001, 0, 0);
            break;
        case '-20':
            camPositionY <= 400 ?
                cameraFunc(0.001, 0, 20) : cameraFunc(0.001, 0, 0);

            break;
        case '+20':
            camPositionY >= 60 ?
                cameraFunc(0.001, 0, -20) : cameraFunc(0.001, 0, 0);
            break;
        case 'angle':
            angleOn = !angleOn;
            console.log(angleOn);
            if(angleOn){mode = 'angle';}else{mode = 'normal';}
            break;
    }
}
window.camPositionBtn = camPositionBtn;

/* 버튼 이벤트 생성 끝*/

/* 카메라 실행 */
let cameraFunc = function (x, y, z) {
    console.log('진입')
    console.log(mode);

    camPositionX = xx - (originX / 2) + 100;
    camPositionZ = (originY / 2) - yy;

    switch (mode) {
        case 'normal':
            console.log(mode);
            conPositionX = xx - originX / 2 -60;
            conPositionZ = originY / 2 - yy ;
            break;
        case 'angle':
            conPositionX = xx - (originX / 2) - Math.floor(Math.cos(RadAngle) * angle_R);
            conPositionZ = (originY / 2) - yy - Math.floor(Math.sin(RadAngle) * angle_R);
            break;
        case 'longview':
            gsap.to(
                camera.position,
                {
                    duration:2,
                    x:  xx - originX / 2 +100 ,
                    z:  originY / 2 - yy ,
                },
            )
            gsap.to(
                controls.target,
                {
                    duration:2,
                    x:  xx - originX / 2 -60 - 0.1,
                    z:  originY / 2 - yy 
                }
            )
            break;
        case 'longview':

            break;
    }

    camera.position.set(
        camPositionX += x,
        camPositionY += z,
        camPositionZ += y
    )
    controls.target.set(
        conPositionX,
        conPositionY,
        conPositionZ
    )
}


/* 플레이어 시점 이벤트 */

function playerFocus(){
    if (angleOn) {
        player.modelMesh.lookAt(
            xx - (originX / 2) - Math.floor(Math.cos(RadAngle) * angle_R), playerSize,
            (originY / 2) - yy - Math.floor(Math.sin(RadAngle) * angle_R)
        );
    } else {
        player.modelMesh.lookAt(xx - originX / 2, playerSize, originY / 2 - yy)
    }
}

/* 검색창 동작 */
function handleOnChange(e){
    roomNumber = e.value;
    console.log(roomNumber);
    goalRoom(roomNumber);
    pathOn = 1;
    pathFunc();
    e.value = 9999;
}

window.handleOnChange = handleOnChange;

/* 아이콘 생성 */

let modelIcon_point = function (x, y, z, i, iconColor, size) {

    const sprite = new THREE.TextureLoader().load(
        icon[i]
    );

    const points = new THREE.Points(
        new THREE.PlaneGeometry(0, 0),
        new THREE.PointsMaterial({
            map: sprite,
            alphaTest: 0.6, /*값이 0.5 보다 클때만 렌더링*/

            color: iconColor,
            size: size,
            sizeAttenuation: true // 거리에 따른 크기 변환
        })
    )
   
    points.position.set(
        x - originX / 2,
        z, originY / 2 - y);

    scene.add(points);
   
}

let modelIcon = function (x, y, z, i, iconColor, size,first) {
    const sprite = new THREE.TextureLoader().load(
        icon[i]
    );

    const points = new THREE.Points(
        new THREE.PlaneGeometry(0, 0),
        new THREE.PointsMaterial({
            map: sprite,
            alphaTest: 0.6, /*값이 0.5 보다 클때만 렌더링*/

            color: iconColor,
            size: size,
            sizeAttenuation: true // 거리에 따른 크기 변환
        })
    )
  
    console.log(first);
    points.position.set(
         x - originX / 2,
        z, originY / 2 - y);
    scene.add(points);
    // if (first == false){
    //     scene.remove(points);
    //   }
   

 
}
