'use strict';

const buttonGroup = document.getElementById('button-group');
const guessCountLabel = document.getElementById('guess-count');
const theWordLabel = document.getElementById('word-display');
const categoryLabel = document.getElementById('category-label');
const resetButtons = document.getElementsByClassName('reset-button');
const gameDisplay = document.getElementById('game-display');

//Modal items
const winModal = document.getElementById('win-modal');
const loseModal = document.getElementById('lose-modal');
const gameEndModalWord = document.getElementById('game-end-modal-word');

//Testing labels
const theWordTestDisplay = document.getElementById('the-word');
const testingLabel = document.getElementsByClassName('testing-label')[0];

let buttons = [];
let hiddenChars = [];
let listOfWords = new Array();

let gameEnabled = true;
let testingMode = false;

let theWord = '';
let theCategory = '';

let initGuessCount = 0;
let guessCount = 0;

//Animation
// const spinningPlayer = document
//   .getElementById('player-body')
//   .animate([{ transform: 'rotateZ(0deg)' }, { transform: 'rotateZ(360deg)' }], {
//     fill: 'forwards',
//     easing: 'steps(4, end)',
//     duration: 1,
//   });

function animateScript() {
  let playerIdle = document.querySelector('.player-idle');
  let singleFrameWidth = playerIdle.offsetWidth;
  let totalFrameWidth = playerIdle.offsetWidth * 6;
  let updatedFrame = -totalFrameWidth + singleFrameWidth * 6;

  console.log(singleFrameWidth);
  console.log(totalFrameWidth);
  console.log(updatedFrame);
  playerIdle.style.backgroundPosition = updatedFrame + 'px' + ' 0px';
}

animateScript();

function playerIdle() {
  let rotator = document.getElementById('player-body'); //get the element
  let dir = '/assets/characters/player1/idle/'; //images folder
  let delayInSeconds = 2; //delay in seconds
  let num = 1; //start number
  let len = 6; //limit
  setInterval(function () {
    //interval changer
    rotator.style.backgroundImage = 'url(' + dir + 'idle' + num + '.svg)'; //change picture
    num = num === len ? 1 : ++num; //reset if last image reached
  }, delayInSeconds * 50);
}

// playerIdle();

function onButtonClicked() {
  if (gameEnabled) {
    this.disabled = true;
    processPlayerTurn(this.innerText);
  }
}

function processPlayerTurn(letterInput) {
  let theWordSplit = theWord.toLowerCase().split('');
  let letterInputLower = String(letterInput).toLowerCase();

  if (!matchingLetter(theWordSplit, letterInputLower)) {
    decrementGuessCount();
  }

  updateTheWordLabel(hiddenChars.join('').toUpperCase());
  updateGuessCountColor();
  setGameState();
}

function matchingLetter(word, letter) {
  let letterMatched = false;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      updateHiddenChars(i, letter);
      letterMatched = true;
    }
  }
  return letterMatched;
}

function setGameState() {
  console.log(guessCount);
  console.log(gameEnabled);
  if (gameEnabled) {
    //Player Won
    if (theWord.toLowerCase() === hiddenChars.join('').toLowerCase()) {
      winModal.showModal();
      gameEnabled = false;
    }

    //Player Lost
    if (guessCount === 0) {
      loseModal.showModal();
      gameEnabled = false;
    }
  }
}

function createButton(letter) {
  const buttonElement = document.createElement('button');
  const buttonContent = document.createTextNode(letter);
  buttonElement.appendChild(buttonContent);
  buttonElement.setAttribute('id', 'btn-' + letter.toLowerCase());
  buttonElement.setAttribute('class', 'button letter-button');
  buttonElement.addEventListener('click', onButtonClicked);
  buttons.push(buttonElement);

  buttonGroup.appendChild(buttonElement);
}

function initButtonGroup() {
  /*
  Latin script is just the English alphabet.
  I named it that because it seemed more concise and consistent if I decided to add more languages later.
  The number is based on the letters location in UTF-16, which is used by the String.fromCharCode function.
  */
  const latinScriptUppercase = 65;
  const latinScriptLowercase = 97;

  const lettersInAlphabet = 26;

  for (let i = 0; i < lettersInAlphabet; i++) {
    createButton(String.fromCharCode(i + latinScriptUppercase));
  }
}

function initResetButtons() {
  for (let i = 0; i < resetButtons.length; i++) {
    resetButtons[i].addEventListener('click', resetGame);
  }
}

function updateGuessCountLabel() {
  guessCountLabel.innerText = guessCount;
}

function updateTheWordLabel(text) {
  theWordLabel.innerText = text;
}

const guessCountColors = {
  startedPrimary: '#4ABAF7',
  startedBackground: '#004C75',

  halfFailedPrimary: '#26FFB0',
  halfFailedBackground: '#398066',

  nearFailedPrimary: '#FF5C92',
  nearFailedBackground: '#802E49',

  failedPrimary: '#848484',
  failedBackground: '#525252',
};

function updateGuessCountColor() {
  if (guessCount == initGuessCount)
    setGuessCountColor(
      guessCountColors.startedPrimary,
      guessCountColors.startedBackground
    );
  else if (guessCount == 1)
    setGuessCountColor(
      guessCountColors.nearFailedPrimary,
      guessCountColors.nearFailedBackground
    );
  else if (guessCount < initGuessCount && guessCount > 0)
    setGuessCountColor(
      guessCountColors.halfFailedPrimary,
      guessCountColors.halfFailedBackground
    );
  else
    setGuessCountColor(
      guessCountColors.failedPrimary,
      guessCountColors.failedBackground
    );
}

function setGuessCountColor(color, bgColor) {
  guessCountLabel.style.color = color;
  guessCountLabel.style.backgroundColor = bgColor;
}

function setTestMode(bool) {
  testingMode = bool;

  if (testingMode) {
    testingLabel.classList.remove('hidden');
    theWordTestDisplay.innerText = theWord;
  } else {
    testingLabel.classList.add('hidden');
  }
}

function updateHiddenChars(index, char) {
  hiddenChars[index] = char;
}

function decrementGuessCount() {
  if (guessCount > 0) {
    guessCount--;
  }

  updateGuessCountLabel();
}

function hideWord() {
  hiddenChars = [];

  theWord.split('').forEach((character) => {
    isLetter(character) ? hiddenChars.push('_') : hiddenChars.push(character);
  });

  updateTheWordLabel(hiddenChars.join(''));
}

function isLetter(string) {
  return string.length === 1 && string.match(/[a-z]/i);
}

function resetGameButtons() {
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

function resetGuessCount() {
  guessCount = initGuessCount;
  updateGuessCountLabel();
}

function setGuessCount(guesses) {
  initGuessCount = guesses;
  guessCount = guesses;
}

function resetGame() {
  getWord();
  resetGameButtons();
  resetGuessCount();
  hideWord();
  updateGuessCountColor();
  categoryLabel.innerText = theCategory;
  loseModal.close();
  winModal.close();

  gameEnabled = true;
  // spinningPlayer.play();
}

async function catchWordList() {
  const response = await fetch('../data/wordList.json');
  const wordListObj = await response.json();

  listOfWords = [...wordListObj];
}

function getWord() {
  let randomWordIndex = getRandomInt(listOfWords.length);

  theWord = listOfWords[randomWordIndex].word;
  theCategory = listOfWords[randomWordIndex].category;
  gameEndModalWord.innerText = theWord;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function initGame() {
  await catchWordList();

  getWord();

  categoryLabel.innerText = theCategory;

  initButtonGroup();
  initResetButtons();

  setGuessCount(2);
  setTestMode(false);
  updateGuessCountColor();

  updateGuessCountLabel();
  hideWord();
}

initGame();
