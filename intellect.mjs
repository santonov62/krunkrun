import moment from 'moment';
import gameController from './gameController';
import skype from './skype';

const dictionary = {
  hello: [ "", "эй", "ну что", "карамба", "шалом", "коничива", "салом", "бонжюр", "хенде хох" ],
  who: ["недопрограммисты",
    "куски мяса",
    "программисты",
    "бездельники",
    "бабкины внуки",
    "тюленчики",
    "баклажанчики",
    "рабы",
    "гребцы",      
    "дорогие друзья",
    "пацаны",
    "амигос",
    "нищеброды",
    "будущие безработные"],
  speech: [
    "все-равно подохните от короновируса! Рубанем?",
    "долго будете делать вид что работаете?",
    "отдыхать-то тоже нужно",
    "может перерывчик?",
    "накажем Мирошку?",
    "осадим огурчика?",
    "над кем сегодня будем издеваться?",
    "лежать+лежать",
    "я лучший в мире а ты хуй",
    "сколько будет 100+200?",
    "триста!",
    "жду вас",
    "мамка моя и то лучше играет",
    "кто не играет тот гей",
    "помните, Сладкий Васятка особо опасен сзади!",
    "поиграем?",
    "чем длиннее ствол, тем короче член",
    "респ не контролим!",
    "Кого сегодня дрюкаем?",
    "сделал дело, можешь играть смело",
    "небо, солнце и лучи, в жопу пулю получию",
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
  // emitter.on('start', () => state.lastGame = moment());
  emitter.on('stop', () => state.lastGame = moment());
  setInterval(check, 60000 * 15);
}

async function check() {
  try {
    if (isTimeToGame()) {
      await skype.sendMessage(generateSpeech());
      state.lastGame = moment();
      // await gameController.startGame();
    }
  } catch(e) {
    console.error(e.message);
  }
}

function generateSpeech() {
  state.lastSpeak = moment();
  const hello = randomArrayEl(dictionary.hello);
  const who = randomArrayEl(dictionary.who);
  const speech = randomArrayEl(dictionary.speech);
  const text = `${!!hello ? `${hello}, ` : ``}${who}, ${speech}`;
  const textWithUpperFirst = text.charAt(0).toUpperCase() + text.slice(1);
  return textWithUpperFirst;
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function randomArrayEl (array) {
  return array[Math.floor(Math.random() * array.length)];
}

function isTimeToGame() {
  const now = moment();
  const currentHour = now.get('hour');
  const isDayHours = currentHour > 11 && currentHour < 21;
  const gameDelayMin = 120 + getRandom(1, 120);  // 3 hours + random minutes
  const isTimeToGame = !state.lastGame || now.diff(state.lastGame, 'minutes') > gameDelayMin;
  return isDayHours && isTimeToGame;
}

export default {
  start,
  generateSpeech
}