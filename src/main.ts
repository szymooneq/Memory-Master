import charactersArray from './assets/images/index';
import { shuffleArray } from './shuffleArray';
import './style.scss';

const levelData = {
	easy: {
		display: 'EASY ✸',
		cards: 16,
		multiplier: 10
	},
	medium: {
		display: 'MEDIUM ✸✸',
		cards: 30,
		multiplier: 20
	},
	hard: {
		display: 'HARD ✸✸✸',
		cards: 42,
		multiplier: 30
	}
};

let GAME_CONFIG = {} as {
	display: string;
	cards: number;
	multiplier: number;
};

let PAIRS = 0;
let MOVES = 0;
let POINTS = 0;
let MINUTES = 0;
let SECONDS = 0;
let TIMER: number;
let firstClick: HTMLElement | null;

const modal: HTMLDivElement = document.querySelector('.modal')!;
const game: HTMLDivElement = document.querySelector('.game')!;
const gameBoard: HTMLDivElement = document.querySelector('.gameBoard')!;
const gameLevel: HTMLDivElement = document.querySelector('.level')!;
const gameScore: HTMLDivElement = document.querySelector('.score')!;
const gameMoves: HTMLDivElement = document.querySelector('.moves')!;

window.onload = startGame;

function startGame() {
	modal.innerHTML = `
  <div class="modal-content">
    <h2>Select game level</h2>
    <button class="menuButton" data-level="easy">Easy ✸</button>
    <button class="menuButton" data-level="medium">Medium ✸✸</button>
    <button class="menuButton" data-level="hard">Hard ✸✸✸</button>
  </div>`;

	document.querySelectorAll('.menuButton').forEach((button) => {
		button.addEventListener('click', () => {
			const level = button.getAttribute('data-level')!;
			renderGame(level);
			modal.style.display = 'none';
		});
	});
}

function renderGame(level: string) {
	GAME_CONFIG = levelData[level as keyof typeof levelData];
	PAIRS = GAME_CONFIG.cards / 2;
	renderCards(shuffleArray(charactersArray, PAIRS));
	gameLevel.innerText = GAME_CONFIG.display;
	gameBoard.addEventListener('click', revealCard);
	game.setAttribute('data-level', level);
	game.style.display = 'block';
	TIMER = setInterval(timer, 1000);
}

function renderCards(array: string[]) {
	for (let i = 0; i < array.length; i++) {
		const card = document.createElement('div');
		card.className = 'gameCard play';
		card.innerHTML = `
			<div class="front"></div>
			<div class="back" style="background-image: url(${array[i]});"></div>`;

		gameBoard!.appendChild(card);
	}
}

function timer() {
	if (SECONDS === 59) {
		SECONDS = -1;
		MINUTES++;
	}

	SECONDS++;

	const gameTimer: HTMLDivElement = document.querySelector('.timer')!;
	gameTimer.innerText = `${MINUTES < 10 ? '0' + MINUTES : MINUTES}:${
		SECONDS < 10 ? '0' + SECONDS : SECONDS
	}`;
}

const revealCard = (e: Event) => {
	const clickedCard = (<HTMLDivElement>e.target).parentElement;

	if (clickedCard?.classList.contains('play')) {
		clickedCard.classList.remove('play');
		clickedCard.classList.add('active');

		if (!firstClick) {
			firstClick = clickedCard as HTMLDivElement;
		} else {
			gameBoard.removeEventListener('click', revealCard);

			const backSecondClickSide =
				clickedCard.lastElementChild as HTMLDivElement;
			const backFirstClickSide = firstClick.lastElementChild as HTMLDivElement;

			if (
				backFirstClickSide.style.backgroundImage ===
				backSecondClickSide.style.backgroundImage
			) {
				firstClick.classList.add('shake');
				clickedCard.classList.add('shake');
				freeze(clickedCard as HTMLDivElement, 'shake', 'done');
				PAIRS--;
				POINTS = POINTS + GAME_CONFIG.multiplier;
			} else {
				freeze(clickedCard as HTMLDivElement, 'active', 'play', 600);
				if (POINTS > 0) POINTS = POINTS - 2;
			}

			MOVES += 1;
			gameScore.innerText = `${POINTS} points`;
			gameMoves.innerText = `${MOVES} move count`;
			PAIRS === 0 && endGame();
		}
	}
};

const endGame = () => {
	if (PAIRS === 0) return;
	const modalContent = modal.firstElementChild!;
	modal.style.display = 'flex';
	modalContent.innerHTML = `
		<p>You earned <span class="score">${POINTS} points</span> in <span class="moves">${MINUTES}:${SECONDS}</span>
			and <span class="moves">${MOVES} moves</span>, congratulations!🎉
		</p><button class="playAgain" onclick="window.location.reload()">Play again</button>`;

	gameBoard.removeEventListener('click', revealCard);
	clearInterval(TIMER);
};

function freeze(
	secondElement: HTMLDivElement,
	firstClass: string,
	secondClass: string,
	freezeTime: number = 1000
) {
	setTimeout(() => {
		firstClick!.classList.remove(firstClass);
		secondElement.classList.remove(firstClass);

		firstClick!.classList.add(secondClass);
		secondElement.classList.add(secondClass);

		firstClick = null;

		gameBoard.addEventListener('click', revealCard);
	}, freezeTime);
}
