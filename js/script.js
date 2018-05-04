$(function(){

    var chess=document.getElementById("chess");
    var context=chess.getContext('2d');
    var image=new Image();
    image.src="images/background.jpg";
    image.onload=function(){
        context.drawImage(image,0,0,450,450);
        drawChessBoard();

    }

//绘制棋盘
    function drawChessBoard(){
        //设置线条颜色
        context.strokeStyle="#BFBFBF";
        //绘制棋盘的竖线
        for(var i=0;i<15;i++){
            context.moveTo(15+i*30,15)
            context.lineTo(15+i*30,435);
            context.stroke();
        }
        //绘制棋盘的横线
        for(var i=0;i<15;i++){
            context.moveTo(15,15+i*30);
            context.lineTo(430,15+i*30);
            context.stroke();
        }
    }
//重新开始下棋
    $('#restart').click(function(){
        window.location.reload()
    })
//绘制棋子
    var oneStep=function(i,j,me){
        context.beginPath();

        context.arc(15+i*30,15+j*30,13,0,2*Math.PI)
        context.closePath();
        context.gradient=context.createRadialGradient(15+i*30+2,15+j*30-2,15,15+i*30+2,15+j*30-2,0)
        var gradient=context.gradient;
        //如果是黑旗
        if(me){
            gradient.addColorStop(0,"#0A0A0A");
            gradient.addColorStop(1,"#636766");
        }else{
            gradient.addColorStop(0,"#D1D1D1");
            gradient.addColorStop(1,"#F9F9F9");
        }

        context.fillStyle=gradient;
        context.fill();
    }
//赢法统计数组


//定义赢法数组,
    var wins=[]
    for(var i=0;i<15;i++){
        wins[i]=[];
        for(var j=0;j<15;j++){
            wins[i][j]=[];
        }
    }

//记录所有竖线的赢法
    var count=0;

    for(var i=0;i<15;i++){

        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[i][j+k][count]=true;

            }
            count++;

        }
    }

//记录所有横线赢法
    for(var i=0;i<15;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[j+k][i][count]=true;
            }
            count++;
        }
    }

//记录所有右下斜线的赢法
    for(var i=0;i<11;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[i+k][j+k][count]=true;
            }
            count++;
        }
    }

//记录所有左下斜线的赢法
    for(var i=0;i<11;i++){
        for(var j=14;j>3;j--){
            for(var k=0;k<5;k++){
                wins[i+k][j-k][count]=true;
            }
            count++;
        }
    }

//我方赢法
    var myWin=[];
//机器赢法
    var computerWin=[];

    for(var i=0;i<count;i++){
        myWin[i]=0;
        computerWin[i]=0;
    }
//对局是否结束 
    over=false;
//初始走黑棋
    var me=true;

//初始化一个二维数组记录行走路径
    var chessBoard=[]
    for(var i=0;i<15;i++){
        chessBoard[i]=[];
        for(var j=0;j<15;j++){
            chessBoard[i][j]=0;
        }
    }

//判断落点是否有子
    function hasChessPiece(i,j){
        if(chessBoard[i][j]==0){
            //没子
            return false;
        }else{
            return true;
        }
    }

    $("#chess").click(function(e){
        if(over==true){
            return;
        }
        //如果不是我方下棋
        if(me!=true){
            return
        }
        var x=e.offsetX;
        var y=e.offsetY;

        //计算落点的坐标
        var i=Math.floor(x/30);
        var j=Math.floor(y/30);
        //首先判断落点是否有子
        var is_has=hasChessPiece(i,j)

        if (!is_has) {
            oneStep(i,j,me);

            //记录棋子位置
            chessBoard[i][j]=1;
            //黑棋落子
            if(me==true){
                for(var k=0;k<count;k++){
                    if(wins[i][j][k]==true){
                        myWin[k]++;

                        //我方如果在此落子，则电脑在这种方式中就没法赢
                        computerWin[k]=6;

                        if(myWin[k]==5){
                            alert("你赢了！")
                            over=true;
                        }
                    }

                }

            }
            if(over!=true){
                //在此处代表
                me=!me;
                //电脑走棋
                computerAI();


            }
        }


    })

    function computerAI(){

        //定义我方得分
        myScore=[]
        //定义电脑得分
        computerScore=[]
        var max=0;
        var max_i=0;
        var max_j=0;
//初始化
        for(var i=0;i<15;i++){
            myScore[i]=[]
            computerScore[i]=[]
            for(var j=0;j<15;j++){
                myScore[i][j]=0;
                computerScore[i][j]=0;
            }
        }
        //遍历棋盘
        for(var i=0;i<15;i++){

            for(var j=0;j<15;j++){

                if(chessBoard[i][j]==0){
                    //此处没有子
                    //遍历赢法
                    for(var k=0;k<count;k++){
                        //拦截我方顺利连5子
                        if(wins[i][j][k]){


                            if(myWin[k]==1){
                                myScore[i][j]+=200;
                            }else if(myWin[k]==2){
                                myScore[i][j]+=400;
                            }else if(myWin[k]==3){
                                myScore[i][j]+=2000;
                            }else if(myWin[k]==4){
                                myScore[i][j]+=10000;
                            }

                            if(computerWin[k]==1){
                                computerScore[i][j]+=200;
                            }else if(computerWin[k]==2){
                                computerScore[i][j]+=420;
                            }else if(computerWin[k]==3){
                                computerScore[i][j]+=2100;
                            }else if (computerWin[k]==4) {
                                computerScore[i][j]+=20000;
                            }

                        }

                    }
                    /*得分与max相等的情况下:
                     代表要么下此处赢了，要么就是下到此处没有多大用处。
                     基于防守：
                     电脑在这下子，就算没用也要抢先下在对方在此下棋比较好的地方
                     基于进攻：
                     电脑在此下棋可以直接赢。
                     */
                    //计算机计算我方最佳落点（防守)

                    if(myScore[i][j]>max){
                        max=myScore[i][j];
                        max_i=i;
                        max_j=j;

                    }else if(myScore[i][j]==max){

                        //我方最佳
                        if(computerScore[i][j]>computerScore[max_i][max_j]){
                            max_i=i;
                            max_j=j;
                        }
                    }

                    // //计算电脑最佳落点（进攻）
                    if(computerScore[i][j]>max){
                        max=computerScore[i][j];
                        max_i=i;
                        max_j=j;
                    }else if(computerScore[i][j]==max){
                        if(myScore[i][j]>myScore[max_i][max_j]){
                            max_i=i;
                            max_j=j
                        }
                    }
                }

            }
        }
        //得出电脑最佳下棋位置max_i,max_j
        oneStep(max_i,max_j,me);
        //白旗落子
        chessBoard[max_i][max_j]=2;
        for(var k=0;k<count;k++){
            if(wins[max_i][max_j][k]==true){

                computerWin[k]++;
                //电脑在此下子后，对方在第k种方式就无法赢取
                myWin[k]=6;
                if(computerWin[k]==5){
                    alert("你输了！")
                    over=true;
                }
            }

        }

        //轮到人类方下棋
        me=!me;
    }


})