/**
 * User model
 *
 */

//TODO add fields
class Game {
    constructor(data = {}) {
      this.gameID = null;
      this.name = null;
      this.status = null;
      this.correctCards = null;
      this.playerList = [];
      Object.assign(this, data);
    }
  }
  export default Game;
  