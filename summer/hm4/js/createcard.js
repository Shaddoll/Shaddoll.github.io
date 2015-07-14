function addcard(item, listNum) {//card 是从json中获取的卡片对象，listNum是卡片要插入的列数
    var card = $('<li/>');
    card.attr('class', 'card-container');
    var img = $('<img/>');
    img.attr('alt', item.name);
    img.attr('src', "images/" + item.fileName);
    img.error(function () {$(this).attr('src', 'images/2.jpg')});
    //img.error(function () {$(this).replaceWith('<p>图片加载失败 </p>')});
    card.append(img);
    $($('.cards-list')[listNum]).append(card);
}
