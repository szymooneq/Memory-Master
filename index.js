let database = ["url(assets/icons/b_ciri.jpg)", "url(assets/icons/f_foltest.jpg)", "url(assets/icons/g_braen.jpg)", "url(assets/icons/r_detlaff.jpg)", "url(assets/icons/v_bear.jpg)", "url(assets/icons/b_dandelion.jpg)", "url(assets/icons/f_keira.jpg)", "url(assets/icons/g_francesca.jpg)", "url(assets/icons/r_eredin.jpg)", "url(assets/icons/v_bran.jpg)", "url(assets/icons/b_geralt.jpg)", "url(assets/icons/f_priscilla.jpg)", "url(assets/icons/g_moren.jpg)", "url(assets/icons/r_hound.jpg)", "url(assets/icons/v_crach.jpg)", "url(assets/icons/b_triss.jpg)", "url(assets/icons/f_roche.jpg)", "url(assets/icons/g_saskia.jpg)", "url(assets/icons/r_unseen.jpg)", "url(assets/icons/v_ermion.jpg)", "url(assets/icons/b_yennefer.jpg)"];

let gameDatabase = []; let randomArray = [];
let pairs = 0; let moves = 0; let points = 0; let multiplier = 0;
let minutes = 0; let seconds = 0; let startTimer;
let firstClick; let firstClickImg;

const mainMenu = document.querySelector('.mainMenu')
const selectButtons = document.querySelectorAll('#level')
const mainGame = document.querySelector('.mainGame')
const gameBoard = document.querySelector('.gameBoard')
const gameLevel = document.querySelector('.level')
const gameTimer = document.querySelector('.timer')
const gameMoves = document.querySelector('.moves')
const gameScore = document.querySelector('.score')

const restartInfo = document.querySelectorAll('#restart');
restartInfo.forEach(button => button.addEventListener('click', () => {location.reload()}))

const startGame = () => {
  mainGame.style.display = "none"
  let modal = mainMenu.parentElement
  
  selectButtons.forEach(button => {
    button.addEventListener('click', () => {
      let level = button.getAttribute('data-level')
      modal.style.display="none"
      renderGame(level)
    })})
}
startGame()

const renderGame = (props) => {
  let level = props
  let cards
  let boardWidth
  let cardSize
  
  switch (level) {
    case "easy":
      /* 4x4 */
      level = "EASY ⭐"
      cards = 16 
      pairs = cards/2
      multiplier = 10
      boardWidth = "var(--easy-board-size)"
      cardSize = "var(--easy-card-size)"
      break;

    case "medium":
      /* 5x6 */
      level = "MEDIUM ⭐⭐"
      cards = 30 
      pairs = cards/2
      multiplier = 20
      boardWidth = "var(--medium-board-size)"
      cardSize = "var(--medium-card-size)"
      break;

    case "hard":
      /* 6x7 */
      level = "HARD ⭐⭐⭐"
      cards = 42 
      pairs = cards/2
      multiplier = 30
      boardWidth = "var(--hard-board-size)"
      cardSize = "var(--hard-card-size)"
      break;

    default:
      break;
  }

  setRandomData(database)

  for(let i=0; i<randomArray.length; i++) {
    const boardElement = `<div class="gameCard play" style="width:${cardSize}; height: ${cardSize};"><div class="front"></div><div class="back" style="background-image: ${randomArray[i]}"></div></div>` 
    gameBoard.insertAdjacentHTML('beforeend', boardElement);
  }
  
  mainGame.style.display = "block"
  mainGame.style.width = boardWidth

  gameLevel.innerText = level
  gameTimer.innerText = "00:00"
  gameMoves.innerText = "0 move count"
  gameScore.innerText = "0 points"

  gameBoard.addEventListener('click', revealCard)
  startTimer = setInterval(Timer, 1000);
}

const setRandomData = (database) => {
  gameDatabase = database.slice(0, pairs)
  randomArray = [...gameDatabase, ...gameDatabase]
  let index = randomArray.length, randomIndex

  while(index !== 0) {
    randomIndex = Math.floor(Math.random() * index)
    index--
    [randomArray[index], randomArray[randomIndex]] = [randomArray[randomIndex], randomArray[index]];
  }

  return randomArray
}

function Timer() {
  minutes = parseInt(minutes, 10);
  seconds = parseInt(seconds, 10);

  if (seconds === 59) {
    seconds = -1;
    minutes++;
  }
  seconds++;

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  gameTimer.innerText = `${minutes}:${seconds}`;
}

function revealCard(e) {
  if(e.target.parentNode.classList.contains('play')) { 

    let clickedCard = e.target.parentNode
    let clickedCardImg = e.target.style.backgroundImage

    clickedCard.classList.remove('play')
    clickedCard.classList.add('active')

    if(!firstClick) {
      firstClick = clickedCard;
      firstClickImg = e.target.style.backgroundImage
      
    } else {
      
      if(firstClickImg === clickedCardImg) {
        gameBoard.removeEventListener('click', revealCard);
        firstClick.classList.add('shake');
        clickedCard.classList.add('shake');

        setTimeout(() => {
          gameBoard.addEventListener('click', revealCard);

          firstClick.classList.remove('shake');
          clickedCard.classList.remove('shake');

          firstClick.classList.add('done');
          clickedCard.classList.add('done');

          firstClick = undefined;   
        }, 1000)

        moves+=1
        points=points+multiplier;
        gameScore.innerText = `${points} points`;
        gameMoves.innerText = `${moves} move count`;

        pairs--;
        checkWin();

      } else {
        gameBoard.removeEventListener('click', revealCard);

        setTimeout(() => {
          gameBoard.addEventListener('click', revealCard);

          firstClick.classList.remove('active');
          clickedCard.classList.remove('active');

          firstClick.classList.add('play');
          clickedCard.classList.add('play');

          firstClick = undefined;
        }, 600)

        moves+=1
        if(points > 0) points = points - 2
        gameScore.innerText = `${points} points`;
        gameMoves.innerText = `${moves} move count`;
      }
    }
   } 
}

const checkWin = () => {
  if(pairs === 0) {
    let modal = mainMenu.parentElement
    modal.style.display = 'flex';

    mainMenu.innerHTML = `<p>You earned <span class="points">${points} points</span> in <span class="result">${minutes}:${seconds}</span> and <span class="result">${moves} moves</span>, congratulations!🎉</p><button class="again" onclick="window.location.reload()">Play again</button>`
    clearInterval(startTimer);
  }
}