/*!
 * Facebook Hackathon 2014: TicCeption App
 * Written by: Shahmeer Navid
 * Created Jan. 24, 2014.
*/
$(document).ready(function(){

instructions();
var currentPlayer = 0;
var playerGrid = [-1, -1];
var largeGrid = new largeGrid();


//initial population
for(var i = 0; i < 9; i++){
  $('#bigGrid').append('<div class="grid position'+i+'"></div>');
}
$('.grid').each(function(gridIndex, element){
  for(var i = 0; i < 9; i++){
    $(element).append('<div class="square position'+i+'"></div>');
  }

  var grid = new smallGrid(gridIndex);
  populateLargeGrid(largeGrid, grid);

  $(element).children().each(function(squareIndex, element){
    var square = new Square(this, squareIndex, gridIndex, grid);
    populateGrid(grid, square);
  });
});



function smallGrid(gridNumber){
  this.winner = -1;
  this.squares = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.squareNumber = gridNumber;
  this.colored = 0;
}

function populateGrid(grid, square){
  for(var i =0 ; i < 9; i++){
    if(grid.squares[i] == 0){
      grid.squares[i] = square;
      break;
    }
  }
}
function populateLargeGrid(bigGrid, smallGrid){
  for(var i =0 ; i < 9; i++){
    if(bigGrid.squares[i] == 0){
      bigGrid.squares[i] = smallGrid;
      break;
    }
  }
}

function largeGrid(){
  this.squares = [0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function Square(domObject, squareNumber, gridNumber, parentGrid){
  this.domObject = domObject;
  this.grid = parentGrid;
  this.squareNumber = squareNumber;
  this.gridNumber = gridNumber;
  this.winner = -1;

    //to be used in click function
    //var grid = parentGrid;
    //var squareNumber = squareNumber;
    //var gridNumber = gridNumber;
    var winner = this.winner;
    var square = this;


    $(this.domObject).click(function(){

        //Game Logic

        //virgin square
        if(square.winner == -1 && (gridNumber == playerGrid[currentPlayer] || playerGrid[currentPlayer] == -1)){
          $(this).addClass('player'+currentPlayer);
          square.winner = currentPlayer;
          square.grid.colored++;

          var haveWon = checkWin(parentGrid, square);

          if(haveWon){
            $($('#bigGrid').children()[square.grid.squareNumber]).children().each(function (){
              $(this).removeClass("player1");
              $(this).removeClass("player0");
              $(this).addClass("player"+currentPlayer);
              $(this).addClass("noBorder");

            });
            square.grid.winner = currentPlayer;

                //check to see if other players grid has been taken
                var otherPlayer = (currentPlayer == 0)? 1:0;

                if(square.gridNumber == playerGrid[otherPlayer]){
                  playerGrid[otherPlayer] = -1;
                }


                var winner = checkWin(largeGrid, square.grid);

                if(winner){
                  customAlert(currentPlayer);
                  return;
                }

              }

            //update this player's next grid
            if(largeGrid.squares[square.squareNumber].winner != -1){
              playerGrid[currentPlayer] = -1;
            }
            else  playerGrid[currentPlayer] = squareNumber;

            //if we have a filled grid
            if(playerGrid[currentPlayer] != -1 && largeGrid.squares[playerGrid[currentPlayer]].colored == 9) playerGrid[currentPlayer] = -1;


            currentPlayer = (currentPlayer == 1)? 0: 1;
            otherPlayer = (currentPlayer == 1)? 0: 1;

            //playerGrid[currentPlayer] = (largeGrid.squares[squareNumber].winner == -1)?squareNumber:-1;

            $('.grid').removeClass('active');
            $('.grid.position'+playerGrid[currentPlayer]).addClass('active');

            $('body').removeClass('body' + otherPlayer);
            $('body').addClass('body' + currentPlayer);
          }
        });
  }

  function checkWin(grid, square){
    var winCounter = 1;
    var rowNumber = Math.floor(square.squareNumber/3);
    var colNumber = square.squareNumber%3;


    //console.log("Col: "+colNumber);
    //console.log("Row: "+rowNumber);

    //horizontal stuff
    for(var i = colNumber+1; i < 3; i++){   //right
      if(grid.squares[rowNumber*3+i].winner == currentPlayer)
        winCounter++;
      else break;
    }
    for(var i = colNumber-1; i > -1; i--){   //left
      if(grid.squares[rowNumber*3+i].winner == currentPlayer)
        winCounter++;
      else break;
    }
    if(winCounter == 3) return true;
    winCounter = 1;


    //vertical stuff
    for(var i = rowNumber+1; i < 3; i++){   //down

      if(grid.squares[i*3+colNumber].winner == currentPlayer){
        winCounter++;
      }
      else break;
    }
    for(var i = rowNumber-1; i > -1; i--){   //up
      if(grid.squares[i*3+colNumber].winner == currentPlayer){
        winCounter++;
      }
      else break;
    }
    if(winCounter == 3) return true;
    winCounter = 0;


   //left - right

   var currentRow = 0;
   var currentCol = 0;

   while(currentRow < 3 && currentCol < 3){
    if(grid.squares[3*currentRow + currentCol].winner == currentPlayer){
      winCounter++;
    }
    currentCol++;
    currentRow++;
  }
  if(winCounter == 3) return true;
  winCounter = 0;

    //right - left
    currentRow = 0;
    currentCol = 2;

    while(currentRow < 3 && currentCol > -1){
      console.log(3*currentRow + currentCol);
      if(grid.squares[3*currentRow + currentCol].winner == currentPlayer){
        winCounter++;
      }
      currentCol--;
      currentRow++;
    }
    if(winCounter == 3) return true;

    return false;

  }


  function customAlert(){
    $('.panel-message').append('OMG, Player '+currentPlayer+' Won!!!');
    $('.panel-body').append('<button type="button" id="restartButton" class="btn btn-danger">Replay Foo!!!!</button>');
    $('.panel').fadeIn("slow");
    $('.overlay').fadeIn("slow");

    $("#restartButton").click(function () {
      location.reload();

    });
  }
  function instructions(){
    $('.panel.info').fadeIn("slow");
    $('.overlay').fadeIn("slow");

    $("#startButton").click(function () {
      $('.panel.info').fadeOut("slow");
    $('.overlay').fadeOut("slow");

    });
  }
});
