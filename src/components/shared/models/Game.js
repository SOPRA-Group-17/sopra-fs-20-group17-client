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
      this.correctCards = null;
      this.playerList = [];
      Object.assign(this, data);
    }
  }
  export default Game;
  