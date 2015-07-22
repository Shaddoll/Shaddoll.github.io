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

function restart() {
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

