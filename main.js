const database = ["b_ciri.jpg", "f_foltest.jpg", "g_braen.jpg", "r_detlaff.jpg", "v_bear.jpg", "b_dandelion.jpg", "f_keira.jpg", "g_francesca.jpg", "r_eredin.jpg", "v_bran.jpg", "b_geralt.jpg", "f_priscilla.jpg", "g_moren.jpg", "r_hound.jpg", "v_crach.jpg", "b_triss.jpg", "f_roche.jpg", "g_saskia.jpg", "r_unseen.jpg", "v_ermion.jpg", "b_yennefer.jpg"];

let pairs = 0; let moves = 0; let points = 0; let multiplier = 0;
let minutes = 0; let seconds = 0; let startTimer;
let firstClick;

const menu = document.querySelector('.menu');
const menuButtons = document.querySelectorAll('.menuButton');
const game = document.querySelector('.game');
const gameBoard = document.querySelector('.gameBoard');
const gameLevel = document.querySelector('.level');
const gameTimer = document.querySelector('.timer');
const gameMoves = document.querySelector('.moves');
const gameScore = document.querySelector('.score');

(function startGame() {
  game.style.display = "none"
  const { parentElement } = menu

  const startHandler = (el) => {
    menuButtons.forEach(button => {
      button.removeEventListener('click', () => startHandler(button))
    })

    let level = el.getAttribute('data-level')
    renderGame(level)
    parentElement.style.display = "none"
  }
  
  menuButtons.forEach(button => {
    button.addEventListener('click', () => startHandler(button))
  })
}())

const renderGame = (level) => {
  let name = ""
  let cards = 0
  let theme = {}
  
  switch (level) {
    case "easy":
      /* 4x4 */
      name = "EASY ✸"
      cards = 16
      multiplier = 10
      theme = {
        primary: "#38ef7d",
        secondary: "#11998e"
      }
      break;

    case "medium":
      /* 5x6 */
      name = "MEDIUM ✸✸"
      cards = 30
      multiplier = 20
      theme = {
        primary: "#f7b733",
        secondary: "#fc4a1a"
      }
      break;

    case "hard":
      /* 6x7 */
      name = "HARD ✸✸✸"
      cards = 42 
      multiplier = 30
      theme = {
        primary: "#ff512f",
        secondary: "#dd2476"
      }
      break;

    default:
      break;
  }

  pairs = cards/2
  renderCards(getRandomData(database), level, theme)
  
  gameBoard.style.gridTemplateColumns = `var(--${level}-column-template)`
  gameLevel.innerText = name
  gameLevel.style.color = theme.primary
  game.style.display = "block"
  gameBoard.addEventListener('click', revealCard)
  startTimer = setInterval(timer, 1000);
}

const getRandomData = (database) => {
  const array = database.slice(0, pairs)
  let randomArray = [...array, ...array]
  let index = randomArray.length, randomIndex

  while(index !== 0) {
    randomIndex = Math.floor(Math.random() * index)
    index--
    [randomArray[index], randomArray[randomIndex]] = [randomArray[randomIndex], randomArray[index]];
  }

  return randomArray
}

const renderCards = (database, level, theme) => {
  for(let i = 0; i < database.length; i++) {
    const card = document.createElement("div")
    const cardFront = document.createElement("div")
    const cardBack = document.createElement("div")
    card.className = "gameCard play"
    card.style.width = `var(--${level}-card-size)`
    card.style.height = `var(--${level}-card-size)`

    cardFront.className = "front"
    cardFront.style.background = `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})`
    cardBack.className = "back"
    cardBack.style.backgroundImage = `url(assets/images/${database[i]})`

    card.appendChild(cardFront)
    card.appendChild(cardBack)
    gameBoard.appendChild(card)
  }
}

const timer = () => {
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

const revealCard = (e) => {
  if(e.target.parentNode.classList.contains('play')) {

    const clickedCard = e.target.parentNode
    clickedCard.classList.remove('play')
    clickedCard.classList.add('active')

    if(!firstClick) {
      firstClick = clickedCard

    } else {
      gameBoard.removeEventListener('click', revealCard)
      
      if(firstClick.lastChild.style.backgroundImage === clickedCard.lastChild.style.backgroundImage) {
        firstClick.classList.add('shake');
        clickedCard.classList.add('shake');

        setTimeout(() => {
          firstClick.classList.remove('shake');
          firstClick.classList.add('done');
          
          clickedCard.classList.remove('shake');
          clickedCard.classList.add('done');
          
          firstClick = null;

          gameBoard.addEventListener('click', revealCard)
        }, 1000)

        pairs--;
        points = points + multiplier;

      } else {
        setTimeout(() => {
          firstClick.classList.remove('active');
          firstClick.classList.add('play');

          clickedCard.classList.remove('active');
          clickedCard.classList.add('play');
          
          firstClick = null;

          gameBoard.addEventListener('click', revealCard)
        }, 600)

        if(points > 0) points = points - 2
      }

        moves += 1
        gameScore.innerText = `${points} points`;
        gameMoves.innerText = `${moves} move count`;
        pairs === 0 && endGame(points, moves);
    }
   } 
}

const endGame = () => {
  const { parentElement } = menu
  parentElement.style.display = 'flex'

  menu.innerHTML = `<p>You earned <span class="score">${points} points</span> in <span class="moves">${minutes}:${seconds}</span> and <span class="moves">${moves} moves</span>, congratulations!🎉</p><button class="playAgain" onclick="window.location.reload()">Play again</button>`
  
  gameBoard.removeEventListener('click', revealCard);
  clearInterval(startTimer);
}