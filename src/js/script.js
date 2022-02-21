const setItemOnLocalStorage = (key, value) => {
  if (key && value) localStorage.setItem(key, value);
};

const getItemOfLocalStorage = (key) => {
  if (key) return localStorage.getItem(key);
};

const copyrightYear = document.querySelector('[data-js="copyright-year"]');

const updateCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  const yearLocalStorage = getItemOfLocalStorage('year');

  if (yearLocalStorage && yearLocalStorage === currentYear) {
    return yearLocalStorage;
  } else {
    setItemOnLocalStorage('year', currentYear);
    return getItemOfLocalStorage('year');
  }
};

copyrightYear.textContent = updateCurrentYear();

// GAME ========================================================================
const interface = {
  countdown: document.querySelector('[data-js="homescreen-countdown"]'),
  homescreen: document.querySelector('[data-js="homescreen"]'),
  playBtn: document.querySelector('[data-js="play-btn"]'),
  score: document.querySelector('[data-js="game-score"]'),
  time: document.querySelector('[data-js="game-time"]'),
  word: document.querySelector('[data-js="game-word"]'),
};

const letters = 'abcdefghijklmnopqrstuvwxyz';

let gameScore = 0;
let userTypedWord = [];
let wordSpansAsArray = [];
let counter = 0;

const words = [
  'Idade',
  'Aposentado',
  'Zona',
  'Jogar',
  'Pacote',
  'Ninho',
  'Comida',
  'Farinha',
  'Dinamite',
  'Banana',
];

const toggleHideElements = (elements) => {
  elements.forEach((element) => element.classList.toggle('hidden-display'));
};

const leftZero = (value) => (value < 10 ? `0${value}` : value);

const getRandomInteger = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const homescreenCountdown = () => {
  let countdownTime = 5;
  const timer = setInterval(() => {
    interface.countdown.textContent = countdownTime;
    --countdownTime;

    if (countdownTime === -1) {
      clearInterval(timer);
      toggleHideElements([interface.homescreen]);
      startGame();
      interface.countdown.textContent = 5;
    }
  }, 1000);
};

const gameCountdown = (time = 60) => {
  const timer = setInterval(() => {
    interface.time.textContent = leftZero(time);
    --time;

    if (time === -1) {
      clearInterval(timer);
      stopGame();
    }
  }, 1000);
};

const getRandomWords = () => {
  const randomWord = words[getRandomInteger(0, words.length)];
  return randomWord.toLowerCase();
};

const displayCurrentWord = () => {
  let randomWord = getRandomWords();
  let randomWordAsArray = randomWord.split('');

  interface.word.innerHTML = '';

  randomWordAsArray.forEach((letter) => {
    const letterSpan = document.createElement('span');
    letterSpan.classList.add('game__word');
    letterSpan.textContent = letter;
    interface.word.appendChild(letterSpan);
  });

  wordSpansAsArray = document.querySelectorAll('.game__word');
};

window.addEventListener('keydown', (event) => {
  let currentWord = '';
  wordSpansAsArray.forEach((span) => {
    currentWord += span.innerText;
  });

  let pressedKey = event.key;

  if (letters.includes(pressedKey)) {
    userTypedWord.push(pressedKey);

    if (pressedKey === wordSpansAsArray[counter].innerText) {
      wordSpansAsArray[counter].classList.add('game__word--correct');
    } else {
      wordSpansAsArray.forEach((spanChar) => {
        spanChar.classList.add('game__word--wrong');
      });
      setTimeout(() => {
        interface.word.innerHTML = '';
        displayCurrentWord();
        counter = 0;
				gameScore = 0;
        return;
      }, 100);
    }

    if (counter + 1 === currentWord.length) {
      wordSpansAsArray.forEach((spanChar) => {
        spanChar.classList.add('game__word--correct');
      });
      setTimeout(() => {
        interface.word.innerHTML = '';
        displayCurrentWord();
        counter = 0;
        gameScore++;
        interface.score.innerText = leftZero(gameScore);
        return;
      }, 100);
    }

    counter++;
  }
});

const startGame = () => {
  gameCountdown();
  displayCurrentWord();
};

const stopGame = () => {
  interface.word.innerHTML = '';

  toggleHideElements([
    interface.playBtn,
    interface.homescreen,
    interface.countdown,
  ]);

  console.log('The game is stoped');
};

interface.playBtn.addEventListener('click', () => {
  toggleHideElements([interface.playBtn, interface.countdown]);
  homescreenCountdown();
});
