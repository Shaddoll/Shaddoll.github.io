//全局变量
var cardNum = 12;//初始化页面载入的图片数
var preloadNum = cardNum;//预载入图片的编号
var currentCommentPage = 0;//查看大图评论时的当前评论页数
var locationX, locationY;//用户地理位置，X：经度，Y:纬度
var imgBuffer = [];//与载入图片缓冲区
var timerID = [];

//初始化页面
function init() {
    $.ajax({
        type: 'GET',
        url: 'https://raw.githubusercontent.com/Shaddoll/Shaddoll.github.io/master/cards.json',
        dataType: 'json',
        success: function (data){
            for(var i = 0; i < cardNum; ++i) {
                addcard(data[i],i % 4);
            }
            for (var i = 0; i < 8; ++i) {
                preLoad(imgBuffer, data[preloadNum + i]);
            }
            preloadNum += 8;
    }});
}
//点击小图查看大图
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
//隐藏大图
function hide () {
    var bigcard = $('#big-card');
    $('#big-card-img').empty();
    $('#card-dis').empty();
    $('#comment-info').empty();
    bigcard.fadeOut(500);
}
//查看下一页评论
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
                        author.html(data[i].comment[currentCommentPage].name + " <span class=\"date\">" + data[i].comment[currentCommentPage].date + "</span");
                        page.text("第" + (currentCommentPage + 1) + "页,共" + data[i].comment.length +"页");
                        break;
                    }
                }
            }
        }
    });
}
//查看上一页评论
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
                        author.html(data[i].comment[currentCommentPage].name + " <span class=\"date\">" + data[i].comment[currentCommentPage].date + "</span");
                        page.text("第" + (currentCommentPage + 1) + "页,共" + data[i].comment.length + "页");
                        break;
                    }
                }
            }
        }
    });
}
//获得用户地理位置
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
//计算两点间球面距离
function getDistance(locationX, locationY, x, y){
    var x1 = Math.cos(locationX / 180 * Math.PI) * Math.cos(locationY / 180 * Math.PI);
    var x2 = Math.cos(y / 180 * Math.PI) * Math.cos(x / 180 * Math.PI);
    var y1 = Math.cos(locationY / 180 * Math.PI) * Math.sin(locationX / 180 * Math.PI);
    var y2 = Math.cos(y / 180 * Math.PI) * Math.sin(x / 180 * Math.PI);
    var z1 = Math.sin(locationY / 180 * Math.PI);
    var z2 = Math.sin(y / 180 * Math.PI);
    var a = Math.acos(x1*x2 + y1*y2 + z1*z2);
    var d = a * 6371;
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
//载入页面时触发的事件
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
//滚动条下滚时触发的事件
window.onscroll = function () {
    var scrollTop = document.body.scrollTop;
    var scrollHeight = document.body.scrollHeight;
    var clientHeight = document.body.clientHeight;
    if (scrollTop >= scrollHeight - clientHeight - 3000) {
        $.ajax({
            type: 'GET',
            url: 'https://raw.githubusercontent.com/Shaddoll/Shaddoll.github.io/master/cards.json',
            dataType: 'json',
            success: function (data){
                for (var i = 0; i < 8 && preloadNum + i < data.length && imgBuffer.length < 24; ++i) {
                    preLoad(imgBuffer, data[preloadNum + i]);
                }
                preloadNum += i;
        }});
        timerID.push(setInterval(loadcard, 100));
    }
};

function loadcard() {
    var scrollTop = document.body.scrollTop;
    var scrollHeight = document.body.scrollHeight;
    var clientHeight = document.body.clientHeight;
    if (scrollTop >= scrollHeight - clientHeight - 1500 && imgBuffer.length > 0) {
        $($('.cards-list')[cardNum % 4]).append(imgBuffer.shift());
        ++cardNum;
    }
    else {
        for (var i = 0; i < timerID.length; ++i) {
            clearInterval(timerID[i]);
        }
    }
}
