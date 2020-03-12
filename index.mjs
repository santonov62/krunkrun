import bot from './bot';
// import bot from './mocks/bot.mocks.mjs';
import httpServer from './httpServer';
import skype from './skype';

(async () => {
  await httpServer.startServer();
  await skype.start();
  await bot.start();
})();
