var Turn = -1;//回合玩家player1对应0，player2对应1
var PlayerWins = [false, false];//player1,2是否获胜
var WindStrength = 0;//风速
var WindDirection = "left";//风向，取值left或right
var PlayerLife = [100, 100];//玩家生命值
var PlayerCanMove = [true, false];//玩家是否可以移动
var Dualedplayer1 = 0;//使用了双发技能后玩家发射了的炮弹数量，取值范围0，1，2
var Dualedplayer2 = 0;
var boolIncrease = true;//能量条是增长还是下降
var currentStrength = 0;//当前能量条的能量
var moveObject;//要移动的jquery对象
var currentPos;//对象当前的位置，以像素为单位
var currentAngle = [45, 45];//对象当前炮筒的仰角
var leftOrRight = ["left", "right"];//对象是靠左还是靠右的，对应css的left或right属性
var strengthtimer = [];//能量条动画对应的计时器
var lefttimer = [];//向左移动对应的计时器
var righttimer = [];//向右移动对应的计时器
var bombtimer = [];//炮弹飞行对应的计时器
var hasDoubledPlayer1 = false;//player1是否使用了双倍技能
var hasDoubledPlayer2 = false;//player2是否使用了双倍技能
var lx = 0;//炮弹发射时的x位置
var totaltime = 0;//炮弹飞行的采样时间
var ly = 0;//炮弹发射时的y位置
var gravity = 1;//重力加速度
var GetPercentageOfBar;//获取发射的能量条
//对方玩家的四角坐标
var lx_right;
var lx_left;
var lx_top;
var lx_bottom;

var speed_x;//炮弹x轴速度
var speed_y;//炮弹y轴速度
var enterlock = false;//本回合玩家当前是否可以蓄力
var icebomb = false;//本回合玩家是否使用了冰冻弹

//对menu的按钮事件进行注册
$('#start').click(start);
$('#restart').click(restart);
$('#help').click(help);
$('#help2').click(help);
$('#quit').click(quit);
$('#quit2').click(quit);
$('#help-button').click(backtostart);
//预载入特效gif
var icebombGif = $('<img src=\'images/icebomb.gif\'/>');
var bombGif = $('<img src=\'images/bomb.gif\'/>');
