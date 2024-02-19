let n = 10; // 格子数
let snake = [];
let body = new Set();
let color = "red";
let appleColor = "yellow";
let direction = 2;
let time = 0.3; // 移动速度，单位秒
let len = 0;
let empty = new Set();
let apple = [];

let getColumn = function (x, y) {
    let s = `<div class="column r${x} c${y}"></div>`;
    return s;
};

let getRow = function (x) {
    let s = `<div class="row r${x}">`;
    for (let i = 1; i <= n; i++) {
        s += getColumn(x, i);
    }
    s += "</div>";
    return s;
};

let getGrid = () => {
    let grid = document.querySelector(".grid");
    for (let i = 1; i <= n; i++) {
        grid.innerHTML += getRow(i);
    }
}

// 获取坐标为 (x, y) 的元素
let getElem = (x, y) => {
    return document.querySelector(`.r${x}.c${y}`);
};

// 将 (x, y) 修改颜色
let changeColor = (x, y) => {
    let cell = getElem(x, y);
    cell.style.backgroundColor = color;
};

// 恢复 (x, y) 的颜色
let coverColor = (x, y) => {
    let cell = getElem(x, y);
    cell.style.backgroundColor = "black";
};

let getKey = () => {
    document.onkeydown = function (e) {
        if (e.key == "ArrowUp") { direction = 1; }
        else if (e.key == "ArrowRight") { direction = 2; }
        else if (e.key == "ArrowDown") { direction = 3; }
        else if (e.key == "ArrowLeft") { direction = 4; }
    }
}

let next = () => {
    let [x, y, c] = snake[snake.length - 1];
    let [tx, ty] = [x, y];
    if (direction == 1) {
        tx--;
    }
    else if (direction == 2) {
        ty++;
    }
    else if (direction == 3) {
        tx++;
    }
    else if (direction == 4) {
        ty--;
    }
    if (tx == 0) tx = n;
    if (tx == n + 1) tx = 1;
    if (ty == 0) ty = n;
    if (ty == n + 1) ty = 1;
    if (snake.length > 1) {
        let [ttx, tty, ttc] = snake[snake.length - 2];
        if (ttx == tx && tty == ty) return null;
    }
    return [tx, ty];
};

let setAppleColor = () => {
    let cell = getElem(apple[0], apple[1]);
    cell.style.backgroundColor = appleColor;
}

let newApple = () => {
    let a = Array.from(empty);
    let [x, y] = a[Math.floor(Math.random() * a.length)].split(" ");
    apple = [x, y];
    setAppleColor();
}

// 判断是否吃到了
let eat = () => {
    let [x, y] = next();
    return (x + " " + y) == (apple[0] + " " + apple[1]);
};

// 添加节点
let add = () => {
    len++;
    if (snake.length == 0) {
        snake.unshift([Math.floor(n / 2) + 1, Math.floor(n / 2) + 1, 1]);
        changeColor(Math.floor(n / 2) + 1, Math.floor(n / 2) + 1);
        body.add(Math.floor(n / 2) + 1 + " " + Math.floor(n / 2) + 1);
        empty.delete(Math.floor(n / 2) + 1 + " " + Math.floor(n / 2) + 1);
    }
    else {
        snake[0][2]++;
    }
}

// 移动节点
let move = () => {
    let [x, y] = next();
    if (body.has(x + " " + y) || snake.length == n * n) return false;
    snake[0][2]--;
    snake.push([x, y, 1]);
    console.log(x, y);
    changeColor(x, y);
    body.add(x + " " + y);
    empty.delete(x + " " + y);
    if (snake[0][2] == 0) {
        coverColor(snake[0][0], snake[0][1]);
        body.delete(snake[0][0] + " " + snake[0][1]);
        snake.shift();
    }
    return true;
}

// 游戏逻辑
let game = () => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            empty.add(i + " " + j);
        }
    }
    add();
    newApple();
    let start = setInterval(() => {
        if (next() != null) {
            if (eat()) {
                add();
                newApple();
            }
            let status = move();
            if (status == false) {
                if (snake.length == n * n) {
                    alert("游戏胜利，太强啦！");
                }
                else {
                    alert("咬到自己啦，兄弟！你的得分为：" + len);
                }
                clearInterval(start);
            }
        }
    }, time * 1000);
};

let main = () => {
    // 获取图像
    getGrid();
    getKey();
    game();
};

let debug = () => {

};

export {
    main,
    debug
};