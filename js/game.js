let witcher_database = ["img/ciri.png", "img/dandelion.png", "img/francesca.png", "img/geralt.png", "img/iorveth.png" , "img/radowid.png", "img/triss.png", "img/yennefer.png"];
let game_data = [];
let seconds = 0;
let minutes = 0;
let selectedClick = "";
let points = 0;
let leftPairs = 8;

const main = document.querySelector('.main');
const board = document.querySelector('.game-board');
const timer = document.querySelector('.timer');
const score = document.querySelector('.score');
const restart = document.querySelectorAll('#restart');
const modal = document.querySelector('.modal');

board.addEventListener('click', revealCard);
restart.forEach(button => {
  button.addEventListener('click', () => {
    window.location.reload(false)
  })
});

// START GAME FUNCTIONS
createBoard();
loadData(witcher_database);
const time = setInterval(Timer, 1000);

function createBoard() {
  for(i=0; i<16; i++) {
    const boardElement = `<div data-id="${i}" class="game-card play">
                            <img src="" alt="">
                          </div>`;

    board.insertAdjacentHTML('beforeend', boardElement);
  }
}

// set timer
function Timer() {
  minutes = parseInt(minutes);
  seconds = parseInt(seconds);

  if (seconds == 59) {
    seconds = -1;
    minutes++;
  }
  seconds++;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  timer.firstElementChild.innerHTML = `${minutes}:${seconds}`;
}

// load and shuffle data from array (database images)
function loadData(database) {
  game_data = [...database, ...database];
  let index = game_data.length, randomIndex;

  while(index != 0) {
    randomIndex = Math.floor(Math.random() * index);
    index--;

    [game_data[index], game_data[randomIndex]] = [game_data[randomIndex], game_data[index]]; 
  }

  return game_data;
}

// function after click on any card
function revealCard(e) {
  if(e.target.classList.contains('play')) {

    const playerClick = e.target.children[0];
    const gameCardId = playerClick.parentNode.getAttribute('data-id');

    playerClick.src = game_data[gameCardId];
    playerClick.parentNode.classList.toggle('play');
    playerClick.parentNode.classList.toggle('active');
    
    // check selectedClick is exist?
    if(!selectedClick) {
      // (selectedClick don't exist) create them
      selectedClick = playerClick;
      
    } else {
      // (selectedClick exist) compare with second element
      if(playerClick.src == selectedClick.src) { //image matched
        board.removeEventListener('click', revealCard);

        setTimeout(() => {
          board.addEventListener('click', revealCard);
          selectedClick = undefined;
        }, 300)

        points=points+10;
        score.innerHTML = `${points} points`;
        leftPairs--;
        checkWin();

      } else { // not matched
        board.removeEventListener('click', revealCard);

        setTimeout(() => {
          playerClick.src = "...";
          selectedClick.src = "...";

          playerClick.parentNode.classList.toggle('play');
          playerClick.parentNode.classList.toggle('active');

          selectedClick.parentNode.classList.toggle('play');
          selectedClick.parentNode.classList.toggle('active');
          selectedClick = undefined;

          board.addEventListener('click', revealCard);
        }, 300)

        points>0 ? points=points-2 : null;
        score.innerHTML = `${points} points`;
      }
    }
  }
}

// check win
function checkWin() {
  if(leftPairs == 0) {
    modal.style.display = 'flex';
    modal.children[0].firstElementChild.innerHTML = `You scored ${points} points in ${minutes}:${seconds}, congratulations!🎉`;
    clearInterval(time);
  }
}