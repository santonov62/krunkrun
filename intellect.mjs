import moment from 'moment';
import gameController from './gameController';
import skype from './skype';

const dictionary = {
  hello: [ "", "эй", "ну что", "карамба", "шалом" ],
  who: ["недопрограммисты",
    "куски мяса",
    "программисты",
    "бездельники",
    "бабкины внуки",
    "тюленчики",
    "рабы",
    "нищеброды",
    "будущие безработные"],
  speech: [
    "все-равно подохните от короновируса! Заходи",
    "долго будете делать вид что работаете?",
    "отдыхать то тоже нужно",
    "может перерывчик?",
    "накажем Мирошку?",
    "осадим огурчика?",
    "над кем сегодня будем издеваться?",
    "триста!",
    "жду вас",
    "кто не подключится тот гей",
    "поиграем?",
    "Кого сегодня дрюкаем?",
    "сделал дело, можешь играть смело",
    "кого там что не устраивало?",
    "может партеечку?"
  ]
};

const state = {
  lastSpeak: null,
  lastGame: null
};

function start() {
  const emitter = gameController.getEmitter();
  emitter.on('start', () => state.lastGame = moment());
  emitter.on('stop', () => state.lastGame = moment());

  setInterval(check, 60000 * 30);
}

async function check() {
  if (isTimeToGame()) {
    state.lastGame = moment();
    await gameController.startGame();
  }
}

function generateSpeech() {
  state.lastSpeak = moment();
  const hello = randomElement(dictionary.hello);
  const who = randomElement(dictionary.who);
  const speech = randomElement(dictionary.speech);
  const text = `${!!hello ? `${hello}, ` : ``}${who}, ${speech}`;
  const textWithUpperFirst = text.charAt(0).toUpperCase() + text.slice(1);
  return textWithUpperFirst;
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function randomElement (array) {
  return array[Math.floor(Math.random() * array.length)];
}

function isTimeToGame() {
  const now = moment();
  const currentHour = now.get('hour');
  const isDayHours = currentHour > 11 && currentHour < 21;
  const gameDelayMin = 180 + getRandom(1, 60);  // 3 hours + random minutes
  const isTimeToGame = !state.lastGame || now.diff(state.lastGame, 'minutes') > gameDelayMin;
  return isDayHours && isTimeToGame;
}

export default {
  start,
  generateSpeech
}