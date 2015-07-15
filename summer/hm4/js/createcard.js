function addcard(item, listNum) {//card 是从json中获取的卡片对象，listNum是卡片要插入的列数
    var card = $('<li/>');
    card.attr('class', 'card-container');
    var img = $('<img/>');
    img.attr('alt', item.name);
    var loading = $('<img/>');
    loading.attr('src', 'images/' + item.fileName);
    loading.load(function (){
        if(this.complete) {
            img.css('background', '');
            img.css('min-height', '');
            img.attr('src', this.src);
        }
    });
    loading.error(function(){
        img.css('background', '');
        img.css('min-height', '');
        img.attr('src', 'wrong.jpg');
        $(this).unbind();
    });
    img.css('background', 'url(images/loading.gif) center top no-repeat');
    img.css('min-height', '100%');
    card.append(img);
    $($('.cards-list')[listNum]).append(card);
}

function preLoad(imgBuffer, item) {
    if (imgBuffer instanceof Array) {
        var card = $('<li/>');
        card.attr('class', 'card-container');
        var img = $('<img/>');
        img.attr('alt', item.name);
        var loading = $('<img/>');
        loading.attr('src', 'images/' + item.fileName);
        loading.load(function (){
            if(this.complete) {
                img.css('background', '');
                img.css('min-height', '');
                img.attr('src', this.src);
                $(this).unbind();
            }
        });
        loading.error(function () {
            img.css('background', '');
            img.css('min-height', '');
            img.attr('src', 'wrong.jpg');
        });
        img.css('background', 'url(images/loading.gif) center top no-repeat');
        img.css('min-height', '100%');
        card.append(img);
        imgBuffer.push(card);
    }
}
