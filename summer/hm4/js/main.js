//全局变量
var cardNum = 20;
var cards;
var currentCommentPage = 0;

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
    bigcard.css('display', 'block');
    $('#big-card-img').append($(this).clone(true));
    var str = $(this).attr('src').substring(7);
    var comment = $('<p/>');
    var author = $('<h2/>');
    $.ajax({
        type: 'GET',
        url: 'https://raw.githubusercontent.com/Shaddoll/Shaddoll.github.io/master/cards.json',
        dataType: 'json',
        success: function (data){
            for(var i = 0; i < data.length;++i) {
                if (data[i].fileName === str) {
                    comment.text(data[i].comment[0].words);
                    author.text(data[i].comment[0].name);
                    currentCommentPage = 0;
                }
            }}
    });
    $('#comment-info').append(author);
    $('#comment-info').append(comment);
}

function hide () {
    var bigcard = $('#big-card');
    $('#big-card-img').empty();
    $('#comment-info').empty();
    bigcard.css('display', 'none');
}

function next (e) {
    e.preventDefault();
    var str = $('#big-card-img img').attr('src').substring(7);
    var author = $('#comment-info h2');
    var comment = $('#comment-info p');
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
                        author.text(data[i].comment[currentCommentPage].name);
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
                        author.text(data[i].comment[currentCommentPage].name);
                        break;
                    }
                }
            }
        }
    });

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
