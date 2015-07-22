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
        $('.player' + (Turn + 1)).css('display', 'none');
        $('#player' + (Turn + 1) + currentAngle[Turn]).css('display', 'block');
    }
}

function show_wind(WindStrength, WindDirection) {
    if (WindDirection === "left") {
        $('#wind').css('background', 'url(images/windtoleft.png)');
    }
    else {
        $('#wind').css('background', 'url(images/windtoright.png)');
    }
    $('#wind').css('background-size', '100% 100%');
    $('#wind-strength').text(WindStrength);
}

function playBomb(x, y) {
    var img;
    if (icebomb) {
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

function showBomb() {
    var target;
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

function gameover() {
    $('#gameover-container').fadeIn(500);
    $('#backmusic')[0].pause();
    $('#dead')[0].play();
    $("#win-container").attr('class', 'win-position-show');
    document.getElementById("win-text").innerText = "Player" + (Turn + 1) + "Wins";
}

