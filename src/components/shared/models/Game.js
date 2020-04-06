/**
 * User model
 *
 */

//TODO add fields
class Game {
    constructor(data = {}) {
      this.gameId = null;
      this.name = null;
      this.playerList = null;
      this.correctCards = null;
      this.status = null;
      Object.assign(this, data);
    }
  }
  export default Game;
  