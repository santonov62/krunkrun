import gameController from '../gameController';

export default {
  start: async () => {
    const game = gameController.getState();
    try {
      await createAndWaitForGameEnd();
    } catch (e) {
      console.error(e.message);
    } finally {
      // await gameController.stopGame();
      console.log('Игра закончена.');
    }

    async function createAndWaitForGameEnd() {

      console.log(`Ща создам игру на ${game.gameTime} мин`);
      const url = await gameController.startGame();
      if (!!url) {
        console.log(url);
      } else {
        console.log('Не получилось создать игру. Попробуйте позже.');
        throw new Error(`[startGame] didn't return url`);
      }

      const result = await gameController.waitEndGame();
      if (!!result) {
        console.log(result);
      }
    }
    return Promise.resolve();
  }
}