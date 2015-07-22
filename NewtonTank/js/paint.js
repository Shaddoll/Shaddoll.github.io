function changeLife(playerid, life) {//改变玩家的生命值，playerid为0，1
    if (typeof playerid === "number" && playerid == 0 || playerid == 1) {
        if (typeof life === "number" && life <= 100) {
            if (life < 0) {
                life = 0;
            }
            $('#life-player' + (playerid + 1)).css('width', life + '%');
        }
    }
}

function changeStrength(strength) {//改变能量条
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

function changePosition(position, leftOrRight, moveObject){//改变位置，position是left火right的距离，leftorright是left或right属性，moveobject是player1或player2的DOM对象
    if (typeof position === "number" && (leftOrRight === "left" || leftOrRight === "right")) {
        moveObject.css(leftOrRight, position + "px");
    }
}

function changeAngle(angle, moveObject) {//改变炮台角度
    if (typeof angle === "number") {
        $('.player' + (Turn + 1)).css('display', 'none');
        $('#player' + (Turn + 1) + currentAngle[Turn]).css('display', 'block');
    }
}

function show_wind(WindStrength, WindDirection) {//改变风速显示
    if (WindDirection === "left") {
        $('#wind').css('background', 'url(images/windtoleft.png)');
    }
    else {
        $('#wind').css('background', 'url(images/windtoright.png)');
    }
    $('#wind').css('background-size', '100% 100%');
    $('#wind-strength').text(WindStrength);
}

function playBomb(x, y) {//播放爆炸特效
    var img;
    if (icebomb) {//冰弹有自己的特效
        img = icebombGif;
    }
    else {
        img = bombGif;
    }
    img.css('position', 'absolute');
    img.css('left', x + 'px');
    img.css('top', y + 'px');
    $('body').append(img);
    setTimeout(function () {
        img.remove();
    } , '900');
}

function showBomb() {//显示炮弹
    var target;//要展示炮弹的种类
    if (hasDoubledPlayer1) {
        target = $('#bigbomb0');
    }
    else if (hasDoubledPlayer2) {
        target = $('#bigbomb1');
    }
    else if (icebomb) {
        if (Turn == 0) {
            target = $('#icebomb0');
        }
        else if (Turn == 1) {
            target = $('#icebomb1');
        }
    }
    else {
        target = $('#bomb' + Turn);
    }
    target.attr('class', 'bullet-show');
}

function gameover() {//游戏结束画面显示
    $('#gameover-container').fadeIn(500);
    $('#backmusic')[0].pause();
    $('#dead')[0].play();
    $("#win-container").attr('class', 'win-position-show');
    document.getElementById("win-text").innerText = "Player" + (Turn + 1) + "Wins";
}

