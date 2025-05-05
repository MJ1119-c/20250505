// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

let circleX = 320; // 圓的初始 X 座標
let circleY = 240; // 圓的初始 Y 座標
let circleRadius = 50; // 圓的半徑
let isDragging = false; // 是否正在拖動圓
let redTrail = []; // 儲存食指的軌跡
let greenTrail = []; // 儲存大拇指的軌跡

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

  // 畫出食指的紅色軌跡
  stroke(255, 0, 0); // 紅色線條
  strokeWeight(2);
  noFill();
  beginShape();
  for (let point of redTrail) {
    vertex(point.x, point.y);
  }
  endShape();

  // 畫出大拇指的綠色軌跡
  stroke(0, 255, 0); // 綠色線條
  strokeWeight(2);
  noFill();
  beginShape();
  for (let point of greenTrail) {
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
        // 獲取大拇指的 keypoint (keypoint 4)
        let thumbtip = hand.keypoints[4];

        // 檢測食指是否接觸到圓
        let dFinger = dist(fingertip.x, fingertip.y, circleX, circleY);
        if (dFinger < circleRadius) {
          // 如果接觸到圓，讓圓跟隨食指移動
          circleX = fingertip.x;
          circleY = fingertip.y;

          // 記錄食指的軌跡
          isDragging = true;
          redTrail.push({ x: circleX, y: circleY });
          fingerOnCircle = true;
        }

        // 檢測大拇指是否接觸到圓
        let dThumb = dist(thumbtip.x, thumbtip.y, circleX, circleY);
        if (dThumb < circleRadius) {
          // 如果接觸到圓，讓圓跟隨大拇指移動
          circleX = thumbtip.x;
          circleY = thumbtip.y;

          // 記錄大拇指的軌跡
          isDragging = true;
          greenTrail.push({ x: circleX, y: circleY });
          fingerOnCircle = true;
        }

        // 繪製食指的點
        fill(255, 0, 0); // 紅色
        noStroke();
        circle(fingertip.x, fingertip.y, 16);

        // 繪製大拇指的點
        fill(0, 255, 0); // 綠色
        noStroke();
        circle(thumbtip.x, thumbtip.y, 16);
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
    redTrail = [];
    greenTrail = [];
  }
}
