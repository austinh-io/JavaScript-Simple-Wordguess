'use strict';

const buttonGroup = document.getElementById('button-group');
const guessCountLabel = document.getElementById('guess-count');
const theWordLabel = document.getElementById('word-display');
const categoryLabel = document.getElementById('category-label');
const resetButton = document.getElementById('reset-button');
const gameImage = document.getElementById('game-image');

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

function onButtonClicked() {
  if (gameEnabled) {
    this.disabled = true;
    processPlayerTurn(this.innerText);
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

function updateGuessCountLabel() {
  guessCountLabel.innerText = guessCount;
  setGameImage(guessCount);
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

// function setWord(word) {
//   theWord = word;
// }

function setTestMode(bool) {
  testingMode = bool;

  if (testingMode) {
    testingLabel.classList.remove('hidden');
    theWordTestDisplay.innerText = theWord;
  } else {
    testingLabel.classList.add('hidden');
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
  checkPlayerProgress();
}

function checkPlayerProgress() {
  if (gameEnabled) {
    if (theWord.toLowerCase() === hiddenChars.join('').toLowerCase()) {
      alert('You are winner!');
      gameEnabled = false;
    }

    if (guessCount == 0) {
      alert('You lost!');
      gameEnabled = false;
    }
  }
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

function updateHiddenChars(index, char) {
  hiddenChars[index] = char;
}

function decrementGuessCount() {
  if (guessCount > 0) {
    guessCount--;
  }

  if (guessCount <= 0) {
    gameEnabled = false;
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

function resetButtons() {
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

function resetGuessCount() {
  guessCount = initGuessCount;
  updateGuessCountLabel();
}

function setGameImage(imageSequence) {
  gameImage.src =
    './assets/damage images/captioned images/Damage Image ' +
    imageSequence +
    '.png';
}

function setGuessCount(guesses) {
  initGuessCount = guesses;
  guessCount = guesses;
}

function resetGameImage() {
  gameImage.src =
    './assets/damage images/captioned images/Damage Image ' +
    guessCount +
    '.png';
}

function resetGame() {
  getWord();
  resetButtons();
  resetGuessCount();
  hideWord();
  resetGameImage();
  updateGuessCountColor();
  categoryLabel.innerText = theCategory;

  gameEnabled = true;
}

async function catchWordList() {
  const response = await fetch('./wordList.json');
  const wordListObj = await response.json();

  listOfWords = [...wordListObj];
  console.log(listOfWords);
}

function getWord() {
  let randomWordIndex = getRandomInt(listOfWords.length);

  theWord = listOfWords[randomWordIndex].word;
  theCategory = listOfWords[randomWordIndex].categories[0];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function setWord(input) {
  console.log('3 setWord');

  theWord = input;
  console.log('3 ' + theWord);
}

async function initGame() {
  await catchWordList();

  getWord();

  categoryLabel.innerText = theCategory;

  resetButton.addEventListener('click', resetGame);
  initButtonGroup();

  setGuessCount(5);
  setTestMode(false);
  updateGuessCountColor();

  updateGuessCountLabel();
  hideWord();
  resetGameImage();

  console.log('init ' + theWord);
}

initGame();
