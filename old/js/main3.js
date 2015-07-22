function changeLife(playerid, life) {
    if (typeof playerid === "number" && playerid == 0 || playerid == 1) {
        if (typeof life === "number" && life <= 100) {
            if (life < 0) {
                life = 0;
            }
            $('#life-player' + (playerid + 1)).css('width', life + '%');
        }
    }
}

function changeStrength(strength) {
    if (typeof strength === "number") {
        if (strength > 100) {
            strength = 100;
        }
        else if (strength < 0) {
            strength = 0;
        }
        $('#current-strength').css('width', strength + '%');
    }
}

function changePosition(position, leftOrRight, moveObject){
    if (typeof position === "number" && (leftOrRight === "left" || leftOrRight === "right")) {
        moveObject.css(leftOrRight, position + "px");
    }
}

function changeAngle(angle, moveObject) {
    if (typeof angle === "number") {
        $('#player' + (Turn + 1)).css('background', 'url(tank/tank' + Turn + angle + '.png)');
        $('#player' + (Turn + 1)).css('background-size', '100% 100%');
    }
}

function show_wind(WindStrength, WindDirection) {
    if (WindDirection === "left") {
        $('#wind').css('background', 'url(windtoleft.png)');
    }
    else {
        $('#wind').css('background', 'url(windtoright.png)');
    }
    $('#wind').css('background-size', '100% 100%');
    $('#wind-strength').text(WindStrength);
}

function randWind() {
    if(Math.random()<0.5){
        WindDirection = "left";
    }
    else {
        WindDirection = "right";
    }
    WindStrength = Math.round(Math.random() * 100);
    show_wind(WindStrength, WindDirection);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function getMoveObject() {
    moveObject = $('#player' + (Turn + 1));
    currentPos = parseInt(moveObject.css(leftOrRight[Turn]));
}

function playBomb(x, y) {
    var img = $('<img/>');
    if (icebomb) {
        img.attr('src', 'icebomb.gif');
    }
    else {
        img.attr('src', 'bomb.gif');
    }
    img.css('position', 'absolute');
    img.css('left', x + 'px');
    img.css('top', y + 'px');
    $('body').append(img);
    setTimeout(function () {
        img.remove();
    } , '900');
}

function start() {
    PlayerLife[0] = PlayerLife[1] = 100;
    Turn = 0;
    $('.start').fadeOut(500);
    $('#win-container').css('display', 'table');
    $('#backmusic')[0].play();
    randWind();
    getMoveObject();
    subscribeKeyDown();
    subscribeKeyUp();
}

function restart() {//还没写好
    window.location.reload();
}

function help() {
    $('#help-container').fadeIn(500);
}

function backtostart() {
    $('#help-container').fadeOut(500);
}

function quit() {
    alert("欢迎下次再来玩本游戏!");
    window.close();
}

function gameover() {
    $('#gameover-container').fadeIn(500);
    $('#backmusic')[0].pause();
    $('#dead')[0].play();
    $("#win-container").attr('class', 'win-position-show');
    document.getElementById("win-text").innerText = "Player" + (Turn + 1) + "Wins";
}

function subscribeKeyDown() {
    $(document).keydown(function (e) {
        if (e.keyCode == 13 && strengthtimer.length <= 0 && !enterlock) {
            PlayerCanMove[0] = PlayerCanMove[1] = false;
            strengthtimer.push(setInterval(function () {
                if (boolIncrease) {
                    currentStrength += 1;
                    if (currentStrength >= 100) {
                        boolIncrease = false;
                    }
                    changeStrength(currentStrength);
                }
                else {
                    currentStrength -= 1;
                    if (currentStrength <= 0) {
                        boolIncrease = true;
                    }
                    changeStrength(currentStrength);
                }
            }, '25'));
        }
        else if (e.keyCode == 65 && lefttimer.length <= 0) {//A:Left
            lefttimer.push(setInterval(function () {
                if (PlayerCanMove[0]) {
                    currentPos -= 1;
                    currentPos = currentPos > 0 ? currentPos : 0;
                    changePosition(currentPos, leftOrRight[0], moveObject);
                }
                else if (PlayerCanMove[1]) {
                    currentPos += 1;
                    var islandWidth = parseInt($('#second-island').css('width'));
                    var carWidth = parseInt(moveObject.css('width'));
                    var border = islandWidth - carWidth;
                    currentPos = currentPos < border ? currentPos : border;
                    changePosition(currentPos, leftOrRight[1], moveObject);
                }
            }, '10'));
        }
        else if (e.keyCode == 68 && righttimer.length <= 0) {//D:Right
            righttimer.push(setInterval(function () {
                if (PlayerCanMove[0]) {
                    currentPos += 1;
                    var islandWidth = parseInt($('#first-island').css('width'));
                    var carWidth = parseInt(moveObject.css('width'));
                    var border = islandWidth - carWidth;
                    currentPos = currentPos < border ? currentPos : border;
                    changePosition(currentPos, leftOrRight[0], moveObject);
                }
                else if (PlayerCanMove[1]) {
                    currentPos -= 1;
                    currentPos = currentPos > 0 ? currentPos : 0;
                    changePosition(currentPos, leftOrRight[1], moveObject);
                }
            }, '10'));
        }
        else if (e.keyCode == 87 && uptimer.length <= 0) {//W:up
                currentAngle[Turn] += 5;
                currentAngle[Turn] = currentAngle[Turn] > 60 ? 60 : currentAngle[Turn];
                changeAngle(currentAngle[Turn], moveObject);
        }
        else if (e.keyCode == 83 && downtimer.length <= 0) {//S:down
                currentAngle[Turn] -= 5;
                currentAngle[Turn] = currentAngle[Turn] < 30 ? 30 : currentAngle[Turn];
                changeAngle(currentAngle[Turn], moveObject);
       }
    });
}


function shoot() {
    totaltime = 0;
    gravity = 1;
    el = document.getElementById('player' + (2 - Turn));
    for (lx_right=0, lx_top=0; el != null; lx_right += el.offsetLeft, lx_top += el.offsetTop, el = el.offsetParent){;}
    lx_left = lx_right;
    lx_right+=document.getElementById('player' + (2 - Turn)).offsetWidth;
    lx_bottom = lx_top + document.getElementById('player' + (2 - Turn)).offsetHeight;
    GetPercentageOfBar = currentStrength;
    currentStrength = 0;
    changeStrength(currentStrength);
    el = document.getElementById('player' + (Turn + 1));
    for (lx=0, ly=0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent){;}
    if (Turn == 0) {
        lx += document.getElementById('player1').offsetWidth;
    }
    else {
        lx -= 17;
    }
    showBomb();
    speed_x = GetPercentageOfBar / 100 * Math.cos(currentAngle[Turn] * Math.PI / 180) * 1.3;   // the X speed
    speed_y = GetPercentageOfBar / 100 * Math.sin(currentAngle[Turn] * Math.PI / 180);
    if ((Turn == 0 && WindDirection == "right") || (Turn == 1 && WindDirection == "left")){
        speed_x *= (1 +  WindStrength / 500);
    }
    else {
        speed_x *= (1 - WindStrength / 500);
    }
    $('#fire')[0].play();
    bombtimer.push(setInterval(hit, '2'));
}

function hit() {
    gravity = 0.0005;
    current_speed_y = speed_y - gravity *totaltime;
    totaltime += 2;
    if (Turn == 0) {
        current_x = lx + totaltime * speed_x;
    }
    else {
        current_x = lx - totaltime * speed_x;
    }
    current_y = ly - (speed_y + current_speed_y) / 2 * totaltime;
    var mybullet = document.getElementById('bullet');
    mybullet.style.left = current_x + "px";
    mybullet.style.top = current_y + "px";
    var temp = [17, 0];
    if((current_x + temp[Turn] < lx_right && current_x + temp[Turn] > lx_left && (current_y + 17 < lx_bottom) && (current_y + 17 > lx_top))) {//击中目标
        randWind();
        $('#explosion')[0].play();
        playBomb(current_x - temp[1 - Turn], current_y - temp[1 - Turn]);
        if((PlayerLife[1 - Turn] == 50) && ((Turn == 0 && hasDoubledPlayer1 == true) || (Turn == 1 && hasDoubledPlayer2 == true))) {//已经打死对面
            changeLife(1 - Turn, 0);
            PlayerLife[1 - Turn] = 0;
            clearInterval(bombtimer.shift());
            gameover();
        }
        if(PlayerLife[1 - Turn] == 25) {//已经打死对面
            changeLife(1 - Turn, 0);
            PlayerLife[1 - Turn] = 0;
            clearInterval(bombtimer.shift());
            gameover();
        }
        else {//对面未死亡
            if (!icebomb) {
                PlayerCanMove[1 - Turn] = true;
            }
            //PlayerCanMove[1 - Turn] = true;
            PlayerCanMove[Turn] = false;
            if(Turn==0&&hasDoubledPlayer1==true)
            {
                changeLife(1 - Turn, PlayerLife[1 - Turn] - 50);
                PlayerLife[1-Turn]-=50;
            }
            if(Turn==0&&hasDoubledPlayer1==false)
            {
                changeLife(1 - Turn, PlayerLife[1 - Turn] - 25);
                PlayerLife[1-Turn]-=25;
            }
            if(Turn==1&&hasDoubledPlayer2==true)
            {
                changeLife(1 - Turn, PlayerLife[1 - Turn] - 50);
                PlayerLife[1-Turn]-=50;
            }
            if(Turn==1&&hasDoubledPlayer2==false)
            {
                changeLife(1 - Turn, PlayerLife[1 - Turn] - 25);
                PlayerLife[1-Turn]-=25;
            }
            if(Turn==0) {
                hasDoubledPlayer1 = false;
            }
            else {
                hasDoubledPlayer2 = false;
            }
            if((Turn==0&&Dualedplayer1!=1)||(Turn==1&&Dualedplayer2!=1)) {
                Turn = 1 - Turn;
            }
            if(Dualedplayer2!=0) {
                Dualedplayer2++;
            }
            if(Dualedplayer1!=0) {
                Dualedplayer1++;
            }
            getMoveObject();
            $("#win-container").attr('class', 'win-position-show');
            document.getElementById("win-text").innerText = "Player" + (Turn + 1) + "'s Turn";
            clearInterval(bombtimer.shift());
            enterlock = false;
        }
        mybullet.setAttribute('class', 'bullet-hide');
        icebomb = false;
    }
    else if((current_y / screen.availHeight > 0.87) || (current_x > screen.width) || current_x < 0) {//未打中目标
        randWind();
        PlayerCanMove[1 - Turn] = true;
        PlayerCanMove[Turn] = false;
        if((Turn == 0 && Dualedplayer1 != 1) || (Turn == 1 && Dualedplayer2 != 1)) {
            Turn = 1 - Turn;
        }
        if(Dualedplayer2 != 0) {
            Dualedplayer2++;
        }
        if(Dualedplayer1 != 0) {
            Dualedplayer1++;
        }
        getMoveObject();
        mybullet.setAttribute('class', 'bullet-hide');
        $("#win-container").attr('class', 'win-position-show');
        document.getElementById("win-text").innerText = "Player" + (Turn + 1) + "'s Turn";
        hasDoubledPlayer2 = hasDoubledPlayer1 = false;
        clearInterval(bombtimer.shift());
        enterlock = false;
        icebomb = false;
    }
}

function subscribeKeyUp() {
    $(document).keyup(function (e) {//我觉得应该在回调函数里来执行Shoot函数已经对装填进行更新
        if (e.keyCode == 13 && !enterlock) {
            while (strengthtimer.length > 0) {
                clearInterval(strengthtimer.shift());
            }
            enterlock = true;
            shoot();
        }
        else if (e.keyCode == 65) {//A:left
            while (lefttimer.length > 0) {
                clearInterval(lefttimer.shift());
            }
        }
        else if (e.keyCode == 68) {//D:right
            while (righttimer.length > 0) {
                clearInterval(righttimer.shift());
            }
        }
        else if (e.keyCode == 87) {//W:up
            while (uptimer.length > 0) {
                clearInterval(uptimer.shift());
            }
        }
        else if (e.keyCode == 83) {//S:down
            while (downtimer.length > 0) {
                clearInterval(downtimer.shift());
            }
        }
    });
}
function doubleplayer1()
{
    if(Turn != 0 || Dualedplayer1 == 1 || Dualedplayer1 == 2 || hasDoubledPlayer1 == true) {
        return;
    }
    hasDoubledPlayer1 = true;
    document.getElementById('double-player1').setAttribute('class','double-player1-hide');
}
function doubleplayer2()
{
    if(Turn != 1 || Dualedplayer2 == 1 || Dualedplayer2 == 2 || hasDoubledPlayer2 == true) {
        return;
    }
    hasDoubledPlayer2 = true;
    document.getElementById('double-player2').setAttribute('class','double-player2-hide');
}

function dualedplayer1()
{
    if(Turn != 0 || hasDoubledPlayer1 == true) {
        return;
    }
    Dualedplayer1 = 1;
    document.getElementById('dual-player1').setAttribute('class','dual-player1-hide');
}
function dualedplayer2()
{
    if(Turn != 1 || hasDoubledPlayer2 == true) {
        return;
    }
    Dualedplayer2 = 1;
    document.getElementById('dual-player2').setAttribute('class','dual-player2-hide');
}

function iceplayer1() {
    if (Turn != 0 || hasDoubledPlayer1 == true || Dualedplayer1 == 1 || Dualedplayer1 == 2) {
        return;
    }
    icebomb = true;
    $('#ice-player1').attr('class', 'ice-player1-hide');
}

function iceplayer2() {
    if (Turn != 1 || hasDoubledPlayer2 == true || Dualedplayer2 == 1 || Dualedplayer2 == 2) {
        return;
    }
    icebomb = true;
    $('#ice-player2').attr('class', 'ice-player2-hide');
}

var Turn = -1;
var GameEnds = false;
var PlayerWins = [false, false];
var WindStrength = 100;
var WindDirection = "left";//Or "right";
var PlayerLife = [100, 100];
var PlayerCanMove = [true, false];
var Dualedplayer1 = 0;
var Dualedplayer2 = 0;
var boolIncrease = true;//能量条是增长还是下降
var currentStrength = 0;//当前能量条的能量
var moveObject;//要移动的jquery对象
var currentPos;//对象当前的位置，以像素为单位
var currentAngle = [45, 45];//对象当前炮筒的仰角
var leftOrRight = ["left", "right"];//对象是靠左还是靠右的，对应css的left或right属性
var strengthtimer = [];
var lefttimer = [];
var righttimer = [];
var uptimer = [];
var downtimer = [];
var bombtimer = [];
var hasDoubledPlayer1 = false;
var hasDoubledPlayer2 = false;
var lx = 0;
var totaltime = 0;
var ly = 0;
var gravity = 1;
var GetPercentageOfBar;
var lx_right;
var lx_left;
var lx_top;
var lx_bottom;
var speed_x;
var speed_y;
var enterlock = false;
var icebomb = false;

window.onload = function () {
    $('#start').click(start);
    $('#restart').click(restart);
    $('#help').click(help);
    $('#help2').click(help);
    $('#quit').click(quit);
    $('#quit2').click(quit);
    $('#help-button').click(backtostart);
};

function showBomb(x, y) {
    if (hasDoubledPlayer1) {
        $('#bullet').css('background', 'url(bigbomb0.png)');
    }
    else if (hasDoubledPlayer2) {
        $('#bullet').css('background', 'url(bigbomb1.png)');
    }
    else if (icebomb) {
        if (Turn == 0) {
            $('#bullet').css('background', 'url(icebomb0.png)');
        }
        else if (Turn == 1) {
            $('#bullet').css('background', 'url(icebomb1.png)');
        }
    }
    else {
        $('#bullet').css('background', 'url(bomb' + Turn + '.png)');
    }
    $('#bullet').css('background-size', '100% 100%');
    $('#bullet').css('left', x + 'px');
    $('#bullet').css('top', y + 'px');
    $('#bullet').attr('class', 'bullet-show');
}
