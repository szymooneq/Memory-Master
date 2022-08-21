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

load_data(witcher_database);
console.log(game_data);

const cards = document.querySelectorAll('.game-card img');
cards.forEach(card => {
  card.addEventListener('click', revealCard);
})

function revealCard(e) {
  const playerClick = e.target;
  const gameCard = playerClick.parentNode;
  const gameCardId = gameCard.getAttribute('data-id');

  playerClick.removeEventListener('click', revealCard);
  playerClick.src = game_data[gameCardId];

  // check selectedClick is exist?
  if(selectedClick) {
    // (selectedClick exist) compare with second element

    if(playerClick.src == selectedClick.src) {
      console.log('matched')
    } else {
      console.log('not matched');

      setTimeout(() => {

        playerClick.addEventListener('click', revealCard);
        selectedClick.addEventListener('click', revealCard);
        
        playerClick.src = "img/karta.png";
        selectedClick.src = "img/karta.png";

        playerClick.parentNode.classList.toggle('clicked');
        playerClick.parentNode.classList.toggle('game-card');

        selectedClick.parentNode.classList.toggle('clicked');
        selectedClick.parentNode.classList.toggle('game-card');
        
      }, 5000);

    }

    selectedClick = undefined;
  } else {
    // (selectedClick don't exist) create them
    selectedClick = playerClick;
  }

  gameCard.classList.toggle('clicked');
  gameCard.classList.toggle('game-card');

  
  //console.log(playerClick);
  //console.log(gameCard);
}
