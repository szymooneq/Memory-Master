//console.log(document.querySelector('.game-card').children[0].attributes.src.value);
let witcher_database = ["img/ciri.png", "img/geralt.png", "img/iorveth.png" , "img/jaskier.png", "img/triss.png", "img/yennefer.png"];
let game_data = [];
let seconds = 0;
let minutes = 0;
let selectedClick = "";
let points = 0;

const main = document.querySelector('.main');
const board = document.querySelector('.game-board');
const timer = document.querySelector('.timer');
const score = document.querySelector('.score');

board.addEventListener('click', revealCard);

function Timer() {
  if (seconds == 59) {
    seconds = -1;
    minutes++;
  }
  seconds++;

  minutes<10 ? timer.children[0].innerHTML = `0${minutes}` : timer.children[1].innerHTML = `${minutes}`;
  seconds<10 ? timer.children[1].innerHTML = `0${seconds}` : timer.children[1].innerHTML = `${seconds}`;
}

setInterval(Timer, 1000);

function load_data(database) {
  game_data = [...database, ...database];
  let index = database.length, randomIndex;

  while(index != 0) {
    randomIndex = Math.floor(Math.random() * index);
    index--;

    [game_data[index], game_data[randomIndex]] = [game_data[randomIndex], game_data[index]]; 
  }

  return game_data;
}

load_data(witcher_database);

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
      if(playerClick.src == selectedClick.src) {
        board.removeEventListener('click', revealCard);

        setTimeout(() => {
          board.addEventListener('click', revealCard);
          selectedClick = undefined;
        }, 500)

        points++;
        score.innerHTML = `${points} points`;

      } else {
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
        }, 500)
      }   
    }
  }
}