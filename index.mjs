import bot from './bot';
// import bot from './mocks/bot.mocks.mjs';
import httpServer from './httpServer';
import skype from './skype';
import intellect from "./intellect";

(async () => {
  httpServer.startServer();
  skype.start();
  bot.start();
  intellect.start();
})();
