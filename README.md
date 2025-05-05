
---
tags: 程式設計,第十二章,ML5.js，學生版,互動藝術程式創作入門,Creative Coding
---
# 12. 媒體 - 影像、聲音與影片的整合與拆解ML5.js_學生版

相關網站

[https://www.tensorflow.org/js/models](https://www.tensorflow.org/js/models)



---

![](https://i.imgur.com/NwfY4n6.png)


---


在HTML檔案上加入這條指令

```htmlmixed=
<script src="https://unpkg.com/ml5@0.5.0/dist/ml5.min.js"></script>
```


---

顯示你的畫面到影像中

```javascript=
let video;
let poseNet;
let pose;
let skeleton;

function setup() {
  createCanvas(640, 480);
	//createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded); //呼叫在ml5.js上的net函數，用此函數來判斷各位置，呼叫成功即執行function modelLoaded 
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;  //把抓到的幾個點，都放置pose變數內
    skeleton = poses[0].skeleton; //把相關於骨架的點都放到skeleton變數內
  }
}


function modelLoaded() {   //顯示pose model已經準備就緒
  console.log('poseNet ready');
}

function draw() {
    background(0);
    image(video, 0, 0);  //顯示你的畫面在螢幕上
}

```
---

因為會產生影像左右顛倒

在draw()函數中加入

```javascript=
	translate(video.width,0)  //因為攝影機顯示的是反像的畫面，需要透過這兩條指令來做反轉
	scale(-1,1)    //因為攝影機顯示的是反像的畫面，需要透過這兩條指令來做反轉
```



---


![](https://i.imgur.com/Yvb7qTC.png)

---

![](https://i.imgur.com/IkBxOXV.png)



---



取得資料
在draw()函數內繼續加入以下程式碼

```javascript=
if (pose) {
    let eyeR = pose.rightEye;  //抓到右眼資訊，放到eyeR
    let eyeL = pose.leftEye;   //抓到左眼資訊，放到eyeL
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y); //算出左右眼的距離，當作鼻子顯示圓的直徑
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d); //畫出鼻子的圓
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 62); //畫出右手腕圓圈
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 62); //畫出左手腕圓圈
    
}
```

---

加入兩個函數

```javascript=

function drawKeypoints()  {  
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;//找出每一個點的x座標
      let y = pose.keypoints[i].position.y;//找出每一個點的y座標
      fill(0,255,0);
      ellipse(x,y,16,16);
    }
	}
function drawSkeleton()  {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];			
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y,b.position.x,b.position.y);			
    }
  }
```

---

draw()函數就變成以下內容

```javascript=

function draw() {
	background(0);
	translate(video.width,0)  //因為攝影機顯示的是反像的畫面，需要透過這兩條指令來做反轉
	scale(-1,1)    //因為攝影機顯示的是反像的畫面，需要透過這兩條指令來做反轉
  //image(video, 0, 0);  //顯示你的畫面在螢幕上

  if (pose) {
    let eyeR = pose.rightEye;  //抓到右眼資訊，放到eyeR
    let eyeL = pose.leftEye;   //抓到左眼資訊，放到eyeL
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y); //算出左右眼的距離，當作鼻子顯示圓的直徑
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d); //畫出鼻子的圓
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 62); //畫出右手腕圓圈
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 62); //畫出左手腕圓圈
    
    drawKeypoints()  //畫出關鍵點
    
    drawSkeleton()  //畫出骨骼線
  }
}
```

---

相關程式碼
[https://editor.p5js.org/kylemcdonald/sketches/H1OoUd9h7](https://editor.p5js.org/kylemcdonald/sketches/H1OoUd9h7)




```javascript=
let video;
let poseNet;
let pose;
let skeleton;

function setup() {
  createCanvas(640, 480);
	//createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded); //呼叫在ml5.js上的net函數，用此函數來判斷各位置，呼叫成功即執行function modelLoaded 
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;  //把抓到的幾個點，都放置pose變數內
    skeleton = poses[0].skeleton; //把相關於骨架的點都放到skeleton變數內
  }
}


function modelLoaded() {   //顯示pose model已經準備就緒
  console.log('poseNet ready');
}

function draw() {
    background(0);
		translate(video.width,0)  //因為攝影機顯示的是反像的畫面，需要透過這兩條指令來做反轉
		scale(-1,1)    //因為攝影機顯示的是反像的畫面，需要透過這兩條指令來做反轉
    image(video, 0, 0);  //顯示你的畫面在螢幕上
		if (pose) {
			let eyeR = pose.rightEye;  //抓到右眼資訊，放到eyeR
			let eyeL = pose.leftEye;   //抓到左眼資訊，放到eyeL
			let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y); //算出左右眼的距離，當作鼻子顯示圓的直徑
			fill(255, 0, 0);
			ellipse(pose.nose.x, pose.nose.y, d); //畫出鼻子的圓
			fill(0, 0, 255);
			ellipse(pose.rightWrist.x, pose.rightWrist.y, 62); //畫出右手腕圓圈
			ellipse(pose.leftWrist.x, pose.leftWrist.y, 62); //畫出左手腕圓圈
			drawKeypoints()
			drawSkeleton()
 		}
}
function drawKeypoints()  {  
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;//找出每一個點的x座標
      let y = pose.keypoints[i].position.y;//找出每一個點的y座標
      fill(0,255,0);
      ellipse(x,y,16,16);
    }
	//print(pose.keypoints.length)
	}
function drawSkeleton()  {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];			
      strokeWeight(2);
      stroke(255,0,0);
      line(a.position.x, a.position.y,b.position.x,b.position.y);			
    }
  }
```



---

```javascript=
var mountainImg,landImg,noiseImg
function preload(){
	//mountainImg = loadImage("image211217.jpg")
	landImg= loadImage("landscape.jpg")
	noiseImg =loadImage("noise1.jpg")
}


```

利用以下指令顯示圖片

```javascript=
image(noiseImg,0,0,landImg.width,landImg.height)
```

取得一個耳朵檔案


![](https://i.imgur.com/UoKfhYw.png)



---

```javascript=

function preload(){	
	rightEarImg= loadImage("right_ear.png")	
}

```


---
右耳的程式碼

```javascript=
push()
	translate(pose.rightEar.x, pose.rightEar.y) //以找到的右耳位置當作座標原點
	imageMode(CENTER); //圖片要以中心點為座標點
	scale(-1,1)  //左右翻轉
	scale(0.1)   //縮小到0.1
	image(rightEarImg,0, 0) //顯示該圖片
pop()
```


---
```javascript=
if(pose.rightEar.confidence>0.7){
	push()
		translate(pose.rightEar.x, pose.rightEar.y)
		imageMode(CENTER);
		scale(-1,1)
		scale(0.1)
		image(rightEarImg,0, 0)
    pop()
}
```
12. 媒體 - 影像、聲音與影片的整合與拆解ML5.js_學生版.md
目前顯示的是「12. 媒體 - 影像、聲音與影片的整合與拆解ML5.js_學生版.md」。
