function addcard(item, listNum) {//card 是从json中获取的卡片对象，listNum是卡片要插入的列数
    var card = $('<li/>');
    card.attr('class', 'card-container');
    var img = $('<img/>');
    img.attr('alt', item.name);
    img.attr('src', "images/loading.gif");
    img.error(handleError.bind(img));
    img.load(function () {$(this).attr('src', "images/" + item.fileName);});
    card.append(img);
    console.log('this 1111');
    $($('.cards-list')[listNum]).append(card);
}

function preLoad(imgBuffer, item) {
    if (imgBuffer instanceof Array) {
        var card = $('<li/>');
        card.attr('class', 'card-container');
        var img = $('<img/>');
        img.attr('alt', item.name);
        img.attr('src', "images/loading.gif");
        img.error(handleError);
        img.load(function () {$(this).attr('src', "images/" + item.fileName);});
        card.append(img);
        imgBuffer.push(card);
    }
}

function handleError() {
     $(this).attr('src', 'wrong.jpg');
     $(this).unbind();
}
