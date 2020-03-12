import puppeteer from 'puppeteer';
import controller from './gameController';
const headless = !!process.env.HEADLESS;
const auth = process.env.SKYPE_AUTH;

const WAIT_DOM_OPTIONS = {timeout: 120000, visible: true};

// let currentGameUrl = void(0);

const state = {
  getReadyPromise: null,
  currentGameUrl: void(0)
};

async function start() {
    console.log("Skype background running...");

    if (!auth) {
      console.warn('WARN! process.env.SKYPE_AUTH required');

    } else {
      const gameEmitter = controller.getEmitter();
      gameEmitter.on('url', onUrl);
      gameEmitter.on('start', getReady);
      gameEmitter.on('stop', closePuppeteer);
    }
}

async function onUrl(url) {
    const isNewGameUrl = !!url && url !== state.currentGameUrl;
    if (isNewGameUrl) {
        state.currentGameUrl = url;
        await sendMessage(url);
    }
}

async function login(page) {
    console.group("[skype] -> [login]");
    try {
        const [login, password] = auth.split('/');
        console.log('goto');
        await page.goto('https://web.skype.com/', {waitUntil: 'networkidle0'});

        console.log('waitFor.type input[type="email"]');
        const email = await page.waitFor('input[type="email"]');
        await email.type(login);

        console.log('waitFor.click input[type="submit"]');
        const submitEmail = await page.waitFor('input[type="submit"]');
        await submitEmail.click();

        console.log('waitFor.type input[type="password"]');
        await page.waitFor(1000);
        const pass = await page.waitFor('input[type="password"]');
        await pass.type(password);

        console.log('waitFor.click input[type="submit"]');
        const passSubmut = await page.waitFor('input[type="submit"]');
        await passSubmut.click();

        securityAlert(page);

        console.log('✓ done');

    } finally {
        console.groupEnd();
    }
}

async function securityAlert(page) {
    try {
        const submitButton = await page.waitFor('#iLandingViewAction', {timeout: 10000, visible: true});
        await submitButton.click();
    } catch(e) {
        //Ignore error
    }
}

async function activateChat(page) {
  console.group('[skype] -> [activateChat]');
  try {
    console.log('waitFor.click geoguessr');

    const [textarea, isChatActivated] = await Promise.all([
      page.waitFor('.DraftEditor-root', WAIT_DOM_OPTIONS),
      page.waitFor(() => {
        const chat = document.querySelector('[title^="GeoGuessr"]');
        chat && chat.click();
        return !!document.querySelector('.DraftEditor-root');
      }, WAIT_DOM_OPTIONS)
    ]);
    console.log('✓ done');

  } finally {
    console.groupEnd();
  }
}

async function echoToChat(page, text) {
    console.group('[skype] -> [echoToChat]');
    try {
        console.log('textarea.click.type');
        const textarea = await page.waitFor('.DraftEditor-root', WAIT_DOM_OPTIONS);
        await textarea.click();
        await textarea.type(text);

        console.log('waitFor [title="Send message"]');
        const sendButton = await page.waitFor('[title="Send message"], [title="Отправить сообщение"]', WAIT_DOM_OPTIONS);
        await sendButton.click();
        console.log('✓ done');

        await page.waitFor(6000);

    } finally {
        console.groupEnd();
    }
}

async function getReady() {

  if (!state.getReadyPromise) {
    state.getReadyPromise = new Promise(async (resolve, reject) => {
      console.group('[skype] -> [getReady]');
      const browser = await puppeteer.launch({
        headless: headless,
        args: [
          '--no-sandbox'
        ]
      });
      state.browser = browser;

      try {

        const page = await browser.newPage();
        page.on('close', reset);

        await login(page);
        await activateChat(page);
        resolve(page);
        console.log('✓ done');

      } catch (e) {
        console.error(`Error: ${e.message}`);
        browser.close();
        reject(e);

      } finally {
        console.groupEnd();
      }
    });
  }
  return state.getReadyPromise;
}

async function sendMessage(text) {
    console.group('[skype] -> [sendMesage]');

    try {
      const page = await getReady();
      await echoToChat(page, text);
      console.log('✓ done');

    } catch (e) {
        console.error(`Error: ${e.message}`);
    } finally {
      closePuppeteer();
      console.groupEnd();
    }
}

function closePuppeteer() {
  state.browser && state.browser.close();
}

function reset() {
    state.getReadyPromise = null;
    state.currentGameUrl = void(0);
}

export default {
    start,
    sendMessage
};