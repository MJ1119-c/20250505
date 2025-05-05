// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let circleX = 320; // 圓的初始 X 座標
let circleY = 240; // 圓的初始 Y 座標
let circleRadius = 50; // 圓的半徑
let isDragging = false; // 是否正在拖動圓
let trail = []; // 儲存軌跡的陣列

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 畫出圓
  fill(0, 255, 0, 150); // 半透明綠色
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 畫出軌跡
  stroke(255, 0, 0); // 紅色線條
  strokeWeight(2);
  noFill();
  beginShape();
  for (let point of trail) {
    vertex(point.x, point.y);
  }
  endShape();

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    let fingerOnCircle = false; // 檢查是否有手指接觸圓

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 獲取食指的 keypoint (keypoint 8)
        let fingertip = hand.keypoints[8];

        // 檢測食指是否接觸到圓
        let d = dist(fingertip.x, fingertip.y, circleX, circleY);
        if (d < circleRadius) {
          // 如果接觸到圓，讓圓跟隨食指移動
          circleX = fingertip.x;
          circleY = fingertip.y;

          // 設定拖動狀態並記錄軌跡
          isDragging = true;
          trail.push({ x: circleX, y: circleY });
          fingerOnCircle = true;
        }

        // 繪製食指的點
        fill(255, 0, 0); // 紅色
        noStroke();
        circle(fingertip.x, fingertip.y, 16);
      }
    }

    // 如果沒有手指接觸圓，停止拖動
    if (!fingerOnCircle) {
      isDragging = false;
    }
  } else {
    // 如果沒有檢測到手，停止拖動
    isDragging = false;
  }

  // 如果停止拖動，清空軌跡
  if (!isDragging) {
    trail = [];
  }
}
