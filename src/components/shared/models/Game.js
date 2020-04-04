/**
 * User model
 *
 */

//TODO add fields
class Game {
    constructor(data = {}) {
      this.id = null;
      this.name = null;
      this.usernames = null;
      this.status = null;
      Object.assign(this, data);
    }
  }
  export default Game;
  