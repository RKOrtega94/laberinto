var contenedor;
var maze;
var thingie;
var home;

const step = 20;
const size = 20;
const bwidth = 2;
const mazeHeight = 200;
const mazeWidth = 300;
let nogoX = [];
let nogoX2 = [];
let nogoY = [];
let nogoY2 = [];
let prevDist = mazeWidth * 2;

// tilt vars
let lastUD = 0;
let lastLR = 0;
const mThreshold = 15;
let firstMove = true;
let allowTilt = true;

// swipe vars
const sThreshold = 15;

// scroll vars
const scThreshold = 20;

// define size
let my = mazeHeight / step;
let mx = mazeWidth / step;

//create full grid
let grid = [];
for (let i = 0; i < my; i++) {
  let sg = [];
  for (let a = 0; a < mx; a++) {
    sg.push({ u: 0, d: 0, l: 0, r: 0, v: 0 });
  }
  grid.push(sg);
}

//create direction arrays
let dirs = ["u", "d", "l", "r"];
let modDir = {
  u: { y: -1, x: 0, o: "d" },
  d: { y: 1, x: 0, o: "u" },
  l: { y: 0, x: -1, o: "r" },
  r: { y: 0, x: 1, o: "l" },
};

// buttons
let bu; //up
let bd; //down
let bl; //left
let br; //right

/**
 * Función para crear laberintos
 *
 * @param {String} contenedor ID del contenedor donde se creará el laberinto
 * @param {String} image1 URL de la imagen para el inicio y del que se moverá dentro del laberinto
 * @param {String} image2 URL de la imagen para el final
 */
function laberinto(container, image1, image2) {
  /* Contenedor */
  contenedor = document.getElementById(container);
  contenedor.style.top = "0";
  contenedor.style.left = "0";
  contenedor.style.right = "0";
  contenedor.style.bottom = "0";
  contenedor.style.display = "grid";
  contenedor.style.gridTemplateRows = "60% 40%";
  contenedor.style.height = "400px";

  /* Maze Container (Laberinto) */
  let mazeContainer = document.createElement("div");
  mazeContainer.style = "height: 100%; display: grid;";
  mazeContainer.setAttribute("id", "mbox");

  maze = document.createElement("div");
  maze.setAttribute("id", "maze");
  maze.style.width = "340px";
  maze.style.height = "240px";
  maze.style.position = "relative";
  maze.style.alignSelf = "center";
  maze.style.justifySelf = "center";

  const imageStyle =
    "position: absolute;top: 100px;left: 100px;height: 20px;border-radius: 20px;";
  /* thingie */
  thingie = new Image();
  thingie.src = image1;
  thingie.style = imageStyle;

  /* home */
  home = new Image();
  home.src = image2;
  home.style = imageStyle;

  const barrierStyle = "position: absolute;background: #000;";

  /* Top barrier */
  let topBarrier = document.createElement("div");
  topBarrier.setAttribute("id", "top");
  topBarrier.setAttribute("class", "barrier");
  topBarrier.style = barrierStyle;
  topBarrier.style.top = "20px";
  topBarrier.style.left = "20px";
  topBarrier.style.width = "300px";
  topBarrier.style.height = "2px";

  /* Bottom barrier */
  let bottomBarrier = document.createElement("div");
  bottomBarrier.setAttribute("id", "bottom");
  bottomBarrier.setAttribute("class", "barrier");
  bottomBarrier.style = barrierStyle;
  bottomBarrier.style.top = "220px";
  bottomBarrier.style.left = "20px";
  bottomBarrier.style.width = "302px";
  bottomBarrier.style.height = "2px";

  maze.appendChild(thingie);
  maze.appendChild(home);
  maze.appendChild(topBarrier);
  maze.appendChild(bottomBarrier);

  mazeContainer.appendChild(maze);

  /* Controls */
  let controls = document.createElement("div");
  controls.style = "height: 100%; display: grid;";
  controls.setAttribute("id", "cbox");

  /* Buttons container */
  let buttonsContainer = document.createElement("div");
  buttonsContainer.setAttribute("id", "buttons");
  buttonsContainer.style.position = "absolute";
  buttonsContainer.style.width = "210px";
  buttonsContainer.style.height = "140px";
  buttonsContainer.style.alignSelf = "center";
  buttonsContainer.style.justifySelf = "center";
  buttonsContainer.style.display = "grid";
  buttonsContainer.style.gridTemplateRows = "70px 70px";
  buttonsContainer.style.gridTemplateColumns = "70px 70px 70px";

  /* Up button */
  let upButton = document.createElement("button");
  upButton.setAttribute("id", "up");
  upButton.style.width = "70px";
  upButton.style.height = "70px";
  upButton.style.borderRadius = "10px";
  upButton.style.background = "##7BCDD6";
  upButton.style.border = "1px solid #000";
  upButton.style.gridColumnStart = "2";
  upButton.innerHTML = '<div class="chevron">↑</div>';

  /* Left button */
  let leftButton = document.createElement("button");
  leftButton.setAttribute("id", "left");
  leftButton.style.width = "70px";
  leftButton.style.height = "70px";
  leftButton.style.borderRadius = "10px";
  leftButton.style.background = "##7BCDD6";
  leftButton.style.border = "1px solid #000";
  leftButton.style.gridColumnStart = "1";
  leftButton.style.gridRowStart = "2";
  leftButton.innerHTML = '<div class="chevron">←</div>';

  /* Right button */
  let rightButton = document.createElement("button");
  rightButton.setAttribute("id", "right");
  rightButton.style.width = "70px";
  rightButton.style.height = "70px";
  rightButton.style.borderRadius = "10px";
  rightButton.style.background = "##7BCDD6";
  rightButton.style.border = "1px solid #000";
  rightButton.style.gridColumnStart = "3";
  rightButton.style.gridRowStart = "2";
  rightButton.innerHTML = '<div class="chevron">→</div>';

  /* Down button */
  let downButton = document.createElement("button");
  downButton.setAttribute("id", "down");
  downButton.style.width = "70px";
  downButton.style.height = "70px";
  downButton.style.borderRadius = "10px";
  downButton.style.background = "##7BCDD6";
  downButton.style.border = "1px solid #000";
  downButton.style.gridColumnStart = "2";
  downButton.style.gridRowStart = "2";
  downButton.innerHTML = '<div class="chevron">↓</div>';

  buttonsContainer.appendChild(upButton);
  buttonsContainer.appendChild(leftButton);
  buttonsContainer.appendChild(rightButton);
  buttonsContainer.appendChild(downButton);

  controls.appendChild(buttonsContainer);

  contenedor.appendChild(mazeContainer);
  contenedor.appendChild(controls);

  buttonsActionsListener();

  //generate sides and starting position
  genSides();

  //generate maze
  genMaze(0, 0, 0);
  drawMaze();

  //get all the barriers
  const barriers = document.getElementsByClassName("barrier");
  for (let b = 0; b < barriers.length; b++) {
    nogoX.push(barriers[b].offsetLeft);
    nogoX2.push(barriers[b].offsetLeft + barriers[b].clientWidth);
    nogoY.push(barriers[b].offsetTop);
    nogoY2.push(barriers[b].offsetTop + barriers[b].clientHeight);
  }

  bu = document.getElementById("up");
  bd = document.getElementById("down");
  bl = document.getElementById("left");
  br = document.getElementById("right");

  bu.addEventListener("click", (e) => {
    up();
    firstMove = true;
  });

  bd.addEventListener("click", (e) => {
    down();
    firstMove = true;
  });

  bl.addEventListener("click", (e) => {
    left();
    firstMove = true;
  });

  br.addEventListener("click", (e) => {
    right();
    firstMove = true;
  });

  document.addEventListener("keydown", keys);
}

function buttonsActionsListener() {
  var buttons = document
    .getElementById("buttons")
    .getElementsByTagName("button");

  /* Add hover, focus and active actions listeners */
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("mouseover", function () {
      this.style.background = "#eee";
    });
    buttons[i].addEventListener("mouseout", function () {
      this.style.background = "#fff";
    });
    buttons[i].addEventListener("focus", function () {
      this.style.background = "#eee";
    });
    buttons[i].addEventListener("blur", function () {
      this.style.background = "#fff";
    });
    buttons[i].addEventListener("mousedown", function () {
      this.style.background = "#ddd";
    });
    buttons[i].addEventListener("mouseup", function () {
      this.style.background = "#eee";
    });
  }
}

//generate sides with random entry and exit points
function genSides() {
  let max = mazeHeight / step;
  let l1 = Math.floor(Math.random() * max) * step;
  //let l1 = 0;
  let l2 = mazeHeight - step - l1;
  //console.log(l1, l2);

  let lb1 = document.createElement("div");
  lb1.style.top = step + "px";
  lb1.style.left = step + "px";
  lb1.style.height = l1 + "px";

  let lb2 = document.createElement("div");
  lb2.style.top = l1 + step * 2 + "px";
  lb2.style.left = step + "px";
  lb2.style.height = l2 + "px";

  let rb1 = document.createElement("div");
  rb1.style.top = step + "px";
  rb1.style.left = mazeWidth + step + "px";
  rb1.style.height = l2 + "px";

  let rb2 = document.createElement("div");
  rb2.style.top = l2 + step * 2 + "px";
  rb2.style.left = mazeWidth + step + "px";
  rb2.style.height = l1 + "px";

  //create invisible barriers for start and end: vertical left, vertical right, left top, left bottom, right top, right bottom
  nogoX.push(0, mazeWidth + 2 * step, 0, 0, mazeWidth + step, mazeWidth + step);
  nogoX2.push(
    0 + bwidth,
    mazeWidth + 2 * step + bwidth,
    step,
    step,
    mazeWidth + 2 * step,
    mazeWidth + 2 * step
  );
  nogoY.push(
    l1 + step,
    l2 + step,
    l1 + step,
    l1 + 2 * step,
    l2 + step,
    l2 + 2 * step
  );
  nogoY2.push(
    l1 + 2 * step,
    l2 + 2 * step,
    l1 + step + bwidth,
    l1 + 2 * step + bwidth,
    l2 + step + bwidth,
    l2 + 2 * step + bwidth
  );
  //set start-pos
  thingie.style.top = l1 + step + "px";
  thingie.style.left = 0 + "px";
  //set end-pos & store height of end
  home.style.top = l2 + step + "px";
  home.style.left = mazeWidth + step + "px";

  //style & append
  let els = [lb1, lb2, rb1, rb2];
  for (let i = 0; i < els.length; i++) {
    confSideEl(els[i]);
    maze.appendChild(els[i]);
  }
}

function confSideEl(el) {
  el.setAttribute("class", "barrier");
  el.style.width = bwidth + "px";
}

//gen maze using Recursive Backtracking
function genMaze(cx, cy, s) {
  // shuffle unchecked directions
  let d = limShuffle(dirs, s);

  for (let i = 0; i < d.length; i++) {
    let nx = cx + modDir[d[i]].x;
    let ny = cy + modDir[d[i]].y;
    grid[cy][cx].v = 1;

    if (nx >= 0 && nx < mx && ny >= 0 && ny < my && grid[ny][nx].v === 0) {
      grid[cy][cx][d[i]] = 1;
      grid[ny][nx][modDir[d[i]].o] = 1;
      //avoid shuffling d if d's not exhausted.. hence the i
      genMaze(nx, ny, i);
    }
  }
}

//draw maze
function drawMaze() {
  for (let x = 0; x < mx; x++) {
    for (let y = 0; y < my; y++) {
      let l = grid[y][x].l;
      let r = grid[y][x].r;
      let u = grid[y][x].u;
      let d = grid[y][x].d;

      drawLines(x, y, l, r, u, d);
    }
  }
}

//draw the actual lines
function drawLines(x, y, l, r, u, d) {
  let top = (y + 1) * step;
  let left = (x + 1) * step;
  if (l === 0 && x > 0) {
    let el = document.createElement("div");
    el.style.left = left + "px";
    el.style.height = step + "px";
    el.style.top = top + "px";
    el.setAttribute("class", "barrier");
    el.style.width = bwidth + "px";
    maze.appendChild(el);
  }

  if (d === 0 && y < my - 1) {
    let el = document.createElement("div");
    el.style.left = left + "px";
    el.style.height = bwidth + "px";
    el.style.top = top + step + "px";
    el.setAttribute("class", "barrier");
    el.style.width = step + bwidth + "px";
    maze.appendChild(el);
  }
}

function limShuffle(array, s) {
  let con = array.slice(0, s);
  let ran = array.slice(s, array.length);

  for (let i = ran.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    //console.log(i, j);
    [ran[i], ran[j]] = [ran[j], ran[i]];
  }
  let comb = con.concat(ran);
  return comb;
}

function keys(e) {
  e.preventDefault();
  let code = e.code;
  switch (code) {
    //arrows
    case "ArrowUp":
      up();
      break;
    case "ArrowDown":
      down();
      break;
    case "ArrowLeft":
      left();
      break;
    case "ArrowRight":
      right();
      break;
  }
}

function up() {
  animKeys(bu);
  if (checkYboundry("u")) {
    thingie.style.top = thingie.offsetTop - step + "px";
  }
}

function down() {
  animKeys(bd);
  if (checkYboundry("d")) {
    thingie.style.top = thingie.offsetTop + step + "px";
  }
}

function left() {
  animKeys(bl);
  if (checkXboundry("l")) {
    thingie.style.left = thingie.offsetLeft - step + "px";
  }
}

function right() {
  animKeys(br);
  if (checkXboundry("r")) {
    thingie.style.left = thingie.offsetLeft + step + "px";
  }
}

function animKeys(key) {
  if (key.id === "up") {
    key.style.border = "3px #fff solid";
    key.style.borderTop = "1px #fff solid";
    key.style.borderBottom = "4px #fff solid";
    key.style.transform = "translateY(-2px)";
  }
  if (key.id === "down") {
    key.style.border = "3px #fff solid";
    key.style.borderBottom = "1px #fff solid";
    key.style.borderTop = "4px #fff solid";
    key.style.transform = "translateY(2px)";
  }
  if (key.id === "left") {
    key.style.border = "3px #fff solid";
    key.style.borderLeft = "1px #fff solid";
    key.style.borderRight = "4px #fff solid";
    key.style.transform = "translateX(-2px)";
  }
  if (key.id === "right") {
    key.style.border = "3px #fff solid";
    key.style.borderRight = "1px #fff solid";
    key.style.borderLeft = "4px #fff solid";
    key.style.transform = "translateX(2px)";
  }

  //reset
  setTimeout(() => {
    key.style.border = "1px #222 solid";
    key.style.borderTop = "1px #222 solid";
    key.style.borderBottom = "1px #222 solid";
    key.style.borderLeft = "1px #222 solid";
    key.style.borderRight = "1px #222 solid";
    key.style.transform = "translateY(0px)";
    key.style.transform = "translateX(0px)";
  }, "150");
}

//check if one can move horizontally
function checkXboundry(dir) {
  let x = thingie.offsetLeft;
  let y = thingie.offsetTop;
  let ok = [];
  let len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);

  let check = 0;
  for (let i = 0; i < len; i++) {
    check = 0;
    if (y < nogoY[i] || y > nogoY2[i] - size) {
      check = 1;
    }
    if (dir === "r") {
      if (x < nogoX[i] - size || x > nogoX2[i] - size) {
        check = 1;
      }
    }
    if (dir === "l") {
      if (x < nogoX[i] || x > nogoX2[i]) {
        check = 1;
      }
    }
    ok.push(check);
  }
  //check what to return
  let res = ok.every(function (e) {
    return e > 0;
  });
  return res;
}

//check if one can move vertically
function checkYboundry(dir) {
  let x = thingie.offsetLeft;
  let y = thingie.offsetTop;
  let ok = [];
  let len = Math.max(nogoX.length, nogoX2.length, nogoY.length, nogoY2.length);

  let check = 0;
  for (let i = 0; i < len; i++) {
    check = 0;
    if (x < nogoX[i] || x > nogoX2[i] - size) {
      check = 1;
    }
    if (dir === "u") {
      if (y < nogoY[i] || y > nogoY2[i]) {
        check = 1;
      }
    }
    if (dir === "d") {
      if (y < nogoY[i] - size || y > nogoY2[i] - size) {
        check = 1;
      }
    }
    ok.push(check);
  }
  //check what to return
  let res = ok.every(function (e) {
    return e > 0;
  });
  return res;
}
