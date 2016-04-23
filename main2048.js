var board = new Array();
var score = 0;
var hasConflicated = new Array();

$(document).ready(function() {   
    function respHeight(){
        var x1 = $('#header-part-1').position();
        var x2 = $('#header-part-2').position();
        return x1.top+x2.top;
    };
    prepareForMobile();
   newgame(); 
});

function prepareForMobile(){
    
    $('#board-container').css('width',gridContainerWidth);
    $('#board-container').css('height',gridContainerWidth);
    $('#board-container').css('padding', cellSpace);
    $('#board-container').css('border-radius', 0.02*gridContainerWidth);
    
    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}
function newgame(){
    //init grid board
    init();
    //random number
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(var i = 0; i < 4;i ++){
        for(var j = 0; j < 4;j ++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css("top",getPosTop(i,j));
            gridCell.css("left",getPosLeft(i,j));
        }
    }
    
    for(i = 0; i < 4 ; i ++){
        board[i] = new Array();
        hasConflicated[i] = new Array();
        for(j=0 ;j < 4; j++){
            board[i][j] = 0;
            hasConflicated[i][j] = false;
        }
    }
    score = 0;
    updateScore(score);
    updateBoardView();
}

function updateBoardView(){   
    $(".number-cell").remove();
    for(var i = 0; i < 4;i ++){
        for(var j = 0; j < 4;j ++){
            $("#board-container").append('<div class = "number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $('#number-cell-'+i+'-'+j);
            
            if(board[i][j]==0){
                theNumberCell.css("width","0px");
                theNumberCell.css("height","0px");
                theNumberCell.css("top",getPosTop(i,j) + cellSideLength/2);
                theNumberCell.css("left",getPosLeft(i,j) + cellSideLength/2);
            }else{
                theNumberCell.css("width",cellSideLength);
                theNumberCell.css("height",cellSideLength);
                theNumberCell.css("top",getPosTop(i,j));
                theNumberCell.css("left",getPosLeft(i,j));
                theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color",getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
        }
    }
    for(i = 0; i < 4 ; i ++){
        for(j=0 ;j < 4; j++){
            hasConflicated[i][j] = false;
        }
    }
    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber(){
    if(noSpace(board)){
        return false;       
    }else{
        //random a position
        var randomPosition = new Array();
        var counter = 0;
        
        for(i = 0; i < 4 ; i ++){         
            for(j=0 ;j < 4; j++){
                if(board[i][j]== 0){
                    randomPosition[counter] = [i,j];
                    counter++;
                }
            }
        }
        
        var rand = parseInt(Math.floor(Math.random() * counter));
        var randx = randomPosition[rand][0];
        var randy = randomPosition[rand][1];
        //random a number
        var randNumber = Math.random() <0.5 ? 2:4;
        //display the number
        board[randx][randy] = randNumber;
        showNumberWithAnimation(randx,randy,randNumber);
        return true;
    }
}

function isGameOver(){
    if(noSpace(board) && noMove(board)){
        gameover();
    }
}

function gameover(){
    $("#gameOverModal").modal('toggle');
}

function modal(){
    newgame();
    $("#gameOverModal").modal('toggle');
}

//for PC keyboard manipulation
$(document).keydown(function(event){
   switch(event.keyCode){
       case 37: //left
            event.preventDefault();//avoiding scroll roll
           if(moveLeft()){
               setTimeout("generateOneNumber()",210);
               setTimeout("isGameOver()",300);
           };
           break;
       case 38: //up
            event.preventDefault();//avoiding scroll roll
           if(moveUp()){
               setTimeout("generateOneNumber()",210);
               setTimeout("isGameOver()",300);
           };
           break;
       case 39: //right
            event.preventDefault();//avoiding scroll roll
           if(moveRight()){
               setTimeout("generateOneNumber()",210);
               setTimeout("isGameOver()",300);
           };
           break;
       case 40: //down
            event.preventDefault();//avoiding scroll roll
           if(moveDown()){
               setTimeout("generateOneNumber()",210);
               setTimeout("isGameOver()",300);
           };
           break;
       default:
           break;
   } 
});

//for touch screen manipulation
document.addEventListener('touchstart',function(event){
    startx=event.touches[0].pageX;
    starty=event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
   event.preventDefault();
    /*Android 4.0 has a bug named 19827
      you can not move unless have this code
    */
});

document.addEventListener('touchend',function(event){
    endx=event.changedTouches[0].pageX;
    endy=event.changedTouches[0].pageY;
    
    var deltaX = endx-startx;
    var deltaY = endy-starty;
    
    if(Math.abs(deltaX)<0.2*documentWidth && Math.abs(deltaY) < 0.2*documentWidth){
        return;
    }
    else{
    
    if(Math.abs(deltaX)>=Math.abs(deltaY)){
        if(deltaX>0){
            //right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300)
            }
        }else{
            //left
            if(moveLeft()){
               setTimeout("generateOneNumber()",210);
               setTimeout("isGameOver()",300);
           };
        }
    }else{
        if(deltaY>0){
            //down
            if(moveDown()){
               setTimeout("generateOneNumber()",210);
               setTimeout("isGameOver()",300);
           };
        }else{
            //up
            if(moveUp()){
               setTimeout("generateOneNumber()",210);
               setTimeout("isGameOver()",300);
           };
        }
    }
        
    }
});




function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }else{
        for(var i = 0; i < 4; i ++){
            for(var j = 1 ; j < 4 ; j ++){  
                //do not need to judge the line already in left
                if(board[i][j]!=0){
                    for(var k = 0;k<j;k++){
                        if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
                            //move
                            showMoveAnimation(i,j,i,k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            break;
                        }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board)&&!hasConflicated[i][k]){
                            //move
                            showMoveAnimation(i,j,i,k);
                            //add
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            //add score
                            score += board[i][k];
                            updateScore(score);
                            hasConflicated[i][k] = true;
                            break;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()",200);
        return true;
    }
}

function moveRight(){
    if(!canMoveRight(board)){
        return false;
    }else{
        for(var i = 0; i < 4; i ++){
            for(var j = 3 ; j >=0 ; j --){  
                //do not need to judge the line already in left
                if(board[i][j]!=0){
                    for(var k = 3;j<k;k--){
                        if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
                            //move
                            showMoveAnimation(i,j,i,k);
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            break;
                        }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,j,k,board)&&!hasConflicated[i][k]){
                            //move
                            showMoveAnimation(i,j,i,k);
                            //add
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            score += board[i][k];
                            updateScore(score);
                            hasConflicated[i][k] = true;
                            break;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()",200);
        return true;
    }
}
function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board )&&!hasConflicated[k][j]){
                        showMoveAnimation( i , j , k , j );
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicated[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}
function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }else{
        for(var j = 0 ; j <4 ; j ++){
            for(var i = 2; i>=0;i--){  
                //do not need to judge the line already in left
                if(board[i][j]!=0){
                    for(var k = 3;i<k;k--){
                        if(board[k][j] == 0 && noBlockVertical(j,i,k,board)){
                            //move
                            showMoveAnimation(i,j,k,j);
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            break;
                        }else if(board[k][j] == board[i][j] && noBlockVertical(j,i,k,board)&&!hasConflicated[k][j]){
                            //move
                            showMoveAnimation(i,j,k,j);
                            //add
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            score += board[k][j];
                            updateScore(score);
                            hasConflicated[k][j] = true;
                            break;
                        }
                    }
                }
            }
        }
        setTimeout("updateBoardView()",200);
        return true;
    }
}


