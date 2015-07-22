function start() {//start按钮调用
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

function restart() {//restart按钮调用
    window.location.reload();
}

function help() {//help按钮调用
    $('#help-container').fadeIn(500);
}

function backtostart() {//help界面return按钮调用
    $('#help-container').fadeOut(500);
}

function quit() {//quit按钮调用
    alert("欢迎下次再来玩本游戏!");
    window.close();
}

