var Turn = -1;
var GameEnds = false;
var PlayerWins = [false, false];
var WindStrength = 100;
var WindDirection = "left";//Or "right";
var PlayerLife = [100, 100];
var PlayerCanMove = [true, false];
var Dualedplayer1 = 0;
var Dualedplayer2 = 0;
var boolIncrease = true;//能量条是增长还是下降
var currentStrength = 0;//当前能量条的能量
var moveObject;//要移动的jquery对象
var currentPos;//对象当前的位置，以像素为单位
var currentAngle = [45, 45];//对象当前炮筒的仰角
var leftOrRight = ["left", "right"];//对象是靠左还是靠右的，对应css的left或right属性
var strengthtimer = [];
var lefttimer = [];
var righttimer = [];
var uptimer = [];
var downtimer = [];
var bombtimer = [];
var hasDoubledPlayer1 = false;
var hasDoubledPlayer2 = false;
var lx = 0;
var totaltime = 0;
var ly = 0;
var gravity = 1;
var GetPercentageOfBar;
var lx_right;
var lx_left;
var lx_top;
var lx_bottom;
var speed_x;
var speed_y;
var enterlock = false;
var icebomb = false;

$('#start').click(start);
$('#restart').click(restart);
$('#help').click(help);
$('#help2').click(help);
$('#quit').click(quit);
$('#quit2').click(quit);
$('#help-button').click(backtostart);

var icebombGif = $('<img src=\'images/icebomb.gif\'/>');
var bombGif = $('<img src=\'images/bomb.gif\'/>');
