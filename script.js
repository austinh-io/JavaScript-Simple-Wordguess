'use strict';

const buttonGroup = document.getElementById('button-group');
const guessCountLabel = document.getElementById('guess-count');
const theWordLabel = document.getElementById('word-display');
const resetButton = document.getElementById('reset-button');
const gameImage = document.getElementById('game-image');

//Testing labels
const theWordTestDisplay = document.getElementById('the-word');
const testingLabel = document.getElementsByClassName('testing-label')[0];

let buttons = [];
let inputLetters = [];
let hiddenChars = [];

let gameEnabled = true;
let testingMode = false;

let theWord = '';

let initGuessCount = 0;
let guessCount = 0;

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

function updateGuessCountColor() {
  const started = ['#4ABAF7', '#004C75'];
  const halfFail = ['#26FFB0', '#398066'];
  const nearFail = ['#FF5C92', '#802E49'];
  const fail = ['#848484', '#525252'];

  if (guessCount == initGuessCount) setGuessCountColor(started[0], started[1]);
  else if (guessCount == 1) setGuessCountColor(nearFail[0], nearFail[1]);
  else if (guessCount < initGuessCount && guessCount > 0)
    setGuessCountColor(halfFail[0], halfFail[1]);
  else setGuessCountColor(fail[0], fail[1]);
}

function setGuessCountColor(color, bgColor) {
  guessCountLabel.style.color = color;
  guessCountLabel.style.backgroundColor = bgColor;
}

function setWord(word) {
  theWord = word;
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

function onButtonClicked() {
  if (gameEnabled) {
    processPlayerTurn(this.innerText);
    this.disabled = true;
  }
}

function processPlayerTurn(letterInput) {
  let theWordSplit = theWord.toLowerCase().split('');
  let letterInputLower = String(letterInput).toLowerCase();

  if (!matchingLetter(theWordSplit, letterInputLower)) {
    decrementGuessCount();
  }

  // if (
  //   !matchingLetterRecursive(
  //     theWordSplit.length,
  //     theWordSplit,
  //     letterInputLower
  //   )
  // ) {
  //   decrementGuessCount();
  // }

  updateTheWordLabel(hiddenChars.join('').toUpperCase());
  updateGuessCountColor();
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

function matchingLetterRecursive(n, word, letter) {
  let letterMatched = false;

  if (word[n] === letter) {
    updateHiddenChars(n, letter);
    letterMatched = true;
  }

  if (n < 0) {
    return letterMatched;
  }

  matchingLetterRecursive(n - 1, word, letter);
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
  resetButtons();
  resetGuessCount();
  hideWord();
  resetGameImage();
  updateGuessCountColor();

  gameEnabled = true;
}

function initGame() {
  resetButton.addEventListener('click', resetGame);
  initButtonGroup();

  setWord('Bananas');
  setGuessCount(5);
  setTestMode(false);
  updateGuessCountColor();

  updateGuessCountLabel();
  hideWord();
  resetGameImage();
}

initGame();
