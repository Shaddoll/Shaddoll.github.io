//全局变量
var cardNum = 20;
var cards;
var currentShowCard = 1;
var currentCommentPage = 0;
var locationX, locationY;

function init() {
    $.ajax({
        type: 'GET',
        url: 'https://raw.githubusercontent.com/Shaddoll/Shaddoll.github.io/master/cards.json',
        dataType: 'json',
        success: function (data){
            for(var i = 0; i < cardNum; ++i) {
                cards = data;
                addcard(cards[i],i % 4);
            }}
    });
}

function show () {
    var bigcard = $('#big-card');
    bigcard.fadeIn(500);
    $('#big-card-img').append($(this).clone(true));
    var str = $(this).attr('src').substring(7);
    var comment = $('<p/>');
    var author = $('<h2/>');
    var dis = $('<p/>');
    var page = $('#pages');
    $.ajax({
        type: 'GET',
        url: 'https://raw.githubusercontent.com/Shaddoll/Shaddoll.github.io/master/cards.json',
        dataType: 'json',
        success: function (data){
            for(var i = 0; i < data.length;++i) {
                if (data[i].fileName === str) {
                    var d = getDistance(locationX, locationY, data[i].location.x, data[i].location.y);
                    dis.text("这张图片距离您" + d + "km.");
                    comment.text(data[i].comment[0].words);
                    //author.text(data[i].comment[0].name);
                    author.html(data[i].comment[0].name + " <span class=\"date\">" + data[i].comment[0].date + "</span");
                    page.text("第1页,共" + data[i].comment.length +"页");
                    currentCommentPage = 0;
                    break;
                }
            }}
    });
    $('#card-dis').append(dis);
    $('#comment-info').append(author);
    $('#comment-info').append($('<hr/>'));
    $('#comment-info').append(comment);
    $('#comment-info').append($('<hr/>'));
}

function hide () {
    var bigcard = $('#big-card');
    $('#big-card-img').empty();
    $('#card-dis').empty();
    $('#comment-info').empty();
    bigcard.fadeOut(500);
}

function next (e) {
    e.preventDefault();
    var str = $('#big-card-img img').attr('src').substring(7);
    var author = $('#comment-info h2');
    var comment = $('#comment-info p');
    var page = $('#pages');
    $.ajax({
        type: 'GET',
        url: 'https://raw.githubusercontent.com/Shaddoll/Shaddoll.github.io/master/cards.json',
        dataType: 'json',
        success: function (data) {
            for(var i = 0; i < data.length; ++i) {
                if (data[i].fileName === str) {
                    if (currentCommentPage < data[i].comment.length - 1) {
                        ++currentCommentPage;
                        comment.text(data[i].comment[currentCommentPage].words);
                        //author.text(data[i].comment[currentCommentPage].name);
                        author.html(data[i].comment[currentCommentPage].name + " <span class=\"date\">" + data[i].comment[currentCommentPage].date + "</span");
                        page.text("第" + (currentCommentPage + 1) + "页,共" + data[i].comment.length +"页");
                        break;
                    }
                }
            }
        }
    });
}

function back (e) {
    e.preventDefault();
    var str = $('#big-card-img img').attr('src').substring(7);
    var author = $('#comment-info h2');
    var comment = $('#comment-info p');
    var page = $('#pages');
    $.ajax({
        type: 'GET',
        url: 'https://raw.githubusercontent.com/Shaddoll/Shaddoll.github.io/master/cards.json',
        dataType: 'json',
        success: function (data) {
            for(var i = 0; i < data.length; ++i) {
                if (data[i].fileName === str) {
                    if (currentCommentPage > 0) {
                        --currentCommentPage;
                        comment.text(data[i].comment[currentCommentPage].words);
                        //author.text(data[i].comment[currentCommentPage].name);
                        author.html(data[i].comment[currentCommentPage].name + " <span class=\"date\">" + data[i].comment[currentCommentPage].date + "</span");
                        page.text("第" + (currentCommentPage + 1) + "页,共" + data[i].comment.length + "页");
                        break;
                    }
                }
            }
        }
    });
}

function getLocation () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else {
        alert("Geolocation is nor supported by the borwser.");
    }
}

function showPosition (position) {
    locationY = position.coords.latitude;
    locationX = position.coords.longitude;
}

function getDistance(locationX, locationY, x, y){
    var x1 = Math.cos(locationX) * Math.cos(locationY);
    var x2 = Math.cos(y) * Math.cos(x);
    var y1 = Math.cos(locationY) * Math.sin(locationX);
    var y2 = Math.cos(y) * Math.sin(x);
    var z1 = Math.sin(locationY);
    var z2 = Math.sin(y);
    var a = Math.acos(x1*x2 + y1*y2 + z1*z2);
    var d = a / 180 * Math.PI * 6371;
    return d;
}

function showError (error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
        case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
    }
}

window.onload = function () {
    init();
    $('.cards-table').on('click', 'img', show);
    $('#big-card-img').on('click', hide);
    $('#back').on('click', back);
    $('#next').on('click', next);
    $(document).on({
        ajaxStop: function() {$('#header').css('display', 'none');}
    });
    getLocation();
};

window.onscroll = function () {
    var scrollTop = document.body.scrollTop;
    var scrollHeight = document.body.scrollHeight;
    var clientHeight = document.body.clientHeight;
    if (scrollTop >= scrollHeight - clientHeight - 3000) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(event) {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0) {
                    //这里在实际中应该通过后台程序根据cardNum获取特定的数据，而不是全部获取，但是目前没学后台就先这样吧
                    cards = eval('(' + xhr.responseText + ')');
                }
                else {
                    console.log("Request was unsuccessful:" + xhr.status);
                }
            }
        }
        xhr.open('GET', 'https://raw.githubusercontent.com/Shaddoll/Shaddoll.github.io/master/cards.json', true);
        xhr.send(null);


        addcard(cards[cardNum], cardNum % 4);
        ++cardNum;
    }
};
