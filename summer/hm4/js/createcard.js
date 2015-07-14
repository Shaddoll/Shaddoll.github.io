function addcard(item, listNum) {//card 是从json中获取的卡片对象，listNum是卡片要插入的列数
    var card = $('<li/>');
    card.attr('class', 'card-container');
    var img = $('<img/>');
    img.attr('alt', item.name);
    //img.attr('src', "images/" + item.fileName);
    img.attr('src', "images/loading.gif");
    img.error(function () {$(this).attr('src', 'wrong.jpg')});
    img.load(function () {$(this).attr('src', "images/" + item.fileName);});
    card.append(img);
    $($('.cards-list')[listNum]).append(card);
}
