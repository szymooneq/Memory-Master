//console.log(document.querySelector('.game-card').children[0].attributes.src.value);
let witcher_database = ["img/ciri.png", "img/geralt.png", "img/iorveth.png" , "img/jaskier.png", "img/triss.png", "img/yennefer.png"];
let game_data = [];
let selectedClick = "";

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

const board = document.querySelector('.game-board');
board.addEventListener('click', revealCard);

load_data(witcher_database);
//console.log(game_data);

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
        console.log('matched')
        board.removeEventListener('click', revealCard);

        setTimeout(() => {
          board.addEventListener('click', revealCard);
          selectedClick = undefined;
        }, 500)

      } else {
        console.log('not matched');
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