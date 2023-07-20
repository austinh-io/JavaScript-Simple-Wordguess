'use strict';

const buttonGroup = document.getElementById('button-group');
const guessCountLabel = document.getElementById('guess-count');
const theWordLabel = document.getElementById('word-display');
const theWordTestDisplay = document.getElementById('the-word'); //Just for testing.

let buttons = [];
let inputLetters = [];
let hiddenWord = [];

let gameEnable = true;

let theWord = '';

let initGuessCount = 26;
let guessCount = initGuessCount;

function setWord(word) {
  theWord = word;
  theWordTestDisplay.innerText = word; //Remove this for the final game, as it is only used for testing.b
}

function onButtonClicked() {
  updateGuessCount();

  if (gameEnable) {
    verifyLetter(this.innerText);
    this.disabled = true;
  }
}

function verifyLetter(letterInput) {
  let theWordSplit = theWord.toLowerCase().split('');
  let letterInputLower = String(letterInput).toLowerCase();

  for (let i = 0; i < theWordSplit.length; i++) {
    if (theWordSplit[i] === letterInputLower) {
      hiddenWord[i] = letterInputLower;
    }
  }

  theWordLabel.innerText = hiddenWord.join('').toUpperCase();
}

function updateGuessCount() {
  if (guessCount <= 0) {
    gameEnable = false;
  } else {
    guessCount--;
  }
  guessCountLabel.innerText = guessCount;
}

function hideWord() {
  //TODO: make it only hide LETTERS. Numbers, spaces, and special characters should NOT be hidden!
  hiddenWord = [];

  theWord.split('').forEach((letter) => {
    isLetter(letter) ? hiddenWord.push('_') : hiddenWord.push(letter);
  });

  theWordLabel.innerText = hiddenWord.join('');
}

function isLetter(string) {
  return string.length === 1 && string.match(/[a-z]/i);
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

function resetButtons() {
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

function resetWord() {
  theWordLabel.innerText = theWord;
}

function resetGuessCount() {
  guessCount = initGuessCount;
  guessCountLabel.innerText = guessCount;
}

function resetGame() {
  resetButtons();
  resetWord();
  resetGuessCount();
  hideWord();

  gameEnable = true;
}

function initGame() {
  initButtonGroup();
  guessCountLabel.innerText = initGuessCount;

  let resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', resetGame);

  resetWord();
  setWord('1234 !@#% lol');
  hideWord();
}

initGame();
