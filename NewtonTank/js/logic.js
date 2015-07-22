function randWind() {//随机生成风速风向
    if(Math.random() < 0.5){
        WindDirection = "left";
    }
    else {
        WindDirection = "right";
    }
    WindStrength = Math.round(Math.random() * 100);
    show_wind(WindStrength, WindDirection);
}

function getMoveObject() {//获取这回合要移动的对象即player1或player2的坦克
    moveObject = $('.player' + (Turn + 1));
    currentPos = parseInt(moveObject.css(leftOrRight[Turn]));
}

function subscribeKeyDown() {//注册keydown事件
    $(document).keydown(function (e) {
        if (e.keyCode == 13 && strengthtimer.length <= 0 && !enterlock) {//Enter：能量蓄力
            PlayerCanMove[0] = PlayerCanMove[1] = false;//蓄力期间禁止玩家移动
            strengthtimer.push(setInterval(function () {//设置能量条增长的动画
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
            lefttimer.push(setInterval(function () {//设置车子移动动画
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
            righttimer.push(setInterval(function () {//设置车子移动动画
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
        else if (e.keyCode == 87) {//W:up,增加炮台仰角
                currentAngle[Turn] += 5;
                currentAngle[Turn] = currentAngle[Turn] > 60 ? 60 : currentAngle[Turn];
                changeAngle(currentAngle[Turn], moveObject);
        }
        else if (e.keyCode == 83) {//S:down,减少炮台仰角
                currentAngle[Turn] -= 5;
                currentAngle[Turn] = currentAngle[Turn] < 30 ? 30 : currentAngle[Turn];
                changeAngle(currentAngle[Turn], moveObject);
       }
    });
}

function shoot() {//发射炮弹，主要获取炮弹的初始位置
    totaltime = 0;
    gravity = 1;
    //获取对面玩家坦克的位置，左上角，左下角，右上角，右下角的坐标
    el = document.getElementById('player' + (2 - Turn) + currentAngle[1 - Turn]);
    for (lx_right = 0, lx_top = 0; el != null; lx_right += el.offsetLeft, lx_top += el.offsetTop, el = el.offsetParent){;}
    lx_left = lx_right;
    lx_right += document.getElementById('player' + (2 - Turn) + currentAngle[1 - Turn]).offsetWidth;
    lx_bottom = lx_top + document.getElementById('player' + (2 - Turn) + currentAngle[1 - Turn]).offsetHeight;
    //获取并清除能量条
    GetPercentageOfBar = currentStrength;
    currentStrength = 0;
    changeStrength(currentStrength);
    //获取回合玩家的炮弹发射位置，player1的右上角和player2的左上角
    el = document.getElementById('player' + (Turn + 1) + currentAngle[Turn]);
    for (lx=0, ly=0; el != null; lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent){;}
    if (Turn == 0) {//这两段有与玩家的左右位置关系而有所不同进行修正
        lx += document.getElementById('player1' + currentAngle[0]).offsetWidth;
    }
    else {//17是炮弹的像素宽度
        lx -= 17;
    }
    //显示炮弹
    showBomb();
    //根据角度，力量风速计算炮弹速度
    speed_x = GetPercentageOfBar / 100 * Math.cos(currentAngle[Turn] * Math.PI / 180) * 1.3;   // the X speed
    speed_y = GetPercentageOfBar / 100 * Math.sin(currentAngle[Turn] * Math.PI / 180);
    if ((Turn == 0 && WindDirection == "right") || (Turn == 1 && WindDirection == "left")){
        speed_x *= (1 +  WindStrength / 500);
    }
    else {
        speed_x *= (1 - WindStrength / 500);
    }
    //播放炮弹声音
    $('#fire')[0].play();
    //播放动画，同时在hit中结算
    bombtimer.push(setInterval(hit, '2'));
}

function hit() {
    //计算袍断轨迹
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
    var mybullet;
    if (icebomb) {
        mybullet = document.getElementById('icebomb' + Turn);
    }
    else if (Turn == 0 && hasDoubledPlayer1 == true) {
        mybullet = document.getElementById('bigbomb0');
    }
    else if (Turn == 1 && hasDoubledPlayer2 == true) {
        mybullet = document.getElementById('bigbomb1');
    }
    else {
        mybullet = document.getElementById('bomb' + Turn);
    }
    mybullet.style.left = current_x + "px";
    mybullet.style.top = current_y + "px";
    //炮弹击中或落地进行回合结算
    var temp = [17, 0];
    if((current_x + temp[Turn] < lx_right && current_x + temp[Turn] > lx_left && (current_y + 17 < lx_bottom) && (current_y + 17 > lx_top))) {//击中目标
        randWind();//生成下回合风速
        $('#explosion')[0].play();//爆炸声音播放
        playBomb(current_x - temp[1 - Turn], current_y - temp[1 - Turn]);
        if((PlayerLife[1 - Turn] == 50) && ((Turn == 0 && hasDoubledPlayer1 == true) || (Turn == 1 && hasDoubledPlayer2 == true))) {//双倍弹打死对面
            changeLife(1 - Turn, 0);
            PlayerLife[1 - Turn] = 0;
            clearInterval(bombtimer.shift());
            gameover();
        }
        if(PlayerLife[1 - Turn] == 25) {//打死对面
            changeLife(1 - Turn, 0);
            PlayerLife[1 - Turn] = 0;
            clearInterval(bombtimer.shift());
            gameover();
        }
        else {//对面未死亡
            if (!icebomb) {//非冰弹，对面可以移动
                PlayerCanMove[1 - Turn] = true;
            }
            PlayerCanMove[Turn] = false;//玩家不能再移动
            //根据是不是双倍弹，改变生命值
            if(Turn == 0 && hasDoubledPlayer1 == true) {
                changeLife(1 - Turn, PlayerLife[1 - Turn] - 50);
                PlayerLife[1-Turn] -= 50;
            }
            if(Turn == 0 && hasDoubledPlayer1 == false) {
                changeLife(1 - Turn, PlayerLife[1 - Turn] - 25);
                PlayerLife[1 - Turn] -= 25;
            }
            if(Turn == 1 && hasDoubledPlayer2 == true) {
                changeLife(1 - Turn, PlayerLife[1 - Turn] - 50);
                PlayerLife[1 - Turn] -= 50;
            }
            if(Turn == 1 && hasDoubledPlayer2 == false) {
                changeLife(1 - Turn, PlayerLife[1 - Turn] - 25);
                PlayerLife[1 - Turn] -= 25;
            }
            //废除技能
            if(Turn == 0) {
                hasDoubledPlayer1 = false;
            }
            else {
                hasDoubledPlayer2 = false;
            }
            //切换玩家
            if((Turn == 0 && Dualedplayer1 != 1) || (Turn == 1 && Dualedplayer2 != 1)) {
                Turn = 1 - Turn;
            }
            //使用了双倍弹
            if(Dualedplayer2 != 0) {
                Dualedplayer2++;
            }
            if(Dualedplayer1 != 0) {
                Dualedplayer1++;
            }
            //获取下回合移动对象
            getMoveObject();
            //显示下回合玩家
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

function subscribeKeyUp() {//清除时钟，停止动画播放
    $(document).keyup(function (e) {
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
    });
}

function doubleplayer1() {//player1使用双倍炮弹技能
    if(Turn != 0 || Dualedplayer1 == 1 || Dualedplayer1 == 2 || hasDoubledPlayer1 == true) {
        return;
    }
    hasDoubledPlayer1 = true;
    document.getElementById('double-player1').setAttribute('class','double-player1-hide');
}

function doubleplayer2() {
    if(Turn != 1 || Dualedplayer2 == 1 || Dualedplayer2 == 2 || hasDoubledPlayer2 == true) {
        return;
    }
    hasDoubledPlayer2 = true;
    document.getElementById('double-player2').setAttribute('class','double-player2-hide');
}

function dualedplayer1() {//player1使用双发技能
    if(Turn != 0 || hasDoubledPlayer1 == true) {
        return;
    }
    Dualedplayer1 = 1;
    document.getElementById('dual-player1').setAttribute('class','dual-player1-hide');
}
function dualedplayer2() {
    if(Turn != 1 || hasDoubledPlayer2 == true) {
        return;
    }
    Dualedplayer2 = 1;
    document.getElementById('dual-player2').setAttribute('class','dual-player2-hide');
}

function iceplayer1() {//玩家1使用冰弹技能
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

