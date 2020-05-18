/**
 * Player model
 *
 */

//TODO add fields
class Player {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.status = null;
    this.score = null;
    this.role = null;
    this.game = null;
    Object.assign(this, data);
  }
}
export default Player;
