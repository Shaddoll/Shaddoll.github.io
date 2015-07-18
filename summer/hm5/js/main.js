var myName = "";
var myNamePath = "";
var messageref = new Firebase('https://intense-fire-9688.firebaseio.com/messages');
var userref = new Firebase('https://intense-fire-9688.firebaseio.com/users');

function login() {
    var str = $('#login form input').val();
    userref.once("value", function (snapshot) {
        var users = snapshot.val();
        var sameName = false;
        var usersName = [];
        for (var i in users) {
            usersName.push(users[i].name);
            if (str === users[i].name) {
                sameName = true;
                break;
            }
        }
        if (sameName) {
            alert("Your name is conflicted with some other user. Please change another name.");
        }
        else {
            myName = str;
            myNamePath = userref.push({name: str}).toString();
           /* usersName.push(str);
            var ul = $('#users-list');
            for (i = 0; i < usersName.length; ++i) {
                var li = $('<li class=\'list-item\'/>');
                li.text(usersName[i]);
                ul.append(li);
            }*/
            $('#login').css('display', 'none');
            $('#container').css('display', 'block');
            $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
        }
    });
}

function logout() {
    var ref = new Firebase(myNamePath);
    ref.remove();
}

window.onbeforeunload = logout;

function subscribeSendMessage() {
    $('#input-text').on('keypress', function (event) {
        if (event.keyCode == 13 && !event.ctrlKey) {//User press Enter
            event.preventDefault();
            messageref.push({sender: myName, message: $(this).val()});
            $(this).val('');
        }
    });
}

function subscribeRetrieveMessage() {
    messageref.on('child_added', function (snapshot) {
        var data = snapshot.val();
        var user = data.sender;
        var message = data.message.replace('\n', '<br/>');
        var messageElement = $('<li/>');
        var divElement = $('<div/>');
        var userElement = $('<strong/>');
        var messagesList = $('#messages-list');
        userElement.text(user + ': ');
        divElement.html('<div id=\'user-message\'>' + message + '</div>').prepend(userElement);
        messageElement.append(divElement);
        messagesList.append(messageElement);
        $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
    });
}

function subscribeRetrieveUser() {
    userref.on('child_added', function (snapshot) {
        var data = snapshot.val();
        var user = data.name;
        var ul = $('#users-list');
        var li = $('<li class=\'list-item\'/>');
        li.text(user);
        ul.append(li);
    });
    userref.on('child_removed', function (snapshot) {
        var data = snapshot.val();
        var user = data.name;
        var li = $('.list-item');
        for (var i = 0; i < li.length; ++i) {
            if (user === $(li[i]).text()) {
                $(li[i]).remove();
                break;
            }
        }
    });
}

window.onload = function () {
    subscribeSendMessage();
    subscribeRetrieveMessage();
    subscribeRetrieveUser();
}
