import moment from 'moment';

const state = {
  lastSpeech: null
}

function start() {
  setInterval(() => {

    if (isTimeToSpeak()) {
      state.lastSpeech = moment();
      const text = generateSpeech();
      console.log('[isTimeToSpeak] ', text);
    }

  }, 5000);
}

const dictionary = {
  hello: [ "", "Эй", "Ну что", "Карамба" ],
  who: ["белые нигеры",
    "куски мяса",
    "программисты",
    "бездельники",
    "бабкины внуки",
    "тюленчики",
    "нищеброды",
    "будущие безработные"],
  speech: [
    "скоро вас всех положит короновирус",
    "долго будете делать вид что работаете?",
    "отдыхать то тоже нужно",
    "может перерывчик?",
    "я бы на вашем месте сходил оттрапезничать",
    "как там Мирошка?",
    "осадим огурчика?",
    "над кем сегодня будем издеваться?",
    "тирста!",
    "поиграем?",
    "сделал дело, можешь играть смело",
    "может партеечку?"
  ]
};

function generateSpeech() {
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

function isTimeToSpeak() {
  const now = moment();
  const currentHour = now.get('hour');
  const isDayHours = currentHour > 11 && currentHour < 21;
  const speechDelayMin = 60 * 2 + getRandom(30, 120);
  const isNotSpam = !state.lastSpeech || now.diff(state.lastSpeech, 'minutes') > speechDelayMin;
  return isDayHours && isNotSpam;
}

export default {
  start
}