var myName = "";//用户的名字
var myNamePath = "";//用户的名字在数据库中的存储url
var myRoom = 1;//用户所在房间，默认进入1号房
var myRoomPath = "";//用户的名字在数据库中的房间的存储url
var userref = new Firebase('https://intense-fire-9688.firebaseio.com/users');//用户数据库引用
var messageref = [];//不同房间的消息引用
var roomref = [];//不同房间的用户引用
var disconnectRoomRef, disconnectNameRef;//断线事件引用

function login() {//登录函数
    var str = $('#form-input input').val();
    if (str == "") {
        alert("You must input a name!");
        return;
    }
    else if (str.length > 16) {
        alert("Your name is too long!");
        return;
    }
    userref.once("value", function (snapshot) {//获取所有在线用户裂变，在回调函数里判断登录是否成功
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
            myRoomPath = roomref[1].push({name: str}).toString();
            subscribeDisconnect();
            $('#login').css('display', 'none');
            $('#container').css('display', 'block');
            $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
        }
    }, function (err) {
        if (err) {
            console.log("Could not get the user data", err);
        }
    });
}

function logout() {//登出函数，删除数据库中的用户名字信息
    if (myRoomPath) {
        ref = new Firebase(myRoomPath);
        ref.remove(function (err) {
            if (err) {
                console.log("Could not remove user", err);
            }
        });
    }
    if (myNamePath) {
        var ref = new Firebase(myNamePath);
        ref.remove(function (err) {
            if (err) {
                console.log("Could not remove user in the room", err);
            }
        });
    }
    alert('logout!');
}

window.onbeforeunload = logout;

function subscribeSendMessage() {//监听发送信息事件
    $('#input-text').on('keypress', function (event) {
        if (event.keyCode == 13 && !event.ctrlKey) {//User press Enter
            event.preventDefault();
            messageref[myRoom].push({sender: myName, message: $(this).val()});
            $(this).val('');
        }
    });
}

function subscribeRetrieveMessage() {//监听获取信息事件
    messageref[myRoom] = new Firebase('https://intense-fire-9688.firebaseio.com/messages/' + myRoom);
    messageref[myRoom].on('child_added', function (snapshot) {
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
    }, function (err) {
        if (err) {
            console.log("Could not retrieve message", err);
        }
    });
}

function subscribeRetrieveUser() {//监听用户登录、登出事件
    roomref[myRoom] = new Firebase('https://intense-fire-9688.firebaseio.com/rooms/' + myRoom);
    roomref[myRoom].on('child_added', function (snapshot) {//有新用户进入此房间
        var data = snapshot.val();
        var user = data.name;
        var ul = $('#users-list');
        var li = $('<li class=\'list-item\'/>');
        li.text(user);
        ul.append(li);
    }, function (err) {
        if (err) {
            console.log("Could not retrieve users", err);
        }
    });
    roomref[myRoom].on('child_removed', function (snapshot) {//有用户离开此房间
        var data = snapshot.val();
        var user = data.name;
        var li = $('.list-item');
        for (var i = 0; i < li.length; ++i) {
            if (user === $(li[i]).text()) {
                $(li[i]).remove();
                break;
            }
        }
    }, function (err) {
        if (err) {
            console.log("Could not update users", err);
        }
    });
}

function subscribeChooseRoom() {//监听选择房间事件
    $('#rooms').on('click', '.room', function () {
        roomId = +$(this).attr('id');
        if (myRoom != roomId) {
            var ref = new Firebase(myRoomPath);
            ref.remove();
            $('#' + myRoom).css('background', 'rgb(255,255,255)');
            $(this).css('background', 'rgb(228, 227, 228)');
            messageref[myRoom].off();
            roomref[myRoom].off();
            myRoom = roomId;
            $('#users-list').empty();
            $('#messages-list').empty();
            $('#header h4').text($('#' + myRoom).text());
            subscribeRetrieveUser();
            subscribeRetrieveMessage();
            disconnectRoomRef.onDisconnect().cancel();
            disconnectNameRef.onDisconnect().cancel();
            subscribeDisconnect();
            myRoomPath = roomref[myRoom].push({name: myName}).toString();
        }
    });
}

function subscribeDisconnect() {//监听断线事件函数
    disconnectRoomRef = new Firebase(myRoomPath);
    disconnectNameRef = new Firebase(myNamePath);
    disconnectRoomRef.onDisconnect().remove(function (err) {
        if(err) {
            console.log("Could not establish onDisconnect event", err);
        }
    });
    disconnectNameRef.onDisconnect().remove(function (err) {
        if (err) {
            console.log("Could not establish onDisconnect event", err);
        }
    });
}

function subscribeLogin() {//登录界面设置按Enter键登录
    $('#form-input input').on('keypress', function (event) {
        if (event.keyCode == 13) {
            login();
        }
    });
}

window.onload = function () {//页面载入完成，注册事件
    subscribeLogin();
    subscribeSendMessage();
    subscribeRetrieveMessage();
    subscribeRetrieveUser();
    subscribeChooseRoom();
}
