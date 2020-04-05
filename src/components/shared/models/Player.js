/**
 * Player model
 *
 */

//TODO add fields
class Player {
    constructor(data = {}) {
        //TODO: all fields?
      this.id = null;
      this.username = null;
      this.token = null;
      this.status = null;
      this.game = null;
      Object.assign(this, data);
    }
  }
  export default Player;
  