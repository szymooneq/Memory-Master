let database = ["img/ciri.png", "img/dandelion.png", "img/francesca.png", "img/geralt.png", "img/iorveth.png" , "img/radowid.png", "img/triss.png", "img/yennefer.png"];

/* let mainGame; let gameBoard

let level; let cards; let points; */
let minutes = 0; let seconds = 0;

const mainMenu = document.querySelector('.mainMenu')
const selectButtons = document.querySelectorAll('#level')

const mainGame = document.querySelector('.mainGame')
const gameBoard = document.querySelector('.gameBoard')
const gameDetails = document.querySelectorAll('.gameDetails')

const gameTimer = document.querySelector('.timer')

const restartInfo = document.querySelectorAll('#restart');
const gameScore = document.querySelector('.score');

const startGame = () => {
  let modal = mainMenu.parentElement;

  selectButtons.forEach(button => {
    button.addEventListener('click', () => {
      level = button.getAttribute('data-level')
      modal.style.display="none"
      renderGame(level)
    })})
}
startGame()

const renderGame = (props) => {
  level = props
  
  switch (level) {
    case "easy":
      level = "easy ⭐"
      cards = 16
      break;

    case "medium":
      level = "medium ⭐⭐"
      cards = 30
      break;

    case "hard":
      level = "hard ⭐⭐⭐"
      cards = 42
      break;
  
    default:
      break;
  }

  setRandomData(database)
  gameBoard.addEventListener('click', revealCard)

  for(i=0; i<game_data.length; i++) {
    const boardElement = `<div data-id=${i} class="gameCard play"><img src=${game_data[i]} alt=""></div>`         
    gameBoard.insertAdjacentHTML('beforeend', boardElement);
  }

  const gameLevel = gameDetails[0].firstElementChild
  const gameRestart = gameDetails[0].lastElementChild
  const gameTimer = gameDetails[1].firstElementChild
  
  gameLevel.innerText = "Level: " + level
  gameRestart.innerHTML = '<button id="restart" class="restart">Restart</button>'
  gameTimer.innerText = "00:00"

  startTimer = setInterval(Timer, 1000);
}

const setRandomData = (database) => {
  game_data = [...database, ...database];
  let index = game_data.length, randomIndex;

  while(index != 0) {
    randomIndex = Math.floor(Math.random() * index);
    index--;

    [game_data[index], game_data[randomIndex]] = [game_data[randomIndex], game_data[index]]; 
  }

  return game_data;
}

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

  gameTimer.innerHTML = `${minutes}:${seconds}`;
}

// function after click on any card
function revealCard(e) {
  if(e.target.parentNode.classList.contains('play')) { 

    /* const cardId = game_data[e.target.parentNode.getAttribute('data-id')] */
    const imgId = e.target.getAttribute('src')

    console.log(cardId, imgId)

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